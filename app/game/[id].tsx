import * as Clipboard from 'expo-clipboard';
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
  useWindowDimensions,
  View,
} from 'react-native';
import { Colors, S } from '../../constants/theme';
import {
  Game,
  leaveGame,
  Player,
  resetGame,
  setPlayerGuess,
  startGame,
  submitTurn,
  subscribeToGame,
} from '../../lib/gameService';
import { getUserId } from '../../lib/storage';

const TURN_DURATION_MS = 100_000;
const TIMEOUT_GRACE_MS = 2_000;

const AVATAR_COLORS = ['#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6', '#1ABC9C', '#E67E22'];
function avatarColor(id: string): string {
  let h = 0;
  for (const c of id) h = (h << 5) - h + c.charCodeAt(0);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

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
  const submittingRef = useRef(false);
  const [feedbackInfo, setFeedbackInfo] = useState<{
    playerId: string;
    type: 'correct' | 'wrong';
    uid: string;
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
          handleTurnEnd(false, currentTurnId);
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

  const handleTurnEnd = useCallback(
    async (isCorrect: boolean, turnId: string) => {
      if (submittingRef.current) return;
      submittingRef.current = true;
      setSubmitting(true);
      const g = gameRef.current;
      if (g) {
        const playerId = g.playerOrder[g.currentPlayerIndex];
        setFeedbackInfo({ playerId, type: isCorrect ? 'correct' : 'wrong', uid: turnId });
      }
      await Promise.all([
        setPlayerGuess(gameCode as string, userId, ''),
        submitTurn(gameCode as string, isCorrect, turnId),
      ]);
    },
    [gameCode, userId],
  );

  async function handleSubmitGuess() {
    if (!game || submittingRef.current) return;
    const correct = guess.trim().toLowerCase() === game.currentWord.toLowerCase();
    await handleTurnEnd(correct, game.turnId);
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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Definition */}
      <View style={styles.definitionSection}>
        <Text style={styles.defLabel}>DEFINITION</Text>
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
          <Text style={styles.watchingText}> Watching…</Text>
        </View>
      ) : null}
    </KeyboardAvoidingView>
  );
}

// ── Arena (bomb + players in a circle) ──────────────────────────

function ArenaView({
  game,
  userId,
  currentPlayerId,
  timeLeft,
  timerColor,
  pulseAnim,
  feedbackInfo,
  guesses,
}: {
  game: Game;
  userId: string;
  currentPlayerId: string;
  timeLeft: number;
  timerColor: Animated.AnimatedInterpolation<string>;
  pulseAnim: Animated.Value;
  feedbackInfo: { playerId: string; type: 'correct' | 'wrong'; uid: string } | null;
  guesses: Record<string, string>;
}) {
  const { width } = useWindowDimensions();
  const ARENA = Math.min(width - 32, 320);
  const RADIUS = ARENA * 0.5;
  const CENTER = ARENA / 2;

  // Pre-compute player positions
  const positions = game.playerOrder.map((_, i) => {
    const angle = (i / game.playerOrder.length) * 2 * Math.PI - Math.PI / 2;
    return {
      x: CENTER + RADIUS * Math.cos(angle),
      y: CENTER + RADIUS * Math.sin(angle),
    };
  });

  return (
    <View style={{ width: ARENA, height: ARENA }}>
      {/* Connecting line from bomb to current player */}
      {game.playerOrder.map((playerId, i) => {
        if (playerId !== currentPlayerId) return null;
        const angle = (i / game.playerOrder.length) * 2 * Math.PI - Math.PI / 2;
        const lineLen = RADIUS - 80;
        return (
          <View
            key={`line-${playerId}`}
            style={{
              position: 'absolute',
              left: CENTER,
              top: CENTER - 1,
              width: lineLen,
              height: 2,
              backgroundColor: Colors.primary,
              opacity: 0.5,
              transformOrigin: 'left center',
              transform: [{ rotate: `${angle}rad` }],
            } as any}
          />
        );
      })}

      {/* Player avatars */}
      {game.playerOrder.map((playerId, i) => {
        const player = game.players[playerId];
        if (!player) return null;
        const { x, y } = positions[i];
        return (
          <PlayerAvatar
            key={playerId}
            player={player}
            playerId={playerId}
            x={x}
            y={y}
            isCurrent={playerId === currentPlayerId}
            isMe={playerId === userId}
            guess={guesses[playerId] ?? ''}
          />
        );
      })}

      {/* Feedback icons floating above avatars */}
      {feedbackInfo != null && (() => {
        const idx = game.playerOrder.indexOf(feedbackInfo.playerId);
        return idx !== -1 ? (
          <FeedbackIcon
            key={feedbackInfo.uid}
            type={feedbackInfo.type}
            x={positions[idx].x}
            y={positions[idx].y}
          />
        ) : null;
      })()}

      {/* Bomb in center */}
      <BombCenter
        center={CENTER}
        timeLeft={timeLeft}
        timerColor={timerColor}
        pulseAnim={pulseAnim}
      />
    </View>
  );
}

