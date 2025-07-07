// src/stores/authStore.js
import { create } from 'zustand';

const useAuthStore = create((set) => {
  const token = localStorage.getItem("accessToken");
  const isLoggedIn = !!token;

  return {
    isLoggedIn,
    accessToken: token,
    login: (token) => {
      localStorage.setItem("accessToken", token); // ✅ 로컬 저장
      set({ isLoggedIn: true, accessToken: token });
    },
    logout: () => {
      localStorage.removeItem("accessToken");
      set({ isLoggedIn: false, accessToken: null });
    },
  };
});

export default useAuthStore;
