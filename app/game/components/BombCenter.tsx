import React from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { Colors } from '../../../constants/theme';

export default function BombCenter({
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
          left: center - 35,
          top: center - 35,
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

const styles = StyleSheet.create({
  bombContainer: {
    width: 69,
    height: 69,
    borderRadius: 35,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    gap: 0,
  },
  bombEmoji: { fontSize: 28 },
  bombTimer: { fontSize: 14, fontWeight: '800' },
});
