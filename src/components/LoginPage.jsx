import React from 'react';
import styles from './LoginPage.module.css';
import logoImage from '../assets/log2doc.png';

const LoginPage = () => {
  return (
    <div className={styles.loginContainer}>
      <img src={logoImage} alt="Log2Doc Logo" className={styles.logo} />
      <div className={styles.loginBox}>
        <label>ID</label>
        <input type="text" className={styles.inputField} />
        <label>PASSWORD</label>
        <input type="password" className={styles.inputField} />
        <button className={styles.loginButton}>Login</button>
      </div>
    </div>
  );
};

export default LoginPage;
