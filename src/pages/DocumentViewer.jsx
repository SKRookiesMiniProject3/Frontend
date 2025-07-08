import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import FilterTabs from '../components/FilterTabs';
import DocumentGrid from '../components/DocumentGrid';
import UploadModal from '../components/UploadModal';
import Pagination from '../components/Pagination';
import { fetchDocuments } from '../api/documents';
import { categoryNameToId } from '../constants/categoryMap';
import './DocumentViewer.css';

const modeMap = {
  "열람": "view",
  "수정": "edit",
  "등록": "upload"
};

const DocumentViewer = () => {
  const [documents, setDocuments] = useState([]);
  const [activeMode, setActiveMode] = useState("열람");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const documentsPerPage = 8;

  const totalPages = Math.ceil(documents.length / documentsPerPage);
  const paginatedDocs = documents.slice(
    (currentPage - 1) * documentsPerPage,
    currentPage * documentsPerPage
  );

  // ✅ 문서 불러오기 함수 분리
  const loadDocs = async () => {
    try {
      const categoryTypeId = categoryNameToId[selectedCategory];
      const result = await fetchDocuments({ categoryTypeId });
      console.log("📄 불러온 문서 리스트:", result);
      setDocuments(result);
    } catch (err) {
      console.error("문서 목록 불러오기 실패:", err);
    }
  };

  // ✅ 선택된 카테고리가 변경될 때 문서 불러오기
  useEffect(() => {
    loadDocs();
  }, [selectedCategory]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  useEffect(() => {
    if (activeMode === "등록") {
      setShowUploadModal(true);
    } else {
      setShowUploadModal(false);
    }
  }, [activeMode]);

  const handleCloseModal = () => {
    setShowUploadModal(false);
    setActiveMode("열람");
  };

  const handleUpload = ({ title, file, category }) => {
    console.log("업로드된 문서:", title, file, category);
    setShowUploadModal(false);
    setActiveMode("열람");
    setSelectedCategory("전체");
    loadDocs(); // 업로드 후 새로고침
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="viewer-container">
      <Header />
      <div className="main-content">
        <Sidebar
          activeMain={activeMode}
          onSelectMain={setActiveMode}
          activeCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <div className="content-area">
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <FilterTabs />

  {/* 🔄 새로고침 버튼 */}
  <button
    onClick={loadDocs}
    className="refresh-btn"
    title="문서 새로고침"
  >
    🔄
  </button>
</div>


          <DocumentGrid
            documents={paginatedDocs}
            mode={modeMap[activeMode] || "view"}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {showUploadModal && (
        <UploadModal onClose={handleCloseModal} onUpload={handleUpload} />
      )}
    </div>
  );
};

export default DocumentViewer;