function FeedbackIcon({
  type,
  x,
  y,
}: {
  type: 'correct' | 'wrong';
  x: number;
  y: number;
}) {
  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const floatUp = Animated.timing(translateY, {
      toValue: -64,
      duration: 1000,
      useNativeDriver: true,
    });
    const fadeOut = Animated.sequence([
      Animated.delay(450),
      Animated.timing(opacity, { toValue: 0, duration: 550, useNativeDriver: true }),
    ]);

    if (type === 'correct') {
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, speed: 28, bounciness: 14, useNativeDriver: true }),
        floatUp,
        fadeOut,
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, speed: 30, bounciness: 2, useNativeDriver: true }),
        Animated.sequence([
          Animated.timing(translateX, { toValue: -10, duration: 65, useNativeDriver: true }),
          Animated.timing(translateX, { toValue: 10, duration: 65, useNativeDriver: true }),
          Animated.timing(translateX, { toValue: -7, duration: 55, useNativeDriver: true }),
          Animated.timing(translateX, { toValue: 0, duration: 55, useNativeDriver: true }),
          floatUp,
        ]),
        fadeOut,
      ]).start();
    }
  }, []);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: x - 22,
        top: y - 62,
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ translateY }, { translateX }, { scale }],
        opacity,
        zIndex: 100,
      }}
    >
      <Text style={{ fontSize: 30, lineHeight: 36 }}>
        {type === 'correct' ? '✅' : '❌'}
      </Text>
    </Animated.View>
  );
}

function PlayerAvatar({
  player,
  playerId,
  x,
  y,
  isCurrent,
  isMe,
  guess,
}: {
  player: Player;
  playerId: string;
  x: number;
  y: number;
  isCurrent: boolean;
  isMe: boolean;
  guess: string;
}) {
  const color = avatarColor(playerId);
  const initial = (player.username[0] ?? '?').toUpperCase();
  const name = player.username.length > 9 ? player.username.slice(0, 8) + '…' : player.username;

  return (
    <View
      style={[
        styles.avatarContainer,
        { position: 'absolute', left: x - 28, top: y - 28 },
      ]}
    >
      <View
        style={[
          styles.avatarCircle,
          { backgroundColor: color },
          isCurrent && styles.avatarCurrentRing,
          !player.isAlive && styles.avatarDead,
        ]}
      >
        <Text style={styles.avatarInitial}>{initial}</Text>
      </View>
      <Text style={[styles.avatarName, isMe && { color: Colors.text }]} numberOfLines={1}>
        {name}
      </Text>
      <Text style={styles.avatarLives}>
        {player.isAlive ? '❤️'.repeat(player.lives) : '💀'}
      </Text>
      {!!guess && (
        <Text style={styles.avatarGuess} numberOfLines={1}>{guess}</Text>
      )}
    </View>
  );
}

