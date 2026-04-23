import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../constants/theme';
import { Player } from '../../../lib/gameService';
import { avatarColor } from './avatarColor';

export default function PlayerAvatar({
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
        { position: 'absolute', left: x - 20, top: y - 20 },
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

const styles = StyleSheet.create({
  avatarContainer: {
    width: 42,
    alignItems: 'center',
    gap: 3,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  avatarInitial: { color: '#fff', fontSize: 15, fontWeight: '800' },
  avatarName: { fontSize: 11, color: Colors.textSub, fontWeight: '600', textAlign: 'center' },
  avatarLives: { fontSize: 8, textAlign: 'center' },
  avatarGuess: { fontSize: 11, color: Colors.textMuted, textAlign: 'center', fontStyle: 'italic', maxWidth: 250 },
});
