// src/pages/LoginPage.jsx
import React, { useState } from "react";
import styles from "./LoginPage.module.css";
import logoImage from "../assets/log2doc.png";
import { loginUser } from "../api/auth";
import useAuthStore from "../stores/authStore";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = useAuthStore((state) => state.login); 

  const handleLogin = async () => {
  try {
    const result = await loginUser(username, password);
    const accessToken = result.token;
    if (!accessToken) {
      throw new Error("accessToken이 없습니다.");
    }

    login(accessToken); 
    console.log(" 로그인 성공 - 저장된 토큰:", accessToken);
    console.log(" localStorage 저장됨:", localStorage.getItem("accessToken"));
  } catch (err) {
    console.error("로그인 실패:", err);
    setError(err.message || "로그인 실패");
  }
};

  return (
    <div className={styles.loginContainer}>
      <img src={logoImage} alt="Log2Doc Logo" className={styles.logo} />
      <div className={styles.loginBox}>
        <label>ID</label>
        <input
          type="text"
          className={styles.inputField}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>PASSWORD</label>
        <input
          type="password"
          className={styles.inputField}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className={styles.loginButton} onClick={handleLogin}>
          Login
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
