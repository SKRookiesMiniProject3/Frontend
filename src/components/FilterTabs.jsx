// src/components/FilterTabs.jsx
import React, { useState } from 'react';
import styles from './FilterTabs.module.css';

const FilterTabs = () => {
  const categories = ['사업계획서', 'R&D', '실적보고서', 'Label'];
  const [selected, setSelected] = useState('사업계획서');

  return (
    <div className={styles.filterContainer}>
      {categories.map((category) => (
        <button
          key={category}
          className={`${styles.tab} ${
            selected === category ? styles.active : ''
          }`}
          onClick={() => setSelected(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
