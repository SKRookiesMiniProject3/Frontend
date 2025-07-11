import React from 'react';
import DocumentCard from './DocumentCard';
import styles from './DocumentGrid.module.css';
import { downloadDocumentByHash } from '../api/documents';
import useAuthStore from '../stores/authStore';
import { ROLE_NAME_TO_ID } from '../constants/roleMap';
import { categoryIcons, categoryNameMap } from '../constants/iconMap';

const DocumentGrid = ({ documents = [], mode = "view" }) => {
  const userRoleName = useAuthStore((state) => state.role);
  const userRoleId = ROLE_NAME_TO_ID[userRoleName] || 0;

  // 문서 클릭 시 다운로드 요청 처리
  const handleClickCard = async (doc) => {
    if (mode === "view") {
      try {
        await downloadDocumentByHash(doc.filePath, doc.fileName);
      } catch (err) {
        alert("파일 열람에 실패했습니다.");
      }
    }
  };

  return (
    <div className={styles.grid}>
      {[...documents]
        .sort((a, b) => b.id - a.id)
        .map((doc) => {
          const dbCategoryName = doc.categories?.[0]?.name || '전체';
          const mappedName = categoryNameMap[dbCategoryName] || '전체';

          return (
            <div
              key={doc.id}
              className={styles.card}
              onClick={() => handleClickCard(doc)}
            >
              <DocumentCard
                fileName={doc.fileName}
                createdAt={doc.createdAt}
                createdRole={doc.createdRole}
                categoryKey={mappedName}
              />
            </div>
          );
        })}
    </div>
  );
};

export default DocumentGrid;
