// src/pages/admin/components/Header.jsx
import React from 'react';
import styles from '../../../components/Header.module.css';
import logoImage from '../../../assets/log2doc.png';
import rookieslogo from '../../../assets/rookieslogo.png';
import useAuthStore from '../../../stores/authStore'; 

const AdminHeader = () => {
  const { username, role } = useAuthStore(); 

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <img src={logoImage} alt="logo" className={styles.logo} />
        <span className={styles.welcomeText}>
          {username && role ? `${username} ${role}님, 관리자 페이지에 오신 것을 환영합니다!` : '관리자 페이지'}
        </span>
      </div>
      <div className={styles.rightSection}>
        <img src={rookieslogo} alt="rookies" className={styles.rookieslogo} />
      </div>
    </header>
  );
};

export default AdminHeader;
