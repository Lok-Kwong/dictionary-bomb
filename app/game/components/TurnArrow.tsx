import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet } from 'react-native';

const ARROW_W = 28;

// arrow.png points straight down by default, so a container that extends
// downward from the bomb center (rotation 0) already points outward. To aim at
// a player sitting at screen-direction `angle`, we rotate by `angle - π/2`.
export default function TurnArrow({
  center,
  angle,
  length,
}: {
  center: number;
  angle: number; // radians: direction from the bomb toward the current player
  length: number;
}) {
  const target = angle - Math.PI / 2;
  const rot = useRef(new Animated.Value(target)).current;
  const current = useRef(target);

  useEffect(() => {
    // Always spin forward (toward the next player) along the shortest forward
    // arc, so wrapping from the last player back to the first keeps turning the
    // same way instead of snapping backward.
    let diff = (target - current.current) % (2 * Math.PI);
    if (diff < 0) diff += 2 * Math.PI;
    const next = current.current + diff;
    current.current = next;
    Animated.timing(rot, {
      toValue: next,
      duration: 450,
      useNativeDriver: false,
    }).start();
  }, [target, rot]);

  const rotate = rot.interpolate({
    inputRange: [0, 2 * Math.PI],
    outputRange: ['0rad', `${2 * Math.PI}rad`],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          left: center - ARROW_W / 2,
          top: center,
          width: ARROW_W,
          height: length,
          transform: [{ rotate }],
        },
      ]}
    >
      <Image
        source={require('../../../assets/images/arrow.png')}
        style={{ width: ARROW_W, height: length }}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    transformOrigin: 'center top',
  } as any,
});
