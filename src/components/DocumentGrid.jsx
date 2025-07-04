// src/components/DocumentGrid.jsx
import React from 'react';
import DocumentCard from './DocumentCard';
import styles from './DocumentGrid.module.css';

const dummyData = [
  { title: 'R&D 계획서', updatedAt: '2024-06-01', locked: false },
  { title: '재무 계획서', updatedAt: '2024-06-02', locked: true },
  { title: '인사 평가 기준', updatedAt: '2024-06-03', locked: true },
  { title: '제품 소개서', updatedAt: '2024-06-04', locked: false },
];

const DocumentGrid = () => {
  return (
    <div className={styles.grid}>
      {dummyData.map((doc, index) => (
        <DocumentCard
          key={index}
          title={doc.title}
          updatedAt={doc.updatedAt}
          locked={doc.locked}
        />
      ))}
    </div>
  );
};

export default DocumentGrid;
