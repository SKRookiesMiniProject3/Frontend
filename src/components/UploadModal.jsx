import React, { useState } from "react";
import styles from "./UploadModal.module.css";
import { uploadDocument } from "../api/documents";
import useAuthStore from "../stores/authStore";
import { roleOptions } from "../constants/roleMap"; 

const UploadModal = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryTypeId, setCategoryTypeId] = useState("1");
  const [readRoleId, setReadRoleId] = useState("1");
//   const [writeRoleId, setWriteRoleId] = useState("2");
//   const [deleteRoleId, setDeleteRoleId] = useState("3");
  const [file, setFile] = useState(null);

  const accessToken = useAuthStore((state) => state.accessToken);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("파일을 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("categoryTypeId", categoryTypeId);
    formData.append("readRoleId", readRoleId);
    // formData.append("writeRoleId", writeRoleId);
    // formData.append("deleteRoleId", deleteRoleId);

    try {
      await uploadDocument(formData, accessToken);
      onClose();
    } catch (error) {
      console.error("업로드 실패:", error);
      alert("문서 업로드에 실패했습니다.");
    }
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h2 className={styles.title}>문서 등록</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>
            제목
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>

          <label>
            내용 (선택)
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
            />
          </label>

          <label>
            파일 업로드
            <input
              type="file"
              accept=".pdf,.doc,.docx,.hwp"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </label>

          <label>
            보고서 종류
            <select
              value={categoryTypeId}
              onChange={(e) => setCategoryTypeId(e.target.value)}
              required
            >
              <option value="1">사업계획서</option>
              <option value="2">R&D 계획서</option>
              <option value="3">실적보고서</option>
              <option value="4">재무계획서</option>
              <option value="5">제품소개서</option>
            </select>
          </label>

          <div className={styles.roleGroup}>
            <label>
            읽기 권한
            <select value={readRoleId} onChange={(e) => setReadRoleId(e.target.value)}>
                {roleOptions.map((role) => (
                <option key={role.id} value={role.id}>
                    {role.label}
                </option>
                ))}
            </select>
            </label>
{/* 
            <label>
            쓰기 권한
            <select value={writeRoleId} onChange={(e) => setWriteRoleId(e.target.value)}>
                {roleOptions.map((role) => (
                <option key={role.id} value={role.id}>
                    {role.label}
                </option>
                ))}
            </select>
            </label> */}
{/* 
            <label>
            삭제 권한
            <select value={deleteRoleId} onChange={(e) => setDeleteRoleId(e.target.value)}>
                {roleOptions.map((role) => (
                <option key={role.id} value={role.id}>
                    {role.label}
                </option>
                ))}
            </select>
            </label> */}
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.uploadBtn}>
              업로드
            </button>
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
