import { create } from 'zustand';

type User = {
  userId: string;
  role: 'admin' | 'user';
} | null;

interface UserState {
  user: User;
  login: (user: Exclude<User, null>) => void;
  logout: () => void;
}

const useUserStore = create<UserState>((set: any) => ({
  user: null,
  login: (user: Exclude<User, null>) => set({ user }),
  logout: () => set({ user: null }),
}));

export default useUserStore;
