import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getStorage, setStorage } from '../utils/storage';
import { emitRealtimeEvent, subscribeToRealtime } from '../services/realtime';
import { useAuth } from './AuthContext';

const ChatContext = createContext(null);

const sortByNewest = (items = []) => [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

export function ChatProvider({ children }) {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState(() => getStorage('messaging_conversations', []));
  const [messages, setMessages] = useState(() => getStorage('messaging_messages', []));

  const refreshData = () => {
    setConversations(getStorage('messaging_conversations', []));
    setMessages(getStorage('messaging_messages', []));
  };

  useEffect(() => {
    if (!currentUser) return undefined;

    const unsubscribe = subscribeToRealtime((event) => {
      if (event?.type === 'message' || event?.type === 'conversation' || event?.type === 'profile' || event?.type === 'read') {
        refreshData();
      }
    });

    return unsubscribe;
  }, [currentUser]);

  const ensureConversations = (next) => {
    setStorage('messaging_conversations', next);
    setConversations(next);
  };

  const getUserById = (userId) => {
    const users = getStorage('messaging_users', []);
    return users.find((user) => user.id === userId);
  };

  const createConversation = (otherUserId) => {
    const otherUser = getUserById(otherUserId);
    if (!currentUser || !otherUser) return null;

    const currentId = currentUser.id;
    const existing = getStorage('messaging_conversations', []).find((conversation) => {
      const participants = conversation.participants || [];
      return participants.includes(currentId) && participants.includes(otherUserId);
    });

    if (existing) return existing;

    const conversation = {
      id: crypto.randomUUID ? crypto.randomUUID() : `conversation-${Date.now()}`,
      participants: [currentId, otherUserId],
      lastMessage: '',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    const next = [conversation, ...getStorage('messaging_conversations', [])];
    ensureConversations(next);
    emitRealtimeEvent('conversation', { conversation });
    return conversation;
  };

  const sendMessage = ({ conversationId, content, replyTo }) => {
    const cleanContent = String(content || '').trim();
    if (!currentUser || !conversationId || !cleanContent) {
      return null;
    }

    const message = {
      id: crypto.randomUUID ? crypto.randomUUID() : `message-${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      content: cleanContent,
      type: 'text',
      status: 'sent',
      replyTo: replyTo || null,
      createdAt: new Date().toISOString(),
    };

    const nextMessages = [...getStorage('messaging_messages', []), message];
    setStorage('messaging_messages', nextMessages);
    setMessages(nextMessages);

    const nextConversations = getStorage('messaging_conversations', []).map((conversation) =>
      conversation.id === conversationId
        ? { ...conversation, lastMessage: cleanContent, updatedAt: new Date().toISOString() }
        : conversation,
    );
    const sorted = sortByNewest(nextConversations);
    ensureConversations(sorted);
    emitRealtimeEvent('message', { message, conversationId });
    return message;
  };

  const editMessage = (messageId, content) => {
    const nextMessages = getStorage('messaging_messages', []).map((message) =>
      message.id === messageId ? { ...message, content, status: 'edited' } : message,
    );
    setStorage('messaging_messages', nextMessages);
    setMessages(nextMessages);

    const conversation = getStorage('messaging_conversations', []).find((entry) =>
      nextMessages.some((item) => item.conversationId === entry.id && item.id === messageId),
    );
    if (conversation) {
      const updated = getStorage('messaging_conversations', []).map((entry) =>
        entry.id === conversation.id ? { ...entry, lastMessage: content, updatedAt: new Date().toISOString() } : entry,
      );
      ensureConversations(sortByNewest(updated));
    }
    emitRealtimeEvent('message', { messageId, action: 'edit' });
  };

  const deleteMessage = (messageId) => {
    const nextMessages = getStorage('messaging_messages', []).filter((message) => message.id !== messageId);
    setStorage('messaging_messages', nextMessages);
    setMessages(nextMessages);
    emitRealtimeEvent('message', { messageId, action: 'delete' });
  };

  const markConversationAsRead = (conversationId) => {
    const nextMessages = getStorage('messaging_messages', []).map((message) =>
      message.conversationId === conversationId && message.senderId !== currentUser?.id && message.status !== 'read'
        ? { ...message, status: 'read' }
        : message,
    );
    setStorage('messaging_messages', nextMessages);
    setMessages(nextMessages);
    emitRealtimeEvent('read', { conversationId });
  };

  const getMessagesForConversation = (conversationId) =>
    sortByNewest(getStorage('messaging_messages', []).filter((message) => message.conversationId === conversationId));

  const getUnreadCount = (conversation) => {
    if (!currentUser || !conversation) return 0;
    const conversationMessages = getStorage('messaging_messages', []).filter(
      (message) => message.conversationId === conversation.id,
    );
    return conversationMessages.filter(
      (message) => message.senderId !== currentUser.id && message.status !== 'read',
    ).length;
  };

  const value = useMemo(
    () => ({
      conversations,
      messages,
      getUserById,
      createConversation,
      sendMessage,
      editMessage,
      deleteMessage,
      markConversationAsRead,
      getMessagesForConversation,
      getUnreadCount,
      refreshData,
    }),
    [conversations, messages, currentUser],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used inside ChatProvider');
  }

  return context;
}
