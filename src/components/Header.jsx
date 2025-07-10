// src/components/Header.jsx
import React from 'react';
import styles from './Header.module.css';
import logoImage from '../assets/log2doc.png';
import rookieslogo from '../assets/rookieslogo.png';
import useAuthStore from '../stores/authStore';

const Header = ({ isAdminPage = false, onNavigateAdminPage }) => {
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
        {role === 'CEO' && (
          <label className={styles.switch}>
            <span className={styles.switchText}>
              {isAdminPage ? '관리자 페이지' : '클라이언트 페이지'}
            </span>
            <input
              type="checkbox"
              checked={isAdminPage}
              onChange={onNavigateAdminPage}
            />
            <span className={styles.slider}></span>
          </label>
        )}
        <img src={rookieslogo} alt="logo" className={styles.rookieslogo} />
      </div>
    </header>
  );
};

export default Header;
