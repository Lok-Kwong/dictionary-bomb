import { Game, Player } from '../lib/gameService';

// Mock Firebase before importing gameService
jest.mock('../lib/firebase', () => ({ db: {} }));

jest.mock('firebase/database', () => ({
  get: jest.fn(),
  set: jest.fn(),
  update: jest.fn(),
  ref: jest.fn((_db: unknown, path: string) => ({ path })),
  runTransaction: jest.fn(),
  onValue: jest.fn(),
}));

jest.mock('../lib/wordDictionary', () => ({
  getRandomWord: jest.fn(() => ({ word: 'testword', definition: 'test definition' })),
  getRandomWordExcluding: jest.fn(() => ({ word: 'newword', definition: 'new definition' })),
}));

import * as firebaseDB from 'firebase/database';
import { createGame, joinGame, startGame, leaveGame, submitTurn, subscribeToGame } from '../lib/gameService';

const mockGet = firebaseDB.get as jest.MockedFunction<typeof firebaseDB.get>;
const mockSet = firebaseDB.set as jest.MockedFunction<typeof firebaseDB.set>;
const mockUpdate = firebaseDB.update as jest.MockedFunction<typeof firebaseDB.update>;
const mockRunTransaction = firebaseDB.runTransaction as jest.MockedFunction<typeof firebaseDB.runTransaction>;
const mockOnValue = firebaseDB.onValue as jest.MockedFunction<typeof firebaseDB.onValue>;

function makeSnapshot(data: unknown, exists = true) {
  return { exists: () => exists, val: () => data } as any;
}

function makeGame(overrides: Partial<Game> = {}): Game {
  return {
    status: 'active',
    hostId: 'p1',
    players: {
      p1: { username: 'Alice', lives: 2, isAlive: true },
      p2: { username: 'Bob', lives: 2, isAlive: true },
    },
    playerOrder: ['p1', 'p2'],
    currentPlayerIndex: 0,
    currentWord: 'lighthouse',
    currentDefinition: 'A tall tower with a light.',
    timerStart: Date.now(),
    turnId: 'turn-abc',
    ...overrides,
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  mockSet.mockResolvedValue(undefined as any);
  mockUpdate.mockResolvedValue(undefined as any);
  mockRunTransaction.mockResolvedValue(undefined as any);
});

// ---------------------------------------------------------------------------
// createGame
// ---------------------------------------------------------------------------
describe('createGame', () => {
  it('calls set with a valid waiting-state game object', async () => {
    await createGame('user1', 'Alice');

    expect(mockSet).toHaveBeenCalledTimes(1);
    const [, gameArg] = mockSet.mock.calls[0];
    expect(gameArg.status).toBe('waiting');
    expect(gameArg.hostId).toBe('user1');
    expect(gameArg.players['user1']).toMatchObject({ username: 'Alice', lives: 2, isAlive: true });
    expect(gameArg.playerOrder).toEqual(['user1']);
    expect(gameArg.currentWord).toBe('testword');
  });

  it('returns a 6-character game code', async () => {
    const code = await createGame('user1', 'Alice');
    expect(typeof code).toBe('string');
    expect(code.length).toBe(6);
  });
});

