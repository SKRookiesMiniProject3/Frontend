import React from 'react';
import styles from './DocumentCard.module.css';
import { categoryIcons } from '../constants/iconMap';

const DocumentCard = ({ fileName, createdAt, createdRole, categoryKey }) => {
  // 날짜 문자열을 'YYYY.MM.DD' 형식으로 변환
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  const IconComponent = categoryIcons[categoryKey] || categoryIcons.전체;

  return (
    <div className={styles.card}>
      <div className={styles.thumbnail}>
        <div className={styles.iconWrapper}>
          <IconComponent size={36} className={styles.icon} />
        </div>
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
