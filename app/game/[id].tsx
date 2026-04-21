import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, S } from '../../constants/theme';
import { getUserId, getUsername } from '../../lib/storage';
import {
  Game,
  Player,
  startGame,
  submitTurn,
  resetGame,
  subscribeToGame,
} from '../../lib/gameService';

const TURN_DURATION_MS = 10_000;
const TIMEOUT_GRACE_MS = 2_000; // non-current players wait this extra time before triggering timeout

export default function GameScreen() {
  const { id: gameCode } = useLocalSearchParams<{ id: string }>();
  const [userId, setUserId] = useState('');
  const [game, setGame] = useState<Game | null>(null);
  const [loadingGame, setLoadingGame] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [guess, setGuess] = useState('');
  const [timeLeft, setTimeLeft] = useState(10);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const timerAnim = useRef(new Animated.Value(1)).current;
  const timerAnimRef = useRef<Animated.CompositeAnimation | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeTurnId = useRef('');

  // Load user identity
  useEffect(() => {
    getUserId().then(setUserId);
  }, []);

  // Subscribe to game
  useEffect(() => {
    if (!gameCode) return;
    const unsub = subscribeToGame(gameCode as string, (g) => {
      if (g === null) setNotFound(true);
      setGame(g);
      setLoadingGame(false);
    });
    return unsub;
  }, [gameCode]);

  // Manage timer when turn changes
  useEffect(() => {
    if (!game || game.status !== 'active') {
      timerAnimRef.current?.stop();
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    const currentTurnId = game.turnId;
    activeTurnId.current = currentTurnId;
    setGuess('');
    setFeedback(null);
    setSubmitting(false);

    const elapsed = Date.now() - game.timerStart;
    const remaining = Math.max(0, TURN_DURATION_MS - elapsed);

    timerAnim.setValue(remaining / TURN_DURATION_MS);
    timerAnimRef.current?.stop();
    timerAnimRef.current = Animated.timing(timerAnim, {
      toValue: 0,
      duration: remaining,
      useNativeDriver: false,
    });
    timerAnimRef.current.start();

    setTimeLeft(Math.ceil(remaining / 1000));

    if (intervalRef.current) clearInterval(intervalRef.current);

    const isCurrentPlayer = game.playerOrder[game.currentPlayerIndex] === userId;
    const graceMs = isCurrentPlayer ? 0 : TIMEOUT_GRACE_MS;

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const timeLeftMs = game.timerStart + TURN_DURATION_MS - now;
      setTimeLeft(Math.max(0, Math.ceil(timeLeftMs / 1000)));

      if (timeLeftMs <= -graceMs) {
        clearInterval(intervalRef.current!);
        if (activeTurnId.current === currentTurnId) {
          handleTurnEnd(false, currentTurnId);
        }
      }
    }, 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      timerAnimRef.current?.stop();
    };
  }, [game?.turnId, userId]);

  const handleTurnEnd = useCallback(
    async (isCorrect: boolean, turnId: string) => {
      if (submitting) return;
      setSubmitting(true);
      if (isCorrect) setFeedback('correct');
      else setFeedback('wrong');
      await submitTurn(gameCode as string, isCorrect, turnId);
      // submitting flag is reset when new turnId arrives via subscription
    },
    [gameCode, submitting],
  );

  async function handleSubmitGuess() {
    if (!game || submitting) return;
    const currentTurnId = game.turnId;
    const correct = guess.trim().toLowerCase() === game.currentWord.toLowerCase();
    if (!correct) setFeedback('wrong');
    await handleTurnEnd(correct, currentTurnId);
  }

  async function handleStart() {
    if (!gameCode) return;
    await startGame(gameCode as string);
  }

  async function handleReset() {
    if (!gameCode) return;
    await resetGame(gameCode as string);
  }

  // ── Render helpers ──────────────────────────────────────────────

  if (loadingGame) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  if (notFound || !game) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Game not found.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/lobby')}>
          <Text style={styles.backBtnText}>Back to Lobby</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (game.status === 'finished') {
    return <FinishedScreen game={game} userId={userId} onReset={handleReset} />;
  }

  if (game.status === 'waiting') {
    return (
      <WaitingScreen
        game={game}
        gameCode={gameCode as string}
        userId={userId}
        onStart={handleStart}
      />
    );
  }

  // Active game
  const currentPlayerId = game.playerOrder[game.currentPlayerIndex];
  const currentPlayer = game.players[currentPlayerId];
  const isMyTurn = currentPlayerId === userId;
  const timerColor = timerAnim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [Colors.primary, Colors.warning, Colors.success],
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.activeHeader}>
          <View>
            <Text style={styles.turnLabel}>
              {isMyTurn ? '💣 YOUR TURN' : `💣 ${currentPlayer?.username?.toUpperCase()}'S TURN`}
            </Text>
          </View>
          <Animated.Text style={[styles.timerNumber, { color: timerColor }]}>
            {timeLeft}
          </Animated.Text>
        </View>

        {/* Timer bar */}
        <View style={styles.timerBarBg}>
          <Animated.View
            style={[
              styles.timerBarFill,
              { flex: timerAnim, backgroundColor: timerColor },
            ]}
          />
          <Animated.View style={{ flex: Animated.subtract(1, timerAnim) }} />
        </View>

        {/* Feedback flash */}
        {feedback === 'correct' && (
          <View style={[styles.feedbackBanner, { backgroundColor: Colors.success }]}>
            <Text style={styles.feedbackText}>✓ Correct! New word incoming…</Text>
          </View>
        )}
        {feedback === 'wrong' && (
          <View style={[styles.feedbackBanner, { backgroundColor: Colors.primary }]}>
            <Text style={styles.feedbackText}>✗ Wrong — bomb passed!</Text>
          </View>
        )}

        {/* Definition card */}
        <View style={styles.definitionCard}>
          <Text style={styles.definitionLabel}>DEFINITION</Text>
          <Text style={styles.definitionText}>{game.currentDefinition}</Text>
        </View>

        {/* Input (only for current player) */}
        {isMyTurn && !submitting && (
          <View style={styles.guessSection}>
            <TextInput
              style={styles.guessInput}
              value={guess}
              onChangeText={setGuess}
              placeholder="Type the word…"
              placeholderTextColor={Colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleSubmitGuess}
            />
            <TouchableOpacity
              style={[styles.submitBtn, !guess.trim() && styles.disabled]}
              onPress={handleSubmitGuess}
              activeOpacity={0.85}
              disabled={!guess.trim()}
            >
              <Text style={styles.submitBtnText}>Submit Guess</Text>
            </TouchableOpacity>
          </View>
        )}

        {!isMyTurn && (
          <View style={styles.watchingBanner}>
            <Text style={styles.watchingText}>👀 Watching…</Text>
          </View>
        )}

        {/* Player list */}
        <PlayerList
          game={game}
          userId={userId}
          currentPlayerId={currentPlayerId}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ── Sub-screens ─────────────────────────────────────────────────

