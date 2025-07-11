// src/stores/authStore.js
import { create } from "zustand";

// 역할 문자열을 일관된 형식("CEO")으로 정제
const cleanRole = (rawRole) => {
  if (typeof rawRole === "string") {
    const match = rawRole.match(/^\[["']?(.+?)["']?\]$/);
    return match ? match[1] : rawRole;
  }
  if (Array.isArray(rawRole)) {
    return rawRole[0];
  }
  return null;
};

const useAuthStore = create((set) => {
  const token = localStorage.getItem("accessToken");
  const storedUser = localStorage.getItem("userInfo");
  let parsedUser = null;

  try {
    parsedUser = storedUser ? JSON.parse(storedUser) : null;
  } catch (e) {
    parsedUser = null;
  }

  const username = parsedUser?.username || null;
  const role = cleanRole(parsedUser?.role);

  return {
    isLoggedIn: !!token,
    accessToken: token,
    username,
    role,
    user: username && role ? { username, role } : null,

    // 로그인 시 상태 저장 및 로컬 스토리지 갱신
    login: ({ token, username, role }) => {
      const stringRole = cleanRole(role);
      if (!stringRole) return;

      localStorage.setItem("accessToken", token);
      localStorage.setItem(
        "userInfo",
        JSON.stringify({ username, role: stringRole })
      );

      set({
        isLoggedIn: true,
        accessToken: token,
        username,
        role: stringRole,
        user: { username, role: stringRole },
      });
    },

    // 로그아웃 시 상태 초기화 및 로컬 스토리지 제거
    logout: () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userInfo");

      set({
        isLoggedIn: false,
        accessToken: null,
        username: null,
        role: null,
        user: null,
      });
    },
  };
});

export default useAuthStore;
