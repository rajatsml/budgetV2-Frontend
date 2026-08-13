import { create } from 'zustand';

type AuthUser = {
  token: string;
  tokenType: string;
  expiresAt: number; // epoch ms
  expiresInSeconds: number;
  userId: string;
  username: string;
  role: string;
} | null;

interface UserState {
  user: AuthUser;
  login: (usernameOrId: string, password: string, type?: number) => Promise<AuthUser>;
  logout: () => void;
  isAuthenticated: () => boolean;
}

const STORAGE_KEY = 'capex_auth';

const loadFromStorage = (): AuthUser => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // ensure expiry is in the future
    if (parsed.expiresAt && parsed.expiresAt > Date.now()) return parsed;
    localStorage.removeItem(STORAGE_KEY);
    return null;
  } catch (e) {
    return null;
  }
};

const useUserStore = create<UserState>((set, get) => ({
  user: loadFromStorage(),

  login: async (usernameOrId: string, password: string, type?: number) => {
    const url = 'http://localhost:5024/api/Auth/login';
    try {
      let body: any;

      // if usernameOrId is numeric, send new payload { userId, password, type }
      if (/^\d+$/.test(usernameOrId)) {
        body = { userId: Number(usernameOrId), password, type: type ?? 1 };
      } else {
        body = { username: usernameOrId, password };
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: '*/*' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data?.message || 'Invalid username or password';
        throw new Error(msg);
      }

      const {
        token,
        tokenType,
        expiresInSeconds,
        userId,
        username: respUsername,
        role,
      } = data;

      const expiresAt = Date.now() + (Number(expiresInSeconds) || 3600) * 1000;

      const userObj = {
        token,
        tokenType,
        expiresAt,
        expiresInSeconds: Number(expiresInSeconds) || 3600,
        userId,
        username: respUsername,
        role,
      };

      set({ user: userObj });
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userObj));
      } catch (e) {
        console.warn('Failed to persist auth', e);
      }

      return userObj;
    } catch (err: any) {
      throw err;
    }
  },

  logout: () => {
    set({ user: null });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
  },

  isAuthenticated: () => {
    const u = get().user;
    return !!(u && u.expiresAt && u.expiresAt > Date.now());
  },
}));

export default useUserStore;
