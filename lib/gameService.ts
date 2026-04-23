import {
  get,
  onValue,
  ref,
  runTransaction,
  set,
  update
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
  guesses?: Record<string, string>;
  lastResult?: { playerId: string; correct: boolean; word: string; uid: string };
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
  word: string,
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

    const lastResult = { playerId: currentPlayerId, correct: isCorrect, word, uid: turnId };

    const alivePlayers = Object.keys(updatedPlayers).filter((id) => updatedPlayers[id].isAlive);
    if (alivePlayers.length <= 1) {
      return {
        ...game,
        status: 'finished' as const,
        players: updatedPlayers,
        winnerId: alivePlayers[0] ?? null,
        lastResult,
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
      lastResult,
    };
  });
}

export async function leaveGame(gameCode: string, userId: string): Promise<void> {
  await runTransaction(ref(db, `games/${gameCode}`), (game: Game | null) => {
    if (!game || (game.status !== 'waiting' && game.status !== 'finished')) return game;

    const newPlayers = { ...game.players };
    delete newPlayers[userId];

    const newOrder = game.playerOrder.filter((id) => id !== userId);

    if (newOrder.length === 0) {
      return null; // deletes the game node
    }

    const newHostId = game.hostId === userId ? newOrder[0] : game.hostId;

    return { ...game, players: newPlayers, playerOrder: newOrder, hostId: newHostId };
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
    lastResult: null,
  });
}

export async function setPlayerGuess(gameCode: string, userId: string, guess: string): Promise<void> {
  await set(ref(db, `games/${gameCode}/guesses/${userId}`), guess || null);
}

export function subscribeToGame(gameCode: string, onUpdate: (game: Game | null) => void): () => void {
  const gameRef = ref(db, `games/${gameCode}`);
  const unsub = onValue(gameRef, (snap) => {
    onUpdate(snap.exists() ? (snap.val() as Game) : null);
  });
  return unsub;
}
