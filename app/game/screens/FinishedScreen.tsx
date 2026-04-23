import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, S } from '../../../constants/theme';
import { Game } from '../../../lib/gameService';
import { avatarColor } from '../components/avatarColor';

export default function FinishedScreen({
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  waitingDot: { width: 10, height: 10, borderRadius: 5 },
  leaveBtn: { alignItems: 'center', paddingVertical: 12 },
  leaveBtnText: { color: Colors.textSub, fontSize: 14 },
  startBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  playAgainBtn: {
    backgroundColor: Colors.primary, borderRadius: 14, width: '100%',
    paddingVertical: 16, alignItems: 'center', marginTop: 'auto',
  },
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
