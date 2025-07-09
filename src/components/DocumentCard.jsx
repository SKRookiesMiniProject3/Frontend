import React from 'react';
import styles from './DocumentCard.module.css';

const DocumentCard = ({ fileName, createdAt, createdRole, locked }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  return (
    <div className={`${styles.card} ${locked ? styles.locked : ''}`}>
      <div className={styles.thumbnail}>
        {locked && <span className={styles.lockSymbol}>🔒</span>}
      </div>

      <div className={styles.title}>{fileName}</div>

      <div className={styles.meta}>
        {createdRole && <span className={styles.author}>{createdRole}</span>}
        {createdRole && <span className={styles.dot}>·</span>}
        <span className={styles.date}>{formatDate(createdAt)}</span>
      </div>
    </div>
  );
};

export default DocumentCard;
