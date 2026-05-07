import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors, S } from '../../constants/theme';
import {
  Game,
  leaveGame,
  resetGame,
  setPlayerGuess,
  startGame,
  submitTurn,
  subscribeToGame,
} from '../../lib/gameService';
import { getUserId } from '../../lib/storage';
import ArenaView from './components/ArenaView';
import ChatPanel from './components/ChatPanel';
import FinishedScreen from './screens/FinishedScreen';
import WaitingScreen from './screens/WaitingScreen';

const TURN_DURATION_MS = 200_000;
const TIMEOUT_GRACE_MS = 2_000;

// ── Main screen ─────────────────────────────────────────────────

export default function GameScreen() {
  const { id: gameCode } = useLocalSearchParams<{ id: string }>();
  const [userId, setUserId] = useState('');
  const [game, setGame] = useState<Game | null>(null);
  const [loadingGame, setLoadingGame] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [guess, setGuess] = useState('');
  const [timeLeft, setTimeLeft] = useState(10);
  const [submitting, setSubmitting] = useState(false);
  const [showFinished, setShowFinished] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const submittingRef = useRef(false);
  const [feedbackInfo, setFeedbackInfo] = useState<{
    playerId: string;
    type: 'correct' | 'wrong';
    uid: string;
    word: string;
  } | null>(null);
  const gameRef = useRef<Game | null>(null);

  const timerAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timerAnimRef = useRef<Animated.CompositeAnimation | null>(null);
  const pulseAnimRef = useRef<Animated.CompositeAnimation | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeTurnId = useRef('');

  useEffect(() => { getUserId().then(setUserId); }, []);

  useEffect(() => {
    if (game?.status !== 'finished') return;
    const t = setTimeout(() => setShowFinished(true), 3000);
    return () => clearTimeout(t);
  }, [game?.status]);

  useEffect(() => {
    if (!gameCode) return;
    const unsub = subscribeToGame(gameCode as string, (g) => {
      if (g === null) setNotFound(true);
      gameRef.current = g;
      setGame(g);
      setLoadingGame(false);
    });
    return unsub;
  }, [gameCode]);

  // Manage timer + pulse when turn changes
  useEffect(() => {
    if (!game || game.status !== 'active') {
      timerAnimRef.current?.stop();
      pulseAnimRef.current?.stop();
      if (intervalRef.current) clearInterval(intervalRef.current);
      setFeedbackInfo(null);
      return;
    }

    const currentTurnId = game.turnId;
    activeTurnId.current = currentTurnId;
    setGuess('');
    setSubmitting(false);
    submittingRef.current = false;

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

    pulseAnimRef.current?.stop();
    pulseAnim.setValue(1);

    setTimeLeft(Math.ceil(remaining / 1000));

    if (intervalRef.current) clearInterval(intervalRef.current);

    const isCurrentPlayer = game.playerOrder[game.currentPlayerIndex] === userId;
    const graceMs = isCurrentPlayer ? 0 : TIMEOUT_GRACE_MS;

    intervalRef.current = setInterval(() => {
      const timeLeftMs = game.timerStart + TURN_DURATION_MS - Date.now();
      const secs = Math.max(0, Math.ceil(timeLeftMs / 1000));
      setTimeLeft(secs);

      // Start pulsing bomb at 3 seconds
      if (secs <= 3 && secs > 0 && !pulseAnimRef.current) {
        pulseAnimRef.current = Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, { toValue: 1.18, duration: 200, useNativeDriver: false }),
            Animated.timing(pulseAnim, { toValue: 1, duration: 200, useNativeDriver: false }),
          ])
        );
        pulseAnimRef.current.start();
      }

      if (timeLeftMs <= -graceMs) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        if (activeTurnId.current === currentTurnId && !submittingRef.current) {
          const g = gameRef.current;
          const pid = g?.playerOrder[g.currentPlayerIndex];
          const timedOutWord = pid ? (g?.guesses?.[pid] ?? '') : '';
          handleTurnEnd(false, currentTurnId, timedOutWord);
        }
      }
    }, 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      timerAnimRef.current?.stop();
      pulseAnimRef.current?.stop();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game?.turnId, userId]);

  useEffect(() => {
    const r = game?.lastResult;
    if (!r) return;
    setFeedbackInfo({ playerId: r.playerId, type: r.correct ? 'correct' : 'wrong', uid: r.uid, word: r.word });
  }, [game?.lastResult?.uid]);

  const handleTurnEnd = useCallback(
    async (isCorrect: boolean, turnId: string, word: string) => {
      if (submittingRef.current) return;
      submittingRef.current = true;
      setSubmitting(true);
      await Promise.all([
        setPlayerGuess(gameCode as string, userId, ''),
        submitTurn(gameCode as string, isCorrect, turnId, word),
      ]);
    },
    [gameCode, userId],
  );

  async function handleSubmitGuess() {
    if (!game || submittingRef.current) return;
    const correct = guess.trim().toLowerCase() === game.currentWord.toLowerCase();
    await handleTurnEnd(correct, game.turnId, guess.trim());
  }

  // ── Loading / not found ──────────────────────────────────────

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

  if (game.status === 'finished' && showFinished) {
    return (
      <FinishedScreen
        game={game}
        userId={userId}
        onReset={() => { setShowFinished(false); resetGame(gameCode as string); }}
        onLeave={async () => { await leaveGame(gameCode as string, userId); router.replace('/lobby'); }}
      />
    );
  }

  if (game.status === 'waiting') {
    return (
      <WaitingScreen
        game={game}
        gameCode={gameCode as string}
        userId={userId}
        onStart={() => startGame(gameCode as string)}
        onLeave={async () => {
          await leaveGame(gameCode as string, userId);
          router.replace('/lobby');
        }}
      />
    );
  }

  // ── Active game ──────────────────────────────────────────────

  const currentPlayerId = game.playerOrder[game.currentPlayerIndex];
  const isMyTurn = currentPlayerId === userId;

  const timerColor = timerAnim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [Colors.primary, Colors.warning, Colors.success],
  });

  const username = game.players[userId]?.username ?? '';

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Definition */}
        <View style={styles.definitionSection}>
          <View style={styles.defHeader}>
            <Text style={styles.defLabel}>DEFINITION</Text>
            <TouchableOpacity style={styles.chatIconBtn} onPress={() => setChatOpen(true)} activeOpacity={0.75}>
              <Text style={styles.chatIconBtnText}>💬</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.defText} numberOfLines={4}>
            {game.currentDefinition}
          </Text>
        </View>

        {/* Circular arena */}
        <View style={styles.arenaContainer}>
          <ArenaView
            game={game}
            userId={userId}
            currentPlayerId={currentPlayerId}
            timeLeft={timeLeft}
            timerColor={timerColor}
            pulseAnim={pulseAnim}
            feedbackInfo={feedbackInfo}
            guesses={game.guesses ?? {}}
          />
        </View>

        {/* Input */}
        {isMyTurn && !submitting ? (
          <View style={styles.inputSection}>
            <TextInput
              style={styles.guessInput}
              value={guess}
              onChangeText={(text) => {
                setGuess(text);
                setPlayerGuess(gameCode as string, userId, text);
              }}
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
              disabled={!guess.trim()}
              activeOpacity={0.85}
            >
              <Text style={styles.submitBtnText}>Submit</Text>
            </TouchableOpacity>
          </View>
        ) : !submitting ? (
          <View style={styles.watchingBanner}>
            <Text style={styles.watchingText}>Watching…</Text>
            <TouchableOpacity style={styles.chatBtnInline} onPress={() => setChatOpen(true)} activeOpacity={0.75}>
              <Text style={styles.chatBtnInlineText}>💬 Chat</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </KeyboardAvoidingView>

      <ChatPanel
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        gameCode={gameCode as string}
        userId={userId}
        username={username}
        lastWord={game.lastResult?.word}
        lastWordCorrect={game.lastResult?.correct}
      />
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.bg, gap: 16 },
  errorText: { ...S.h3, color: Colors.textSub },
  backBtn: {
    backgroundColor: Colors.card, borderRadius: 12, paddingVertical: 12,
    paddingHorizontal: 24, borderWidth: 1, borderColor: Colors.border,
  },
  backBtnText: { color: Colors.text, fontWeight: '600', fontSize: 15 },
  disabled: { opacity: 0.4 },

  // Active game
  definitionSection: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 12,
    gap: 6,
  },
  defHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  defLabel: { fontSize: 11, fontWeight: '700', color: Colors.textMuted, letterSpacing: 1.5 },
  defText: { ...S.body, fontSize: 17, lineHeight: 26 },
  chatIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chatIconBtnText: { fontSize: 16 },

  arenaContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Input
  inputSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 8,
    gap: 10,
  },
  guessInput: {
    flex: 1,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  submitBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  watchingBanner: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 32,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  watchingText: { ...S.body, color: Colors.textSub },
  chatBtnInline: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chatBtnInlineText: { color: Colors.text, fontSize: 13, fontWeight: '600' },
});
