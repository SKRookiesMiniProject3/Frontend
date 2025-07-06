import React, { useState } from "react";
import styles from "./UploadModal.module.css";

const UploadModal = ({ onClose, onUpload }) => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("사업계획서");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !file) {
      alert("제목과 파일을 모두 입력해주세요.");
      return;
    }
    onUpload({ title, file, category });
    onClose();
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <h2 className={styles.title}>문서 등록</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>
            문서명
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
              placeholder="문서 제목을 입력하세요"
              required
            />
          </label>

          <label className={styles.label}>
            파일 업로드
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className={styles.input}
              required
            />
          </label>

          <label className={styles.label}>
            보고서 종류
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={styles.select}
            >
              <option value="사업계획서">사업계획서</option>
              <option value="R&D 계획서">R&D 계획서</option>
              <option value="실적보고서">실적보고서</option>
              <option value="재무계획서">재무계획서</option>
              <option value="제품소개서">제품소개서</option>
            </select>
          </label>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.uploadBtn}>업로드</button>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>취소</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