// ---------------------------------------------------------------------------
// joinGame
// ---------------------------------------------------------------------------
describe('joinGame', () => {
  it('throws when the game does not exist', async () => {
    mockGet.mockResolvedValue(makeSnapshot(null, false));
    await expect(joinGame('XXXXXX', 'user2', 'Bob')).rejects.toThrow('Game not found.');
  });

  it('throws when the game has already started', async () => {
    mockGet.mockResolvedValue(makeSnapshot(makeGame({ status: 'active' })));
    await expect(joinGame('ABCDEF', 'user2', 'Bob')).rejects.toThrow('Game has already started.');
  });

  it('adds a new player and updates playerOrder', async () => {
    const waitingGame = makeGame({ status: 'waiting' });
    mockGet.mockResolvedValue(makeSnapshot(waitingGame));

    await joinGame('ABCDEF', 'p3', 'Charlie');

    expect(mockUpdate).toHaveBeenCalledTimes(1);
    const [, updateArg] = mockUpdate.mock.calls[0];
    expect(updateArg['players/p3']).toMatchObject({ username: 'Charlie', lives: 2, isAlive: true });
    expect(updateArg.playerOrder).toContain('p3');
  });

  it('returns early without updating if the player already joined', async () => {
    const waitingGame = makeGame({ status: 'waiting' });
    mockGet.mockResolvedValue(makeSnapshot(waitingGame));

    // p1 is already in the game
    await joinGame('ABCDEF', 'p1', 'Alice');

    expect(mockUpdate).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// startGame
// ---------------------------------------------------------------------------
describe('startGame', () => {
  it('throws when the game does not exist', async () => {
    mockGet.mockResolvedValue(makeSnapshot(null, false));
    await expect(startGame('XXXXXX')).rejects.toThrow('Game not found.');
  });

  it('sets status to active and writes a timerStart and turnId', async () => {
    mockGet.mockResolvedValue(makeSnapshot(makeGame({ status: 'waiting' })));

    await startGame('ABCDEF');

    expect(mockUpdate).toHaveBeenCalledTimes(1);
    const [, updateArg] = mockUpdate.mock.calls[0];
    expect(updateArg.status).toBe('active');
    expect(typeof updateArg.timerStart).toBe('number');
    expect(typeof updateArg.turnId).toBe('string');
    expect(updateArg.turnId.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// submitTurn – tests the transaction callback logic directly
// ---------------------------------------------------------------------------
describe('submitTurn – transaction logic', () => {
  let transactionCallback: (game: Game | null) => Game | undefined;

  beforeEach(async () => {
    mockRunTransaction.mockImplementation(async (_ref, cb) => {
      transactionCallback = cb as any;
    });
    await submitTurn('ABCDEF', true, 'turn-abc', 'lighthouse');
  });

  it('returns undefined (abort) when game is null', () => {
    expect(transactionCallback(null)).toBeUndefined();
  });

  it('returns undefined (abort) when turnId does not match', () => {
    const game = makeGame({ turnId: 'different-turn' });
    expect(transactionCallback(game)).toBeUndefined();
  });

  it('returns undefined (abort) when game is not active', () => {
    const game = makeGame({ status: 'waiting' });
    expect(transactionCallback(game)).toBeUndefined();
  });

  it('advances to the next player on a correct answer', () => {
    const game = makeGame();
    const result = transactionCallback(game)!;
    expect(result.currentPlayerIndex).toBe(1);
  });

  it('keeps the same player index on a wrong answer, but deducts a life', async () => {
    mockRunTransaction.mockImplementation(async (_ref, cb) => {
      transactionCallback = cb as any;
    });
    await submitTurn('ABCDEF', false, 'turn-abc', 'lighthouse');

    const game = makeGame();
    const result = transactionCallback(game)!;
    expect(result.players['p1'].lives).toBe(1);
    // Next player should still advance (wrong answer passes the bomb)
    expect(result.currentPlayerIndex).toBe(1);
  });

  it('picks a new word on a correct answer', () => {
    const game = makeGame();
    const result = transactionCallback(game)!;
    expect(result.currentWord).toBe('newword');
  });

  it('keeps the same word on a wrong answer', async () => {
    mockRunTransaction.mockImplementation(async (_ref, cb) => {
      transactionCallback = cb as any;
    });
    await submitTurn('ABCDEF', false, 'turn-abc', 'lighthouse');

    const game = makeGame();
    const result = transactionCallback(game)!;
    expect(result.currentWord).toBe('lighthouse');
  });

  it('marks the game as finished when only one player remains alive', async () => {
    mockRunTransaction.mockImplementation(async (_ref, cb) => {
      transactionCallback = cb as any;
    });
    await submitTurn('ABCDEF', false, 'turn-abc', 'lighthouse');

    // p1 has 1 life left; give them their last wrong answer
    const game = makeGame({
      players: {
        p1: { username: 'Alice', lives: 1, isAlive: true },
        p2: { username: 'Bob', lives: 2, isAlive: true },
      },
    });
    const result = transactionCallback(game)!;
    expect(result.status).toBe('finished');
    expect(result.winnerId).toBe('p2');
  });

  it('records lastResult with the correct playerId and outcome', () => {
    const game = makeGame();
    const result = transactionCallback(game)!;
    expect(result.lastResult).toMatchObject({
      playerId: 'p1',
      correct: true,
      word: 'lighthouse',
    });
  });

  it('skips dead players when finding the next turn holder', () => {
    const game = makeGame({
      players: {
        p1: { username: 'Alice', lives: 2, isAlive: true },
        p2: { username: 'Bob', lives: 0, isAlive: false },
        p3: { username: 'Charlie', lives: 2, isAlive: true },
      },
      playerOrder: ['p1', 'p2', 'p3'],
      currentPlayerIndex: 0,
    });
    const result = transactionCallback(game)!;
    // p2 is dead, so the turn should skip to p3 (index 2)
    expect(result.currentPlayerIndex).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// subscribeToGame
// ---------------------------------------------------------------------------
describe('subscribeToGame', () => {
  it('registers an onValue listener and returns an unsubscribe function', () => {
    const mockUnsub = jest.fn();
    mockOnValue.mockReturnValue(mockUnsub as any);

    const onUpdate = jest.fn();
    const unsubscribe = subscribeToGame('ABCDEF', onUpdate);

    expect(mockOnValue).toHaveBeenCalledTimes(1);
    expect(typeof unsubscribe).toBe('function');
  });

  it('calls onUpdate with null when the snapshot does not exist', () => {
    mockOnValue.mockImplementation((_ref, cb) => {
      (cb as any)(makeSnapshot(null, false));
      return jest.fn();
    });

    const onUpdate = jest.fn();
    subscribeToGame('ABCDEF', onUpdate);
    expect(onUpdate).toHaveBeenCalledWith(null);
  });

  it('calls onUpdate with the game data when the snapshot exists', () => {
    const game = makeGame();
    mockOnValue.mockImplementation((_ref, cb) => {
      (cb as any)(makeSnapshot(game));
      return jest.fn();
    });

    const onUpdate = jest.fn();
    subscribeToGame('ABCDEF', onUpdate);
    expect(onUpdate).toHaveBeenCalledWith(game);
  });
});
