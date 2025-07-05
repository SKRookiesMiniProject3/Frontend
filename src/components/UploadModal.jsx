import React, { useState } from "react";
import styles from "./UploadModal.module.css";

const UploadModal = ({ onClose, onUpload }) => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("사업계획서"); // ✅ 보고서 종류

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !file) return;
    onUpload({ title, file, category }); // ✅ category도 함께 전송
    onClose();
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <h2>문서 등록</h2>
        <form onSubmit={handleSubmit}>
          <label>
            제목:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>

          <label>
            파일:
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </label>

          <label>
            보고서 종류:
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="사업계획서">사업계획서</option>
              <option value="R&D 계획서">R&D 계획서</option>
              <option value="실적보고서">실적보고서</option>
              <option value="재무계획서">재무계획서</option>
              <option value="제품소개서">제품소개서</option>
            </select>
          </label>

          <div className={styles.buttonGroup}>
            <button type="submit">업로드</button>
            <button type="button" onClick={onClose}>
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
