// src/stores/authStore.js
import { create } from "zustand";

const useAuthStore = create((set) => {
  // 초기값을 localStorage에서 불러옴
  const token = localStorage.getItem("accessToken");
  const storedUser = localStorage.getItem("userInfo");
  const userInfo = storedUser ? JSON.parse(storedUser) : null;

  return {
    isLoggedIn: !!token,
    accessToken: token,
    username: userInfo?.username || null,
    role: userInfo?.role || null,

    login: ({ token, username, role }) => {
      localStorage.setItem("accessToken", token);
      localStorage.setItem("userInfo", JSON.stringify({ username, role }));
      set({
        isLoggedIn: true,
        accessToken: token,
        username,
        role,
      });
    },

    logout: () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userInfo");
      set({
        isLoggedIn: false,
        accessToken: null,
        username: null,
        role: null,
      });
    },
  };
});

export default useAuthStore;
