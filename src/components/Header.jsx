// src/components/Header.jsx
import React from 'react';
import styles from './Header.module.css';
import logoImage from '../assets/log2doc.png';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <img src={logoImage} alt="logo" className={styles.logo} />
        <span className={styles.welcomeText}>이도건 PM님, 환영합니다!</span>
      </div>
      <div className={styles.rightSection}>
        <div className={styles.profileCircle}>서</div>
      </div>
    </header>
  );
};

export default Header;
