import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getStorage, setStorage } from '../utils/storage';
import { emitRealtimeEvent } from '../services/realtime';

const AuthContext = createContext(null);

function hashPassword(value) {
  const text = typeof value === 'string' ? value : String(value ?? '');
  if (typeof window === 'undefined' || !window.crypto?.subtle) {
    return btoa(text);
  }

  const bytes = new TextEncoder().encode(text);
  const digest = window.crypto.subtle.digest('SHA-256', bytes);
  return digest.then((buffer) => Array.from(new Uint8Array(buffer)).map((byte) => byte.toString(16).padStart(2, '0')).join(''));
}

const normalizeUser = (user) => ({
  id: user.id,
  name: user.name,
  username: user.username,
  email: user.email,
  avatar: user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.username || user.id}`,
  bio: user.bio || 'Available to chat',
  isOnline: user.isOnline ?? true,
  lastSeen: user.lastSeen || new Date().toISOString(),
  createdAt: user.createdAt || new Date().toISOString(),
  passwordHash: user.passwordHash || '',
});

const sanitizeCurrentUser = (user) => {
  if (!user) return null;
  const { passwordHash, ...rest } = user;
  return rest;
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => getStorage('messaging_current_user'));
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const user = getStorage('messaging_current_user');
    if (user) {
      setCurrentUser(user);
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return;
    if (currentUser) {
      const safeUser = sanitizeCurrentUser(currentUser);
      setStorage('messaging_current_user', safeUser);
      emitRealtimeEvent('profile', { user: safeUser });
    } else {
      setStorage('messaging_current_user', null);
    }
  }, [currentUser, initialized]);

  const persistUser = (user) => {
    const safeUser = normalizeUser(user);
    const users = getStorage('messaging_users', []);
    const nextUsers = users.map((entry) => (entry.id === safeUser.id ? { ...entry, ...safeUser } : entry));
    setStorage('messaging_users', nextUsers);
    return safeUser;
  };

  const register = async (formData) => {
    const trimmedName = String(formData.name || '').trim();
    const trimmedUsername = String(formData.username || '').trim();
    const trimmedEmail = String(formData.email || '').trim();
    const password = String(formData.password || '');

    if (!trimmedName || !trimmedUsername || !trimmedEmail || !password) {
      throw new Error('Please complete all registration fields.');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      throw new Error('Please provide a valid email address.');
    }

    const users = getStorage('messaging_users', []);
    const usernameTaken = users.some((user) => user.username.toLowerCase() === trimmedUsername.toLowerCase());
    const emailTaken = users.some((user) => user.email.toLowerCase() === trimmedEmail.toLowerCase());

    if (usernameTaken || emailTaken) {
      throw new Error('A user with that username or email already exists.');
    }

    const passwordHash = await hashPassword(password);
    const user = {
      id: crypto.randomUUID ? crypto.randomUUID() : `user-${Date.now()}`,
      name: trimmedName,
      username: trimmedUsername,
      email: trimmedEmail,
      avatar: formData.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${trimmedUsername}`,
      bio: formData.bio || 'Hello there! I am ready to chat.',
      isOnline: true,
      lastSeen: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      passwordHash,
    };

    const nextUsers = [...users, user];
    setStorage('messaging_users', nextUsers);

    const loggedIn = normalizeUser(user);
    delete loggedIn.passwordHash;
    setCurrentUser(loggedIn);
    emitRealtimeEvent('profile', { user: loggedIn });
    return loggedIn;
  };

  const login = async ({ username, password }) => {
    const users = getStorage('messaging_users', []);
    const query = String(username || '').trim().toLowerCase();
    const enteredPassword = String(password || '');

    if (!query || !enteredPassword) {
      throw new Error('Username and password are required.');
    }

    const match = users.find(
      (user) => user.username.toLowerCase() === query || user.email.toLowerCase() === query,
    );

    if (!match) {
      throw new Error('No account matched those credentials.');
    }

    const hash = await hashPassword(enteredPassword);
    if (hash !== match.passwordHash) {
      throw new Error('Incorrect password.');
    }

    const nextUser = normalizeUser({ ...match, isOnline: true, lastSeen: new Date().toISOString() });
    const updatedUsers = users.map((user) => (user.id === nextUser.id ? { ...user, isOnline: true, lastSeen: nextUser.lastSeen } : user));
    setStorage('messaging_users', updatedUsers);
    delete nextUser.passwordHash;
    setCurrentUser(nextUser);
    emitRealtimeEvent('profile', { user: nextUser });
    return nextUser;
  };

  const logout = () => {
    const current = getStorage('messaging_current_user');
    if (current) {
      const users = getStorage('messaging_users', []);
      const nextUsers = users.map((user) => (user.id === current.id ? { ...user, isOnline: false, lastSeen: new Date().toISOString() } : user));
      setStorage('messaging_users', nextUsers);
    }

    setCurrentUser(null);
    setStorage('messaging_current_user', null);
    emitRealtimeEvent('profile', { user: null });
  };

  const updateProfile = (changes) => {
    const current = getStorage('messaging_current_user');
    if (!current) return null;

    const nextUser = normalizeUser({ ...current, ...changes, lastSeen: new Date().toISOString() });
    const users = getStorage('messaging_users', []);
    const nextUsers = users.map((user) => (user.id === current.id ? { ...user, ...nextUser } : user));
    setStorage('messaging_users', nextUsers);
    const safeUser = sanitizeCurrentUser(nextUser);
    setCurrentUser(safeUser);
    setStorage('messaging_current_user', safeUser);
    emitRealtimeEvent('profile', { user: safeUser });
    return safeUser;
  };

  const value = useMemo(
    () => ({
      currentUser,
      initialized,
      register,
      login,
      logout,
      updateProfile,
      persistUser,
    }),
    [currentUser, initialized],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
