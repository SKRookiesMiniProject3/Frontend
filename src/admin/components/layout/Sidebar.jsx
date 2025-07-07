import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../../components/Sidebar.module.css';

const Sidebar = ({ active }) => {
  const menuItems = [
    { label: '대시보드', path: '/admin' },
    { label: '회원관리', path: '/admin/member-crud' },
    { label: '리포트 관리', path: '/admin/error-report' },
  ];

  const navigate = useNavigate();

  return (
    <div className={styles.sidebar}>
      <div className={styles.menuIcon}>≡</div>
      <ul className={styles.menuList}>
        {menuItems.map((item) => (
          <li
            key={item.label}
            className={`${styles.menuItem} ${active === item.label ? styles.active : ''}`}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
