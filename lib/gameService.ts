import {
  ref,
  set,
  get,
  update,
  remove,
  onValue,
  runTransaction,
  serverTimestamp,
} from 'firebase/database';
import { db } from './firebase';
import { getRandomWord, getRandomWordExcluding } from './wordDictionary';

export interface Player {
  username: string;
  lives: number;
  isAlive: boolean;
}

export interface Game {
  status: 'waiting' | 'active' | 'finished';
  hostId: string;
  players: Record<string, Player>;
  playerOrder: string[];
  currentPlayerIndex: number;
  currentWord: string;
  currentDefinition: string;
  timerStart: number;
  turnId: string;
  winnerId?: string;
}

function genCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function genTurnId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export async function createGame(userId: string, username: string): Promise<string> {
  const code = genCode();
  const entry = getRandomWord();
  const game: Game = {
    status: 'waiting',
    hostId: userId,
    players: { [userId]: { username, lives: 2, isAlive: true } },
    playerOrder: [userId],
    currentPlayerIndex: 0,
    currentWord: entry.word,
    currentDefinition: entry.definition,
    timerStart: 0,
    turnId: '',
  };
  await set(ref(db, `games/${code}`), game);
  return code;
}

export async function joinGame(gameCode: string, userId: string, username: string): Promise<void> {
  const gameRef = ref(db, `games/${gameCode}`);
  const snap = await get(gameRef);
  if (!snap.exists()) throw new Error('Game not found.');

  const game: Game = snap.val();
  if (game.status !== 'waiting') throw new Error('Game has already started.');
  if (game.players[userId]) return; // already joined

  await update(gameRef, {
    [`players/${userId}`]: { username, lives: 2, isAlive: true },
    playerOrder: [...game.playerOrder, userId],
  });
}

export async function leaveGame(gameCode: string, userId: string): Promise<void> {
  const gameRef = ref(db, `games/${gameCode}`);
  const snap = await get(gameRef);
  if (!snap.exists()) return;

  const game: Game = snap.val();
  const newPlayerOrder = game.playerOrder.filter((id) => id !== userId);

  if (newPlayerOrder.length === 0) {
    await remove(gameRef);
    return;
  }

  const newPlayers = { ...game.players };
  delete newPlayers[userId];

  const updates: Record<string, unknown> = {
    players: newPlayers,
    playerOrder: newPlayerOrder,
  };

  if (game.hostId === userId) {
    updates.hostId = newPlayerOrder[0];
  }

  await update(gameRef, updates);
}

export async function startGame(gameCode: string): Promise<void> {
  const gameRef = ref(db, `games/${gameCode}`);
  const snap = await get(gameRef);
  if (!snap.exists()) throw new Error('Game not found.');
  const game: Game = snap.val();

  await update(gameRef, {
    status: 'active',
    timerStart: Date.now(),
    turnId: genTurnId(),
  });
}

export async function submitTurn(
  gameCode: string,
  isCorrect: boolean,
  turnId: string,
): Promise<void> {
  await runTransaction(ref(db, `games/${gameCode}`), (game: Game | null) => {
    if (!game || game.status !== 'active') return;
    if (game.turnId !== turnId) return; // already processed

    const currentPlayerId = game.playerOrder[game.currentPlayerIndex];
    const currentPlayer = { ...game.players[currentPlayerId] };

    if (!isCorrect) {
      currentPlayer.lives -= 1;
      if (currentPlayer.lives <= 0) {
        currentPlayer.lives = 0;
        currentPlayer.isAlive = false;
      }
    }

    const updatedPlayers: Record<string, Player> = {
      ...game.players,
      [currentPlayerId]: currentPlayer,
    };

    const alivePlayers = Object.keys(updatedPlayers).filter((id) => updatedPlayers[id].isAlive);
    if (alivePlayers.length <= 1) {
      return {
        ...game,
        status: 'finished' as const,
        players: updatedPlayers,
        winnerId: alivePlayers[0] ?? null,
      };
    }

    // Find next alive player
    const n = game.playerOrder.length;
    let nextIndex = game.currentPlayerIndex;
    for (let i = 1; i <= n; i++) {
      const idx = (game.currentPlayerIndex + i) % n;
      if (updatedPlayers[game.playerOrder[idx]]?.isAlive) {
        nextIndex = idx;
        break;
      }
    }

    // Pick new word if correct, otherwise keep same word
    let nextWord = game.currentWord;
    let nextDef = game.currentDefinition;
    if (isCorrect) {
      const entry = getRandomWordExcluding(game.currentWord);
      nextWord = entry.word;
      nextDef = entry.definition;
    }

    return {
      ...game,
      players: updatedPlayers,
      currentPlayerIndex: nextIndex,
      currentWord: nextWord,
      currentDefinition: nextDef,
      timerStart: Date.now(),
      turnId: genTurnId(),
    };
  });
}

export async function resetGame(gameCode: string): Promise<void> {
  const gameRef = ref(db, `games/${gameCode}`);
  const snap = await get(gameRef);
  if (!snap.exists()) return;
  const game: Game = snap.val();

  const resetPlayers: Record<string, Player> = {};
  for (const id of Object.keys(game.players)) {
    resetPlayers[id] = { ...game.players[id], lives: 2, isAlive: true };
  }

  const entry = getRandomWord();
  await update(gameRef, {
    status: 'waiting',
    players: resetPlayers,
    currentPlayerIndex: 0,
    currentWord: entry.word,
    currentDefinition: entry.definition,
    timerStart: 0,
    turnId: '',
    winnerId: null,
  });
}

export function subscribeToGame(gameCode: string, onUpdate: (game: Game | null) => void): () => void {
  const gameRef = ref(db, `games/${gameCode}`);
  const unsub = onValue(gameRef, (snap) => {
    onUpdate(snap.exists() ? (snap.val() as Game) : null);
  });
  return unsub;
}
