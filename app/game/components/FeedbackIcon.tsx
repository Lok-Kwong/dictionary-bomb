import React, { useEffect, useRef } from 'react';
import { Animated, Text } from 'react-native';

export default function FeedbackIcon({
  type,
  word,
  x,
  y,
}: {
  type: 'correct' | 'wrong';
  word: string;
  x: number;
  y: number;
}) {
  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const floatUp = Animated.timing(translateY, {
      toValue: -84,
      duration: 3000,
      useNativeDriver: true,
    });
    const fadeOut = Animated.sequence([
      Animated.delay(800),
      Animated.timing(opacity, { toValue: 0, duration: 1000, useNativeDriver: true }),
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
        left: x + 5,
        top: y - 25,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        transform: [{ translateY }, { translateX }, { scale }],
        opacity,
        zIndex: 100,
      }}
    >
      <Text style={{ fontSize: 14 }}>
        {type === 'correct' ? '✅' : '❌'}
      </Text>
      {!!word && <Text style={{ fontSize: 12, color: '#fff', fontWeight: '700' }}>{word}</Text>}
    </Animated.View>
  );
}