function BombCenter({
  center,
  timeLeft,
  timerColor,
  pulseAnim,
}: {
  center: number;
  timeLeft: number;
  timerColor: Animated.AnimatedInterpolation<string>;
  pulseAnim: Animated.Value;
}) {
  return (
    <Animated.View
      style={[
        styles.bombContainer,
        {
          position: 'absolute',
          left: center - 46,
          top: center - 46,
          borderColor: timerColor,
          transform: [{ scale: pulseAnim }],
        },
      ]}
    >
      <Text style={styles.bombEmoji}>💣</Text>
      <Animated.Text style={[styles.bombTimer, { color: timerColor }]}>
        {timeLeft}
      </Animated.Text>
    </Animated.View>
  );
}

// ── Waiting screen ───────────────────────────────────────────────

function WaitingScreen({
  game,
  gameCode,
  userId,
  onStart,
  onLeave,
}: {
  game: Game;
  gameCode: string;
  userId: string;
  onStart: () => void;
  onLeave: () => void;
}) {
  const isHost = game.hostId === userId;
  const playerCount = Object.keys(game.players).length;
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await Clipboard.setStringAsync(gameCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <View style={styles.container}>
      <View style={styles.waitingInner}>
        <Text style={styles.waitingTitle}>Waiting Room</Text>

        <View style={styles.codeCard}>
          <Text style={styles.codeLabel}>GAME CODE</Text>
          <Text style={styles.codeValue}>{gameCode}</Text>
          <TouchableOpacity style={styles.copyBtn} onPress={handleCopy} activeOpacity={0.75}>
            <Text style={styles.copyBtnText}>{copied ? 'Copied!' : 'Copy Code'}</Text>
          </TouchableOpacity>
          <Text style={styles.codeHint}>Share with friends to join</Text>
        </View>

        <View style={styles.playerListSection}>
          <Text style={styles.playerListTitle}>Players ({playerCount})</Text>
          {Object.entries(game.players).map(([id, p]) => (
            <View key={id} style={styles.waitingPlayerRow}>
              <View style={[styles.waitingDot, { backgroundColor: avatarColor(id) }]} />
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
            style={[styles.startBtn, playerCount < 2 && styles.disabled]}
            onPress={onStart}
            disabled={playerCount < 2}
            activeOpacity={0.85}
          >
            <Text style={styles.startBtnText}>
              {playerCount >= 2 ? 'Start Game 💣' : 'Need at least 2 players'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.waitingForHost}>
            <ActivityIndicator color={Colors.primary} />
            <Text style={styles.waitingForHostText}>Waiting for host to start…</Text>
          </View>
        )}

        <TouchableOpacity style={styles.leaveBtn} onPress={onLeave}>
          <Text style={styles.leaveBtnText}>Leave</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Finished screen ──────────────────────────────────────────────

function FinishedScreen({
  game,
  userId,
  onReset,
  onLeave,
}: {
  game: Game;
  userId: string;
  onReset: () => void;
  onLeave: () => void;
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
          {isWinner ? 'Last one standing!' : `Better luck next round.`}
        </Text>

        <View style={styles.finalScores}>
          {Object.entries(game.players)
            .sort(([, a], [, b]) => b.lives - a.lives)
            .map(([id, p]) => (
              <View key={id} style={styles.finalScoreRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={[styles.waitingDot, { backgroundColor: avatarColor(id) }]} />
                  <Text style={styles.finalScoreName}>
                    {id === game.winnerId ? '🏆 ' : ''}
                    {p.username}
                    {id === userId ? ' (you)' : ''}
                  </Text>
                </View>
                <Text style={[styles.finalScoreLives, !p.isAlive && { opacity: 0.35 }]}>
                  {p.isAlive ? '❤️'.repeat(p.lives) : '💀'}
                </Text>
              </View>
            ))}
        </View>

        {isHost && (
          <TouchableOpacity style={styles.playAgainBtn} onPress={onReset} activeOpacity={0.85}>
            <Text style={styles.startBtnText}>Play Again 🔄</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.leaveBtn} onPress={onLeave}>
          <Text style={styles.leaveBtnText}>Back to Lobby</Text>
        </TouchableOpacity>
      </View>
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
  defLabel: { fontSize: 11, fontWeight: '700', color: Colors.textMuted, letterSpacing: 1.5 },
  defText: { ...S.body, fontSize: 17, lineHeight: 26 },

  arenaContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Bomb
  bombContainer: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    gap: 0,
  },
  bombEmoji: { fontSize: 38, lineHeight: 46 },
  bombTimer: { fontSize: 18, fontWeight: '800', lineHeight: 22 },

  // Player avatars
  avatarContainer: {
    width: 56,
    alignItems: 'center',
    gap: 3,
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarCurrentRing: {
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarDead: { opacity: 0.35 },
  avatarInitial: { color: '#fff', fontSize: 20, fontWeight: '800' },
  avatarName: { fontSize: 11, color: Colors.textSub, fontWeight: '600', textAlign: 'center' },
  avatarLives: { fontSize: 11, textAlign: 'center' },
  avatarGuess: { fontSize: 11, color: Colors.textMuted, textAlign: 'center', fontStyle: 'italic', maxWidth: 64 },

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
    marginHorizontal: 16,
    marginBottom: 32,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  watchingText: { ...S.body, color: Colors.textSub },

  // Waiting screen
  waitingInner: { flex: 1, paddingHorizontal: 24, paddingTop: 72, paddingBottom: 32, gap: 20 },
  waitingTitle: { ...S.h1 },
  codeCard: {
    backgroundColor: Colors.card, borderRadius: 16, padding: 24,
    alignItems: 'center', borderWidth: 1, borderColor: Colors.border, gap: 6,
  },
  codeLabel: { fontSize: 11, fontWeight: '700', color: Colors.textMuted, letterSpacing: 1.5 },
  codeValue: { fontSize: 36, fontWeight: '800', color: Colors.text, letterSpacing: 8 },
  copyBtn: {
    backgroundColor: Colors.surface, borderRadius: 10, paddingVertical: 8,
    paddingHorizontal: 20, borderWidth: 1, borderColor: Colors.border,
  },
  copyBtnText: { color: Colors.text, fontSize: 13, fontWeight: '600' },
  codeHint: { ...S.small },
  playerListSection: { gap: 8 },
  playerListTitle: { ...S.h3, marginBottom: 4 },
  waitingPlayerRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.card, borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 12,
    borderWidth: 1, borderColor: Colors.border,
  },
  waitingDot: { width: 10, height: 10, borderRadius: 5 },
  waitingPlayerName: { ...S.body, fontWeight: '600', flex: 1 },
  waitingLives: { fontSize: 15 },
  startBtn: {
    backgroundColor: Colors.primary, borderRadius: 14,
    paddingVertical: 16, alignItems: 'center', marginTop: 'auto',
  },
  startBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  waitingForHost: { flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'center' },
  waitingForHostText: { ...S.body, color: Colors.textSub },
  leaveBtn: { alignItems: 'center', paddingVertical: 12 },
  leaveBtnText: { color: Colors.textSub, fontSize: 14 },
  playAgainBtn: {
    backgroundColor: Colors.primary, borderRadius: 14, width: 150,
    paddingVertical: 16, alignItems: 'center', marginTop: 'auto',
  },
  // Finished screen
  finishedInner: {
    flex: 1, paddingHorizontal: 24, paddingTop: 80, paddingBottom: 32,
    alignItems: 'center', gap: 12,
  },
  finishedEmoji: { fontSize: 72 },
  finishedTitle: { ...S.h1, fontSize: 34, textAlign: 'center' },
  finishedSub: { ...S.body, color: Colors.textSub, textAlign: 'center' },
  finalScores: { width: '100%', gap: 8, marginTop: 12, marginBottom: 8 },
  finalScoreRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.card, borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 12,
    borderWidth: 1, borderColor: Colors.border,
  },
  finalScoreName: { ...S.body, fontWeight: '600' },
  finalScoreLives: { fontSize: 16 },
});