function WaitingScreen({
  game,
  gameCode,
  userId,
  onStart,
}: {
  game: Game;
  gameCode: string;
  userId: string;
  onStart: () => void;
}) {
  const isHost = game.hostId === userId;
  const playerCount = Object.keys(game.players).length;
  const canStart = playerCount >= 2;

  return (
    <View style={styles.container}>
      <View style={styles.waitingInner}>
        <Text style={styles.waitingTitle}>Waiting Room</Text>

        <View style={styles.codeCard}>
          <Text style={styles.codeLabel}>GAME CODE</Text>
          <Text style={styles.codeValue}>{gameCode}</Text>
          <Text style={styles.codeHint}>Share this with friends to join</Text>
        </View>

        <View style={styles.waitingPlayers}>
          <Text style={styles.waitingPlayersTitle}>Players ({playerCount})</Text>
          {Object.entries(game.players).map(([id, p]) => (
            <View key={id} style={styles.waitingPlayerRow}>
              <Text style={styles.waitingPlayerName}>
                {p.username}
                {id === game.hostId ? '  👑' : ''}
                {id === userId ? '  (you)' : ''}
              </Text>
              <Text style={styles.waitingLives}>{'❤️'.repeat(p.lives)}</Text>
            </View>
          ))}
        </View>

        {isHost ? (
          <TouchableOpacity
            style={[styles.startBtn, !canStart && styles.disabled]}
            onPress={onStart}
            disabled={!canStart}
            activeOpacity={0.85}
          >
            <Text style={styles.startBtnText}>
              {canStart ? 'Start Game 💣' : 'Need at least 2 players'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.waitingForHost}>
            <ActivityIndicator color={Colors.primary} />
            <Text style={styles.waitingForHostText}>Waiting for host to start…</Text>
          </View>
        )}

        <TouchableOpacity style={styles.leaveBtn} onPress={() => router.replace('/lobby')}>
          <Text style={styles.leaveBtnText}>Leave</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function FinishedScreen({
  game,
  userId,
  onReset,
}: {
  game: Game;
  userId: string;
  onReset: () => void;
}) {
  const isHost = game.hostId === userId;
  const winner = game.winnerId ? game.players[game.winnerId] : null;
  const isWinner = game.winnerId === userId;

  return (
    <View style={styles.container}>
      <View style={styles.finishedInner}>
        <Text style={styles.finishedEmoji}>{isWinner ? '🏆' : '💀'}</Text>
        <Text style={styles.finishedTitle}>
          {isWinner ? 'You Win!' : `${winner?.username ?? 'Someone'} Wins!`}
        </Text>
        <Text style={styles.finishedSub}>
          {isWinner
            ? 'Last one standing!'
            : `Better luck next time, ${game.players[userId]?.username}.`}
        </Text>

        <View style={styles.finalScores}>
          {Object.entries(game.players)
            .sort(([, a], [, b]) => b.lives - a.lives)
            .map(([id, p]) => (
              <View key={id} style={styles.finalScoreRow}>
                <Text style={styles.finalScoreName}>
                  {id === game.winnerId ? '🏆 ' : ''}
                  {p.username}
                  {id === userId ? ' (you)' : ''}
                </Text>
                <Text style={[styles.finalScoreLives, !p.isAlive && { opacity: 0.4 }]}>
                  {p.isAlive ? '❤️'.repeat(p.lives) : '💀'}
                </Text>
              </View>
            ))}
        </View>

        {isHost && (
          <TouchableOpacity style={styles.startBtn} onPress={onReset} activeOpacity={0.85}>
            <Text style={styles.startBtnText}>Play Again 🔄</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.leaveBtn} onPress={() => router.replace('/lobby')}>
          <Text style={styles.leaveBtnText}>Back to Lobby</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function PlayerList({
  game,
  userId,
  currentPlayerId,
}: {
  game: Game;
  userId: string;
  currentPlayerId: string;
}) {
  return (
    <View style={styles.playerList}>
      <Text style={styles.playerListTitle}>PLAYERS</Text>
      {game.playerOrder.map((id) => {
        const p: Player = game.players[id];
        if (!p) return null;
        const isCurrent = id === currentPlayerId;
        const isMe = id === userId;
        return (
          <View
            key={id}
            style={[
              styles.playerRow,
              isCurrent && styles.playerRowCurrent,
              !p.isAlive && styles.playerRowDead,
            ]}
          >
            <Text style={[styles.playerName, !p.isAlive && styles.deadText]}>
              {isCurrent ? '💣 ' : ''}
              {p.username}
              {isMe ? ' (you)' : ''}
            </Text>
            <Text style={styles.playerLives}>
              {p.isAlive ? '❤️'.repeat(p.lives) : '💀'}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

// ── Styles ──────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 40, gap: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.bg, gap: 16 },
  errorText: { ...S.h3, color: Colors.textSub },

  // Active game
  activeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  turnLabel: { fontSize: 13, fontWeight: '700', color: Colors.textSub, letterSpacing: 1 },
  timerNumber: { ...S.mono, fontSize: 44 },

  timerBarBg: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  timerBarFill: { borderRadius: 3 },

  feedbackBanner: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  feedbackText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  definitionCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  definitionLabel: { fontSize: 11, fontWeight: '700', color: Colors.textMuted, letterSpacing: 1.5 },
  definitionText: { ...S.body, fontSize: 18, lineHeight: 28, color: Colors.text },

  guessSection: { gap: 10 },
  guessInput: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 15,
    color: Colors.text,
    fontSize: 17,
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },

  watchingBanner: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  watchingText: { ...S.body, color: Colors.textSub },

  playerList: { gap: 8 },
  playerListTitle: { fontSize: 11, fontWeight: '700', color: Colors.textMuted, letterSpacing: 1.5 },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  playerRowCurrent: { borderColor: Colors.primary },
  playerRowDead: { opacity: 0.4 },
  playerName: { ...S.body, fontWeight: '600' },
  deadText: { textDecorationLine: 'line-through' },
  playerLives: { fontSize: 16 },

  // Waiting screen
  waitingInner: { flex: 1, paddingHorizontal: 24, paddingTop: 72, paddingBottom: 32, gap: 20 },
  waitingTitle: { ...S.h1 },
  codeCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  codeLabel: { fontSize: 11, fontWeight: '700', color: Colors.textMuted, letterSpacing: 1.5 },
  codeValue: { fontSize: 36, fontWeight: '800', color: Colors.text, letterSpacing: 8 },
  codeHint: { ...S.small },
  waitingPlayers: { gap: 8 },
  waitingPlayersTitle: { ...S.h3, marginBottom: 4 },
  waitingPlayerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  waitingPlayerName: { ...S.body, fontWeight: '600' },
  waitingLives: { fontSize: 16 },

  startBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 'auto',
  },
  startBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  waitingForHost: { flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'center' },
  waitingForHostText: { ...S.body, color: Colors.textSub },

  leaveBtn: { alignItems: 'center', paddingVertical: 12 },
  leaveBtnText: { color: Colors.textSub, fontSize: 14 },

  // Finished screen
  finishedInner: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 32,
    alignItems: 'center',
    gap: 12,
  },
  finishedEmoji: { fontSize: 72 },
  finishedTitle: { ...S.h1, fontSize: 34, textAlign: 'center' },
  finishedSub: { ...S.body, color: Colors.textSub, textAlign: 'center' },
  finalScores: {
    width: '100%',
    gap: 8,
    marginTop: 12,
    marginBottom: 8,
  },
  finalScoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  finalScoreName: { ...S.body, fontWeight: '600' },
  finalScoreLives: { fontSize: 16 },

  disabled: { opacity: 0.4 },
  backBtn: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  backBtnText: { color: Colors.text, fontWeight: '600', fontSize: 15 },
});
