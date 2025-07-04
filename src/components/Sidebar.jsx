// src/components/Sidebar.jsx
import React, { useState } from 'react';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const [active, setActive] = useState('열람');

  const menuItems = ['열람', '수정', '등록'];

  return (
    <div className={styles.sidebar}>
      <div className={styles.menuIcon}>≡</div>
      <ul className={styles.menuList}>
        {menuItems.map((item) => (
          <li
            key={item}
            className={`${styles.menuItem} ${active === item ? styles.active : ''}`}
            onClick={() => setActive(item)}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
