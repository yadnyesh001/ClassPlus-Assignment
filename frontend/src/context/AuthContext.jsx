import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);

const GUEST_KEY = 'guestUser';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const me = await api.me();
          setUser(me);
        } catch {
          localStorage.removeItem('token');
        }
      } else {
        const guest = localStorage.getItem(GUEST_KEY);
        if (guest) {
          setUser(JSON.parse(guest));
          setIsGuest(true);
        }
      }
      setLoading(false);
    })();
  }, []);

  async function login(email, password) {
    const { token, user } = await api.login({ email, password });
    localStorage.setItem('token', token);
    localStorage.removeItem(GUEST_KEY);
    setIsGuest(false);
    setUser(user);
  }

  async function register(payload) {
    const { token, user } = await api.register(payload);
    localStorage.setItem('token', token);
    localStorage.removeItem(GUEST_KEY);
    setIsGuest(false);
    setUser(user);
  }

  function continueAsGuest({ name, profilePic = '' }) {
    const guest = { name: name || 'Guest', profilePic, email: '' };
    localStorage.setItem(GUEST_KEY, JSON.stringify(guest));
    setUser(guest);
    setIsGuest(true);
  }

  async function updateProfile(payload) {
    if (isGuest) {
      const next = { ...user, ...payload };
      localStorage.setItem(GUEST_KEY, JSON.stringify(next));
      setUser(next);
      return next;
    }
    const updated = await api.updateMe(payload);
    setUser(updated);
    return updated;
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem(GUEST_KEY);
    setUser(null);
    setIsGuest(false);
  }

  return (
    <AuthContext.Provider
      value={{ user, isGuest, loading, login, register, continueAsGuest, updateProfile, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
