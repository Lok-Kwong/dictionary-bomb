import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_ID_KEY = '@dictbomb/userId';
const USERNAME_KEY = '@dictbomb/username';

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

export async function getUserId(): Promise<string> {
  let id = await AsyncStorage.getItem(USER_ID_KEY);
  if (!id) {
    id = genId();
    await AsyncStorage.setItem(USER_ID_KEY, id);
  }
  return id;
}

export async function getUsername(): Promise<string | null> {
  return AsyncStorage.getItem(USERNAME_KEY);
}

export async function saveUsername(name: string): Promise<void> {
  await AsyncStorage.setItem(USERNAME_KEY, name);
}
