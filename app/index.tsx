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
} from 'react-native';
import { router } from 'expo-router';
import { Colors, S } from '../constants/theme';
import { getUsername, saveUsername } from '../lib/storage';

export default function UsernameScreen() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getUsername().then((saved) => {
      if (saved) setUsername(saved);
      setLoading(false);
    });
  }, []);

  function validate(name: string): string | null {
    const trimmed = name.trim();
    if (trimmed.length < 2) return 'Username must be at least 2 characters.';
    if (trimmed.length > 20) return 'Username must be 20 characters or fewer.';
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) return 'Only letters, numbers, and underscores.';
    return null;
  }

  async function handleContinue() {
    const err = validate(username);
    if (err) { setError(err); return; }
    await saveUsername(username.trim());
    router.replace('/lobby');
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.inner}>
        <Text style={styles.bomb}>💣</Text>
        <Text style={styles.title}>Dictionary{'\n'}Bomb</Text>
        <Text style={styles.subtitle}>Guess the word before the bomb explodes.</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Choose a username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={(t) => { setUsername(t); setError(''); }}
            placeholder="e.g. WordWizard99"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={20}
            returnKeyType="done"
            onSubmitEditing={handleContinue}
          />
          {!!error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity style={styles.btn} onPress={handleContinue} activeOpacity={0.85}>
            <Text style={styles.btnText}>Continue →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.bg },
  inner: { flex: 1, justifyContent: 'center', paddingHorizontal: 28 },
  bomb: { fontSize: 64, textAlign: 'center', marginBottom: 16 },
  title: { ...S.h1, fontSize: 40, textAlign: 'center', lineHeight: 46 },
  subtitle: { ...S.small, textAlign: 'center', marginTop: 8, marginBottom: 40, fontSize: 15 },
  form: { gap: 10 },
  label: { ...S.small, marginBottom: 4 },
  input: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 15,
    color: Colors.text,
    fontSize: 17,
    fontWeight: '500',
  },
  error: { color: Colors.primary, fontSize: 13, marginTop: 4 },
  btn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
