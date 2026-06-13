import React from 'react';
import { Animated, View, useWindowDimensions } from 'react-native';
import { Game } from '../../../lib/gameService';
import BombCenter from './BombCenter';
import FeedbackIcon from './FeedbackIcon';
import PlayerAvatar from './PlayerAvatar';
import TurnArrow from './TurnArrow';

export default function ArenaView({
  game,
  userId,
  currentPlayerId,
  timeLeft,
  timerColor,
  pulseAnim,
  feedbackInfo,
  guesses,
  exploding,
}: {
  game: Game;
  userId: string;
  currentPlayerId: string;
  timeLeft: number;
  timerColor: Animated.AnimatedInterpolation<string>;
  pulseAnim: Animated.Value;
  feedbackInfo: { playerId: string; type: 'correct' | 'wrong'; uid: string; word: string } | null;
  guesses: Record<string, string>;
  exploding: boolean;
}) {
  const { width } = useWindowDimensions();
  const ARENA = Math.min(width - 16, 420);
  const RADIUS = ARENA * 0.5;
  const CENTER = ARENA / 2;

  // Distance of the avatar ring from the center. Pulled in from the arena edge
  // so the bottom player sits higher and clears the keyboard.
  const RING = RADIUS - 60;

  // Pre-compute player positions
  const positions = game.playerOrder.map((_, i) => {
    const angle = (i / game.playerOrder.length) * 2 * Math.PI - Math.PI / 2;
    return {
      x: CENTER + RING * Math.cos(angle),
      y: CENTER + RING * Math.sin(angle),
    };
  });

  return (
    <View style={{ width: ARENA, height: ARENA }}>
      {/* Arrow pointing from the bomb to the current player */}
      {(() => {
        const currentIdx = game.playerOrder.indexOf(currentPlayerId);
        if (currentIdx < 0) return null;
        const angle = (currentIdx / game.playerOrder.length) * 2 * Math.PI - Math.PI / 2;
        return <TurnArrow center={CENTER} angle={angle} length={RADIUS - 120} />;
      })()}

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
        exploding={exploding}
      />
    </View>
  );
}
