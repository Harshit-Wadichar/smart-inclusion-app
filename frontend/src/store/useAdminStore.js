// frontend/src/store/useAdminStore.js
import { create } from 'zustand'

export const useAdminStore = create((set) => ({
  isLoggedIn: false,
  adminName: '',
  login: (name) => set({ isLoggedIn: true, adminName: name }),
  logout: () => set({ isLoggedIn: false, adminName: '' }),
}))
