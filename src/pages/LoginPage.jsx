// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 로그인 성공 후 페이지 이동용
import styles from "./LoginPage.module.css";
import logoImage from "../assets/log2doc.png";
import { loginUser } from "../api/auth";
import useAuthStore from "../stores/authStore";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const login = useAuthStore((state) => state.login); 
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await loginUser(username, password);
      console.log("로그인 성공:", result);

      
      login(result.accessToken);

      
      navigate("/viewer"); // 또는 메인 페이지 등
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
