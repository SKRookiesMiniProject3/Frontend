import React from 'react';
import DocumentCard from './DocumentCard';
import styles from './DocumentGrid.module.css';
import { downloadDocumentByHash } from '../api/documents';
import useAuthStore from '../stores/authStore';
import { ROLE_NAME_TO_ID } from '../constants/roleMap';
import { categoryImageMap } from '../constants/categoryImageMap'; // 이미지 매핑 확인용

const DocumentGrid = ({ documents = [], mode = "view" }) => {
  const userRoleName = useAuthStore((state) => state.role);
  const userRoleId = ROLE_NAME_TO_ID[userRoleName] || 0;

  const handleClickCard = async (doc) => {
    const docRoleId = Number(doc.readRole?.id);
    const isLocked = doc.readRole !== undefined && !isNaN(docRoleId) && userRoleId < docRoleId;


    if (mode === "view") {
      if (isLocked) {
        alert("열람 권한이 없습니다.");
        return;
      }

      try {
        await downloadDocumentByHash(doc.filePath, doc.fileName);
      } catch (err) {
        alert("파일 열람에 실패했습니다.");
      }
    } else {
      console.warn("알 수 없는 모드:", mode);
    }
  };

  return (
    <div className={styles.grid}>
      {[...documents]
        .sort((a, b) => b.id - a.id)
        .map((doc) => {
          const categoryName = doc.categories?.[0]?.name || 'DEFAULT';
          const categoryKey = categoryName.toUpperCase().replace(/ /g, '_');
          const imagePath = categoryImageMap[categoryKey] || categoryImageMap.DEFAULT;

          console.log("📌 카테고리 이름:", categoryName);
          console.log("📌 가공된 키:", categoryKey);
          console.log("📌 이미지 경로:", imagePath);

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
                categoryKey={categoryKey}
              />
            </div>
          );
        })}
    </div>
  );
};

export default DocumentGrid;
