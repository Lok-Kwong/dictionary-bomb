import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, Platform, StyleSheet } from 'react-native';

// On web the star spins with a real CSS @keyframes animation (react-native-web
// turns these style props into CSS). `useNativeDriver` isn't supported on web,
// so the JS-driven Animated loop below is the native-only path.
const SPIN_DURATION = 2200;
const isWeb = Platform.OS === 'web';

// The bomb artwork is a 1024x1024 square where the bomb body circle fills
// ~64% of the canvas and the fuse tip sits near the top-right corner. These
// constants reposition that artwork so the circle fills BOMB_SIZE and the
// spark lands right on the fuse tip.
// Every constant below is scaled uniformly from the original artwork tuning, so
// the bomb body, fuse art, and spark stay aligned at any size — adjust the bomb
// by changing the values together (currently ~0.85 of the original).
const BOMB_SIZE = 61;
const IMAGE_SIZE = 95;
const IMAGE_OFFSET_X = -13;
const IMAGE_OFFSET_Y = -23;
const STAR_SIZE = 32;
const STAR_LEFT = 46;
const STAR_TOP = -16;
// The blast is drawn larger than the bomb so it visibly bursts past it.
const EXPLOSION_SIZE = 112;
const EXPLOSION_OFFSET = -EXPLOSION_SIZE / 2;

export default function BombCenter({
  center,
  timeLeft,
  timerColor,
  pulseAnim,
  exploding,
}: {
  center: number;
  timeLeft: number;
  timerColor: Animated.AnimatedInterpolation<string>;
  pulseAnim: Animated.Value;
  exploding: boolean;
}) {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const blastAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isWeb) return; // web spins via CSS (see styles.starSpin)
    const spin = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: SPIN_DURATION,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spin.start();
    return () => spin.stop();
  }, [spinAnim]);

  // Pop the blast in quickly the moment the bomb explodes.
  useEffect(() => {
    if (!exploding) {
      blastAnim.setValue(0);
      return;
    }
    Animated.spring(blastAnim, {
      toValue: 1,
      friction: 5,
      tension: 140,
      useNativeDriver: true,
    }).start();
  }, [exploding, blastAnim]);

  const spinDeg = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const blastScale = blastAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  if (exploding) {
    return (
      <Animated.Image
        source={require('../../../assets/images/explosion.png')}
        resizeMode="contain"
        style={[
          styles.explosion,
          {
            left: center + EXPLOSION_OFFSET,
            top: center + EXPLOSION_OFFSET,
            opacity: blastAnim,
            transform: [{ scale: blastScale }],
          },
        ]}
      />
    );
  }

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
      <Image
        source={require('../../../assets/images/bomb-fuse.png')}
        style={styles.bombImage}
        resizeMode="contain"
      />

      {isWeb ? (
        <Image
          source={require('../../../assets/images/spark-star.png')}
          style={[styles.star, styles.starSpin]}
          resizeMode="contain"
        />
      ) : (
        <Animated.Image
          source={require('../../../assets/images/spark-star.png')}
          style={[styles.star, { transform: [{ rotate: spinDeg }] }]}
          resizeMode="contain"
        />
      )}

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
  // CSS @keyframes spin — react-native-web only; ignored on native. Cast to any
  // because these animation props aren't part of React Native's style types.
  starSpin: {
    animationKeyframes: {
      '0%': { transform: [{ rotate: '0deg' }] },
      '100%': { transform: [{ rotate: '360deg' }] },
    },
    animationDuration: `${SPIN_DURATION}ms`,
    animationIterationCount: 'infinite',
    animationTimingFunction: 'linear',
  } as any,
  bombTimer: {
    fontSize: 13,
    fontWeight: '800',
  },
  explosion: {
    position: 'absolute',
    width: EXPLOSION_SIZE,
    height: EXPLOSION_SIZE,
  },
});
