import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import FilterTabs from '../components/FilterTabs';
import DocumentGrid from '../components/DocumentGrid';
import UploadModal from '../components/UploadModal';
import Pagination from '../components/Pagination';
import { fetchDocuments } from '../api/documents';
import './DocumentViewer.css';

const modeMap = {
  "열람": "view",
  "수정": "edit",
  "삭제": "delete",
  "등록": "upload",
};

const DocumentViewer = () => {
  const [documents, setDocuments] = useState([]);
  const [activeMode, setActiveMode] = useState("열람");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const documentsPerPage = 4;

  const totalPages = Math.ceil(documents.length / documentsPerPage);
  const paginatedDocs = documents.slice(
    (currentPage - 1) * documentsPerPage,
    currentPage * documentsPerPage
  );

  // 🔁 문서 불러오기
  useEffect(() => {
    const loadDocs = async () => {
      try {
        const result = await fetchDocuments(selectedCategory);
        setDocuments(result);
      } catch (err) {
        console.error("문서 목록 불러오기 실패:", err);
      }
    };

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
          <FilterTabs />

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
