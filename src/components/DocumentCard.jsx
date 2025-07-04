// src/components/DocumentCard.jsx
import React from 'react';
import styles from './DocumentCard.module.css';

const DocumentCard = ({ title, updatedAt, locked }) => {
  return (
    <div className={`${styles.card} ${locked ? styles.locked : ''}`}>
      <div className={styles.thumbnail}>
        {locked && <span className={styles.lockSymbol}>🔒</span>}
      </div>
      <div className={styles.title}>{title}</div>
      <div className={styles.date}>{updatedAt}</div>
    </div>
  );
};

export default DocumentCard;
