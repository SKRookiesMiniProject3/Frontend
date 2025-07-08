// src/stores/authStore.js
import { create } from "zustand";

// 문자열 또는 배열 형태의 role을 "CEO" 같은 단일 문자열로 정제
const cleanRole = (rawRole) => {
  if (typeof rawRole === "string") {
    const match = rawRole.match(/^\[["']?(.+?)["']?\]$/);
    return match ? match[1] : rawRole;
  }
  if (Array.isArray(rawRole)) {
    return rawRole[0]; // ["CEO"] → "CEO"
  }
  return null;
};

const useAuthStore = create((set) => {
  // 초기값을 localStorage에서 불러옴
  const token = localStorage.getItem("accessToken");
  const storedUser = localStorage.getItem("userInfo");
  let parsedUser = null;

  try {
    parsedUser = storedUser ? JSON.parse(storedUser) : null;
    console.log("✅ 초기 로딩된 userInfo:", parsedUser);
  } catch (e) {
    console.warn("❌ userInfo 파싱 실패:", e);
  }

  const username = parsedUser?.username || null;
  const role = cleanRole(parsedUser?.role);

  return {
    isLoggedIn: !!token,
    accessToken: token,
    username,
    role,
    user: username && role ? { username, role } : null, // 기존 코드 호환용

    login: ({ token, username, role }) => {
      const stringRole = cleanRole(role);

      console.log("🔐 로그인 시도 - 받은 role:", role);
      console.log("➡️ 문자열로 처리된 role:", stringRole);

      if (!stringRole) {
        console.warn("❌ login: 유효하지 않은 role 형식");
        return;
      }

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
        user: { username, role: stringRole }, // 기존 코드 호환용
      });

      console.log("✅ 로그인 성공:", { username, token, role: stringRole });
    },

    logout: () => {
      console.log("🚪 로그아웃 수행됨");
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
