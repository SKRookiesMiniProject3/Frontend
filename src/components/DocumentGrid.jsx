// src/components/DocumentGrid.jsx
import React from 'react';
import DocumentCard from './DocumentCard';
import styles from './DocumentGrid.module.css';

const DocumentGrid = ({ documents = [], mode = "view" }) => {
  const handleClickCard = (doc) => {
    if (mode === "view") {
      // 권한 확인 → 열람 페이지 or 모달
      console.log("문서 열람:", doc.title);
    } else if (mode === "edit") {
      // 수정 폼 띄우기
      console.log("수정 모드:", doc.title);
    } else if (mode === "delete") {
      if (window.confirm("정말 삭제하시겠습니까?")) {
        console.log("삭제됨:", doc.title);
        // 삭제 API 호출 예정
      }
    }
  };

  return (
    <div className={styles.grid}>
      {documents.map((doc, idx) => (
        <div key={idx} className={styles.card} onClick={() => handleClickCard(doc)}>
          <DocumentCard {...doc} />
        </div>
      ))}
    </div>
  );
};

export default DocumentGrid;
