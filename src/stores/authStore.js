// src/stores/authStore.js
import { create } from "zustand";

const useAuthStore = create((set) => ({
  isLoggedIn: false,
  accessToken: null,
  username: null,
  role: null,

  login: ({ token, username, role }) => {
    localStorage.setItem("accessToken", token);
    set({
      isLoggedIn: true,
      accessToken: token,
      username,
      role,
    });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    set({
      isLoggedIn: false,
      accessToken: null,
      username: null,
      role: null,
    });
  },
}));

export default useAuthStore;
