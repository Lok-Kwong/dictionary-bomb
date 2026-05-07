import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors, S } from '../../../constants/theme';
import { ChatMessage, sendChatMessage, subscribeToChat } from '../../../lib/gameService';
import { avatarColor } from './avatarColor';

const PANEL_WIDTH = Math.min(Dimensions.get('window').width * 0.85, 360);

interface Props {
  isOpen: boolean;
  onClose: () => void;
  gameCode: string;
  userId: string;
  username: string;
  lastWord?: string;
  lastWordCorrect?: boolean;
}

export default function ChatPanel({
  isOpen,
  onClose,
  gameCode,
  userId,
  username,
  lastWord,
  lastWordCorrect,
}: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList>(null);
  const slideAnim = useRef(new Animated.Value(PANEL_WIDTH)).current;

  useEffect(() => {
    const unsub = subscribeToChat(gameCode, setMessages);
    return unsub;
  }, [gameCode]);

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: isOpen ? 0 : PANEL_WIDTH,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  }, [isOpen, slideAnim]);

  useEffect(() => {
    if (messages.length > 0 && isOpen) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length, isOpen]);

  async function handleSend() {
    const text = input.trim();
    if (!text) return;
    setInput('');
    await sendChatMessage(gameCode, userId, username, text);
  }

  function formatTime(timestamp: number) {
    const d = new Date(timestamp);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  }

  return (
    <>
      {isOpen && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={onClose}
          activeOpacity={1}
        />
      )}

      <Animated.View
        style={[styles.panel, { transform: [{ translateX: slideAnim }] }]}
        pointerEvents={isOpen ? 'auto' : 'none'}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Chat</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.75}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {lastWord ? (
            <View
              style={[
                styles.lastWordBanner,
                lastWordCorrect ? styles.lastWordCorrect : styles.lastWordWrong,
              ]}
            >
              <Text style={styles.lastWordLabel}>LAST WORD GUESSED</Text>
              <Text style={styles.lastWordText}>{lastWord}</Text>
              <Text
                style={[
                  styles.lastWordResult,
                  { color: lastWordCorrect ? Colors.success : Colors.primary },
                ]}
              >
                {lastWordCorrect ? '✓ Correct' : '✗ Wrong'}
              </Text>
            </View>
          ) : null}

          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => item.id ?? item.timestamp.toString()}
            style={styles.messageList}
            contentContainerStyle={styles.messageListContent}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
            renderItem={({ item }) =>
              item.type === 'system' ? (
                <View style={styles.systemMsg}>
                  <Text style={styles.systemMsgText}>{item.message}</Text>
                </View>
              ) : (
                <View
                  style={[
                    styles.bubble,
                    item.userId === userId ? styles.myBubble : styles.theirBubble,
                  ]}
                >
                  {item.userId !== userId && (
                    <View style={styles.bubbleHeader}>
                      <View style={[styles.senderDot, { backgroundColor: avatarColor(item.userId) }]} />
                      <Text style={styles.senderName}>{item.username}</Text>
                      <Text style={styles.msgTime}>{formatTime(item.timestamp)}</Text>
                    </View>
                  )}
                  <Text style={styles.msgText}>{item.message}</Text>
                  {item.userId === userId && (
                    <Text style={[styles.msgTime, { alignSelf: 'flex-end', marginTop: 2 }]}>
                      {formatTime(item.timestamp)}
                    </Text>
                  )}
                </View>
              )
            }
            ListEmptyComponent={
              <View style={styles.emptyChat}>
                <Text style={styles.emptyChatText}>No messages yet.{'\n'}Say hi! 👋</Text>
              </View>
            }
          />

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Type a message…"
              placeholderTextColor={Colors.textMuted}
              returnKeyType="send"
              onSubmitEditing={handleSend}
              blurOnSubmit={false}
              maxLength={200}
            />
            <TouchableOpacity
              style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
              onPress={handleSend}
              disabled={!input.trim()}
              activeOpacity={0.8}
            >
              <Text style={styles.sendBtnText}>Send</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 10,
  },
  panel: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: PANEL_WIDTH,
    backgroundColor: Colors.surface,
    borderLeftWidth: 1,
    borderLeftColor: Colors.border,
    zIndex: 11,
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: { ...S.h3, fontSize: 20 },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  closeBtnText: { color: Colors.textSub, fontSize: 14 },

  lastWordBanner: {
    margin: 12,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 2,
    borderWidth: 1,
  },
  lastWordCorrect: {
    backgroundColor: 'rgba(48,209,88,0.08)',
    borderColor: 'rgba(48,209,88,0.3)',
  },
  lastWordWrong: {
    backgroundColor: 'rgba(255,59,48,0.08)',
    borderColor: 'rgba(255,59,48,0.3)',
  },
  lastWordLabel: { fontSize: 10, fontWeight: '700', color: Colors.textMuted, letterSpacing: 1.5 },
  lastWordText: { fontSize: 22, fontWeight: '800', color: Colors.text },
  lastWordResult: { fontSize: 12, fontWeight: '600' },

  messageList: { flex: 1 },
  messageListContent: { padding: 12, gap: 8, flexGrow: 1 },

  bubble: {
    maxWidth: '82%',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
  },
  myBubble: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primaryDim,
    borderColor: Colors.primary,
  },
  theirBubble: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.card,
    borderColor: Colors.border,
  },
  bubbleHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 },
  senderDot: { width: 8, height: 8, borderRadius: 4 },
  senderName: { color: Colors.textSub, fontSize: 12, fontWeight: '600', flex: 1 },
  msgTime: { color: Colors.textMuted, fontSize: 11 },
  msgText: { color: Colors.text, fontSize: 14, lineHeight: 20 },

  systemMsg: { alignSelf: 'center', paddingVertical: 4 },
  systemMsgText: { color: Colors.textMuted, fontSize: 12, textAlign: 'center' },

  emptyChat: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 48 },
  emptyChatText: { color: Colors.textMuted, fontSize: 14, textAlign: 'center', lineHeight: 22 },

  inputRow: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: Colors.text,
    fontSize: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  sendBtnDisabled: { opacity: 0.4 },
  sendBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
