import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet } from 'react-native';
import { Colors } from '../../../constants/theme';

// The bomb artwork is a 1024x1024 square where the bomb body circle fills
// ~64% of the canvas and the fuse tip sits near the top-right corner. These
// constants reposition that artwork so the circle fills BOMB_SIZE and the
// spark lands right on the fuse tip.
const BOMB_SIZE = 72;
const IMAGE_SIZE = 112;
const IMAGE_OFFSET_X = -15;
const IMAGE_OFFSET_Y = -27;
const STAR_SIZE = 38;
const STAR_LEFT = 54;
const STAR_TOP = -19;

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
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 2200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spin.start();
    return () => spin.stop();
  }, [spinAnim]);

  const spinDeg = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowOpacity = pulseAnim.interpolate({
    inputRange: [1, 1.18],
    outputRange: [0.25, 0.85],
  });

  return (
    <Animated.View
      style={[
        styles.bombContainer,
        {
          position: 'absolute',
          left: center - BOMB_SIZE / 2,
          top: center - BOMB_SIZE / 2,
          transform: [{ scale: pulseAnim }],
        },
      ]}
    >
      <Animated.View style={[styles.glow, { opacity: glowOpacity }]} />

      <Image
        source={require('../../../assets/images/bomb-fuse.png')}
        style={styles.bombImage}
        resizeMode="contain"
      />

      <Animated.Image
        source={require('../../../assets/images/spark-star.png')}
        style={[styles.star, { transform: [{ rotate: spinDeg }] }]}
        resizeMode="contain"
      />

      <Animated.Text style={[styles.bombTimer, { color: timerColor }]}>
        {timeLeft}
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bombContainer: {
    width: BOMB_SIZE,
    height: BOMB_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    width: BOMB_SIZE + 18,
    height: BOMB_SIZE + 18,
    left: -9,
    top: -9,
    borderRadius: (BOMB_SIZE + 18) / 2,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOpacity: 0.9,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
  },
  bombImage: {
    position: 'absolute',
    left: IMAGE_OFFSET_X,
    top: IMAGE_OFFSET_Y,
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
  star: {
    position: 'absolute',
    left: STAR_LEFT,
    top: STAR_TOP,
    width: STAR_SIZE,
    height: STAR_SIZE,
  },
  bombTimer: {
    fontSize: 15,
    fontWeight: '800',
  },
});
