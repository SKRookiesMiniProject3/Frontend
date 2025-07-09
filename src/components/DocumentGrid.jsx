import React from 'react';
import DocumentCard from './DocumentCard';
import styles from './DocumentGrid.module.css';
import { downloadDocumentByHash } from '../api/documents';
import useAuthStore from '../stores/authStore';
import { ROLE_NAME_TO_ID } from '../constants/roleMap';

const DocumentGrid = ({ documents = [], mode = "view" }) => {
  const userRoleName = useAuthStore((state) => state.role);
  const userRoleId = ROLE_NAME_TO_ID[userRoleName] || 0;

  const handleClickCard = async (doc) => {
    const docRoleId = Number(doc.readRoleId);
    const isLocked = doc.readRoleId !== undefined && !isNaN(docRoleId) && userRoleId < docRoleId;

    console.log(`📝 ${doc.fileName}, readRoleId: ${doc.readRoleId}, userRoleId: ${userRoleId}, locked: ${isLocked}`);

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
      {documents.map((doc) => {
        const docRoleId = Number(doc.readRoleId);
        

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
            />
          </div>
        );
      })}
    </div>
  );
};

export default DocumentGrid;
