// src/components/SortTabs.jsx
import React, { useState } from 'react';
import styles from './FilterTabs.module.css'; // 스타일은 그대로 사용

const SortTabs = () => {
  const sortOptions = ['최신순', '오래된순', '이름순'];
  const [selected, setSelected] = useState('최신순');

  return (
    <div className={styles.filterContainer}>
      {sortOptions.map((option) => (
        <button
          key={option}
          className={`${styles.tab} ${selected === option ? styles.active : ''}`}
          onClick={() => setSelected(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default SortTabs;
