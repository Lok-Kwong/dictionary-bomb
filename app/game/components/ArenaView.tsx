import React from 'react';
import { Animated, View, useWindowDimensions } from 'react-native';
import { Colors } from '../../../constants/theme';
import { Game } from '../../../lib/gameService';
import BombCenter from './BombCenter';
import FeedbackIcon from './FeedbackIcon';
import PlayerAvatar from './PlayerAvatar';

export default function ArenaView({
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
  feedbackInfo: { playerId: string; type: 'correct' | 'wrong'; uid: string; word: string } | null;
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
      x: CENTER + (RADIUS - 30) * Math.cos(angle),
      y: CENTER + (RADIUS - 30) * Math.sin(angle),
    };
  });

  return (
    <View style={{ width: ARENA, height: ARENA }}>
      {/* Connecting line from bomb to current player */}
      {game.playerOrder.map((playerId, i) => {
        if (playerId !== currentPlayerId) return null;
        const angle = (i / game.playerOrder.length) * 2 * Math.PI - Math.PI / 2;
        const lineLen = RADIUS - 90;
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
            word={feedbackInfo.word}
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
