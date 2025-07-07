import React from 'react';
import DocumentCard from './DocumentCard';
import styles from './DocumentGrid.module.css';
import { downloadDocumentByHash } from '../api/documents'; 

const DocumentGrid = ({ documents = [], mode = "view" }) => {
  const handleClickCard = async (doc) => {
    switch (mode) {
      case "view":
        console.log("문서 열람:", doc.fileName, doc.filePath);
        try {
          await downloadDocumentByHash(doc.filePath, doc.fileName); 
        } catch (err) {
          alert("파일 열람에 실패했습니다.");
        }
        break;

      case "edit":
        console.log("수정 모드:", doc.fileName, doc.id);
        // TODO: 수정 모달 or 페이지 연결
        break;

      case "delete":
        if (window.confirm(`"${doc.fileName}" 문서를 삭제하시겠습니까?`)) {
          console.log("삭제됨:", doc.id);
          // TODO: 삭제 API 호출
        }
        break;

      default:
        console.warn("알 수 없는 모드:", mode);
    }
  };

  return (
    <div className={styles.grid}>
      {documents.map((doc) => (
        <div key={doc.id} className={styles.card} onClick={() => handleClickCard(doc)}>
          <DocumentCard {...doc} />
        </div>
      ))}
    </div>
  );
};

export default DocumentGrid;
