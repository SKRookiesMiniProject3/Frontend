// src/stores/authStore.js
import { create } from 'zustand';

const useAuthStore = create((set) => {
  const token = localStorage.getItem("accessToken");
  const storedUser = localStorage.getItem("userInfo");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return {
    isLoggedIn: !!token,
    accessToken: token,
    user: user,

    login: (token, user) => {
      localStorage.setItem("accessToken", token); 
      localStorage.setItem("userInfo", JSON.stringify(user));
      set({ isLoggedIn: true, accessToken: token, user });
    },
    logout: () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userInfo");
      set({ isLoggedIn: false, accessToken: null,user: null });
    },
  };
});

export default useAuthStore;
