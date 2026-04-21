import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Colors, S } from '../constants/theme';
import { getUsername, getUserId } from '../lib/storage';
import { createGame, joinGame } from '../lib/gameService';

export default function LobbyScreen() {
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getUsername(), getUserId()]).then(([name, id]) => {
      setUsername(name ?? '');
      setUserId(id);
    });
  }, []);

  async function handleCreate() {
    setError('');
    setLoading(true);
    try {
      const code = await createGame(userId, username);
      router.push(`/game/${code}`);
    } catch (e: any) {
      setError(e.message ?? 'Failed to create game.');
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin() {
    const code = joinCode.trim().toUpperCase();
    if (code.length !== 6) { setError('Enter a valid 6-character game code.'); return; }
    setError('');
    setLoading(true);
    try {
      await joinGame(code, userId, username);
      router.push(`/game/${code}`);
    } catch (e: any) {
      setError(e.message ?? 'Failed to join game.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.inner}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hey, {username} 👋</Text>
          <Text style={styles.title}>Ready to play?</Text>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.createBtn, loading && styles.disabled]}
            onPress={handleCreate}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.createIcon}>💣</Text>
                <Text style={styles.createBtnText}>Create New Game</Text>
                <Text style={styles.createSubText}>Share the code with friends</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or join one</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Game Code</Text>
          <TextInput
            style={styles.input}
            value={joinCode}
            onChangeText={(t) => { setJoinCode(t.toUpperCase()); setError(''); }}
            placeholder="ABCD12"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={6}
            returnKeyType="join"
            onSubmitEditing={handleJoin}
          />
          {!!error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity
            style={[styles.joinBtn, loading && styles.disabled]}
            onPress={handleJoin}
            activeOpacity={0.85}
            disabled={loading}
          >
            <Text style={styles.joinBtnText}>Join Game →</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.changeUser}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.changeUserText}>Change username</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  inner: { flex: 1, paddingHorizontal: 24, paddingTop: 72, paddingBottom: 32 },
  header: { marginBottom: 36 },
  greeting: { ...S.small, fontSize: 15, marginBottom: 4 },
  title: { ...S.h1 },
  section: { gap: 10, marginBottom: 8 },
  createBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 22,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 4,
  },
  createIcon: { fontSize: 32, marginBottom: 4 },
  createBtnText: { color: '#fff', fontSize: 19, fontWeight: '700' },
  createSubText: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 20,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { ...S.small },
  label: { ...S.small, marginBottom: 2 },
  input: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 15,
    color: Colors.text,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 4,
    textAlign: 'center',
  },
  error: { color: Colors.primary, fontSize: 13 },
  joinBtn: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  joinBtnText: { color: Colors.text, fontSize: 16, fontWeight: '600' },
  disabled: { opacity: 0.5 },
  changeUser: { marginTop: 'auto', alignItems: 'center', paddingVertical: 12 },
  changeUserText: { color: Colors.textSub, fontSize: 14, textDecorationLine: 'underline' },
});
