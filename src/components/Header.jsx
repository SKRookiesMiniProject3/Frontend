// src/components/Header.jsx
import React from 'react';
import styles from './Header.module.css';
import logoImage from '../assets/log2doc.png';
import rookieslogo from '../assets/rookieslogo.png';
import useAuthStore from '../stores/authStore'; 

const Header = () => {
  const { username, role } = useAuthStore(); 

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <img src={logoImage} alt="logo" className={styles.logo} />
        <span className={styles.welcomeText}>
          {username && role ? `${username} ${role}님, 환영합니다!` : '환영합니다!'}
        </span>
      </div>
      <div className={styles.rightSection}>
        <img src={rookieslogo} alt="logo" className={styles.rookieslogo} />
      </div>
    </header>
  );
};

export default Header;
