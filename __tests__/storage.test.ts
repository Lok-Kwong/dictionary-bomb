import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserId, getUsername, saveUsername } from '../lib/storage';

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

beforeEach(() => {
  // Clear persisted store and reset call records between tests
  (mockAsyncStorage as any)._store && Object.keys((mockAsyncStorage as any)._store).forEach((k: string) => delete (mockAsyncStorage as any)._store[k]);
  jest.clearAllMocks();
});

describe('getUserId', () => {
  it('generates a non-empty string ID when none is stored', async () => {
    const id = await getUserId();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });

  it('persists and returns the same ID on repeated calls', async () => {
    const id1 = await getUserId();
    const id2 = await getUserId();
    expect(id1).toBe(id2);
  });

  it('reads from AsyncStorage before generating a new ID', async () => {
    await getUserId(); // first call generates and stores
    await getUserId(); // second call should read from storage
    expect(mockAsyncStorage.getItem).toHaveBeenCalledTimes(2);
    // setItem should only be called once (on generation)
    expect(mockAsyncStorage.setItem).toHaveBeenCalledTimes(1);
  });
});

describe('getUsername', () => {
  it('returns null when no username has been saved', async () => {
    const name = await getUsername();
    expect(name).toBeNull();
  });

  it('returns the username after it has been saved', async () => {
    await saveUsername('alice');
    const name = await getUsername();
    expect(name).toBe('alice');
  });
});

describe('saveUsername', () => {
  it('resolves without error', async () => {
    await expect(saveUsername('player1')).resolves.toBeUndefined();
  });

  it('overwrites a previously saved username', async () => {
    await saveUsername('alice');
    await saveUsername('bob');
    const name = await getUsername();
    expect(name).toBe('bob');
  });

  it('writes to AsyncStorage with the correct key', async () => {
    await saveUsername('charlie');
    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
      '@dictbomb/username',
      'charlie',
    );
  });
});
