import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, S } from '../../../constants/theme';
import { Game } from '../../../lib/gameService';
import { avatarColor } from '../components/avatarColor';
import ChatPanel from '../components/ChatPanel';

export default function WaitingScreen({
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
  const [chatOpen, setChatOpen] = useState(false);

  const username = game.players[userId]?.username ?? '';
  const lastWord = game.lastResult?.word;
  const lastWordCorrect = game.lastResult?.correct;

  async function handleCopy() {
    await Clipboard.setStringAsync(gameCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <View style={styles.container}>
      <View style={styles.waitingInner}>
        <View style={styles.titleRow}>
          <Text style={styles.waitingTitle}>Waiting Room</Text>
          <TouchableOpacity style={styles.chatBtn} onPress={() => setChatOpen(true)} activeOpacity={0.8}>
            <Text style={styles.chatBtnText}>💬 Chat</Text>
          </TouchableOpacity>
        </View>

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

      <ChatPanel
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        gameCode={gameCode}
        userId={userId}
        username={username}
        lastWord={lastWord}
        lastWordCorrect={lastWordCorrect}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  disabled: { opacity: 0.4 },
  waitingInner: { flex: 1, paddingHorizontal: 24, paddingTop: 72, paddingBottom: 32, gap: 20 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  waitingTitle: { ...S.h1 },
  chatBtn: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chatBtnText: { color: Colors.text, fontSize: 13, fontWeight: '600' },
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
});
