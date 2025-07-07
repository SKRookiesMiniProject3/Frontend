// src/components/DocumentCard.jsx
import React from 'react';
import styles from './DocumentCard.module.css';

const DocumentCard = ({ fileName, createdAt, locked }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR'); 
  };

  return (
    <div className={`${styles.card} ${locked ? styles.locked : ''}`}>
      <div className={styles.thumbnail}>
        {locked && <span className={styles.lockSymbol}>🔒</span>}
      </div>
      <div className={styles.title}>{fileName}</div>
      <div className={styles.date}>{formatDate(createdAt)}</div>
    </div>
  );
};

export default DocumentCard;
