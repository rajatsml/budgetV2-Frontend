import { create } from "zustand";

type UserRole = {
  projectType: string;
  departmentId: number;
  departmentName: string;
  role: string;
};

type AuthUser = {
  token: string;
  tokenType: string;
  expiresAt: number;
  expiresInSeconds: number;

  userId: string;
  employeeName: string;
  deptCode: string;
  deptNameShort: string;
  gradeCode: string;
  isBudgetManager: boolean;

  roles: UserRole[];

  // Frontend derived role
  role: "Admin" | "User";
} | null;

interface UserState {
  user: AuthUser;

  login: (userId: string, password: string) => Promise<AuthUser>;

  logout: () => void;

  isAuthenticated: () => boolean;
}

const STORAGE_KEY = "capex_auth";

const loadFromStorage = (): AuthUser => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return null;

    const parsed = JSON.parse(raw);

    if (parsed.expiresAt && parsed.expiresAt > Date.now()) {
      return parsed;
    }

    localStorage.removeItem(STORAGE_KEY);

    return null;
  } catch {
    return null;
  }
};

const useUserStore = create<UserState>((set, get) => ({
  user: loadFromStorage(),

  login: async (userId: string, password: string) => {
    const url = `${import.meta.env.VITE_API_URL}/api/Auth/login`;

    const body = {
      userId: userId.trim(),
      password,
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok || !data?.isSuccess) {
      throw new Error(data?.message || "Invalid User ID or Password");
    }

    const {
      token,
      tokenType,
      expiresInSeconds,
      userId: responseUserId,
      employeeName,
      deptCode,
      deptNameShort,
      gradeCode,
      isBudgetManager,
      roles = [],
    } = data;

    const expiresAt = Date.now() + (Number(expiresInSeconds) || 3600) * 1000;

    // Decide frontend role based on backend roles
    const frontendRole: "Admin" | "User" = roles.some((r: UserRole) =>
      ["Admin"].includes(r.role?.toUpperCase()),
    )
      ? "Admin"
      : "User";

    const userObj = {
      token,
      tokenType,
      expiresAt,
      expiresInSeconds: Number(expiresInSeconds) || 3600,

      userId: responseUserId,
      employeeName,
      deptCode,
      deptNameShort,
      gradeCode,
      isBudgetManager,
      roles,

      // derived frontend role
      role: frontendRole,
    };

    set({ user: userObj });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(userObj));

    return userObj;
  },

  logout: () => {
    set({ user: null });

    localStorage.removeItem(STORAGE_KEY);
  },

  isAuthenticated: () => {
    const user = get().user;

    return !!(user && user.expiresAt && user.expiresAt > Date.now());
  },
}));

export default useUserStore;
