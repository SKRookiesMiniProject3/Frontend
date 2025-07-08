import React from 'react';
import styles from '../../../components/Header.module.css';
import logoImage from '../../../assets/log2doc.png';
import rookieslogo from '../../../assets/rookieslogo.png';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <img src={logoImage} alt="logo" className={styles.logo} />
        <span className={styles.welcomeText}>이도건 관리자님, 환영합니다!</span>
      </div>
      <div className={styles.rightSection}>
        <img src={rookieslogo} alt="logo" className={styles.rookieslogo} />
      </div>
    </header>
  );
};

export default Header;
