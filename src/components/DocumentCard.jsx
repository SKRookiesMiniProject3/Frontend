import React from 'react';
import styles from './DocumentCard.module.css';
import { categoryImageMap } from '../constants/categoryImageMap'; // 매핑한 객체

const DocumentCard = ({ fileName, createdAt, createdRole, locked, categoryKey }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  const imagePath = categoryImageMap[categoryKey] || categoryImageMap.DEFAULT;

  return (
    <div className={`${styles.card} ${locked ? styles.locked : ''}`}>
      <div className={styles.thumbnail}>
        {locked && <span className={styles.lockSymbol}>🔒</span>}
        <img
          src={`/assets/${imagePath}`}
          alt="문서 이미지"
          className={styles.thumbnailImage}
        />
      </div>

      <div className={styles.title}>{fileName}</div>

      <div className={styles.meta}>
        {createdRole && <span className={styles.author}>작성자: {createdRole}</span>}
        <span className={styles.date}>{formatDate(createdAt)}</span>
      </div>
    </div>
  );
};

export default DocumentCard;
