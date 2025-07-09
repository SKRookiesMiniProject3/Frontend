// src/pages/DocumentViewer.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import FilterTabs from '../components/FilterControls';
import DocumentGrid from '../components/DocumentGrid';
import UploadModal from '../components/UploadModal';
import Pagination from '../components/Pagination';
import { fetchDocuments } from '../api/documents';
import { categoryNameToId } from '../constants/categoryMap';
import './DocumentViewer.css';
import useAuthStore from "../stores/authStore";

const modeMap = {
  "열람": "view",
  "등록": "upload"
};

const DocumentViewer = () => {
  const [documents, setDocuments] = useState([]);
  const [activeMode, setActiveMode] = useState("열람");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const documentsPerPage = 8;

 
  const sortedDocs = [...documents].sort((a, b) => b.id - a.id);

  const totalPages = Math.ceil(sortedDocs.length / documentsPerPage);
  const paginatedDocs = sortedDocs.slice(
    (currentPage - 1) * documentsPerPage,
    currentPage * documentsPerPage
  );

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

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleAdminPage = () => {
    if (user?.role === "CEO") {
      navigate("/admin");
    } else {
      alert("관리자만 접근할 수 있습니다.");
      window.location.reload();
    }
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
            <button onClick={loadDocs} className="refresh-btn" title="문서 새로고침">🔄</button>
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

        <div className="content-toolbar">
          <button className="menu-button" onClick={() => setShowMenu(!showMenu)}>⋮</button>
          {showMenu && (
            <div className="dropdown-menu">
              <button onClick={handleAdminPage}>관리자 페이지</button>
              <button onClick={handleLogout}>로그아웃</button>
            </div>
          )}
        </div>
      </div>

      {showUploadModal && (
        <UploadModal onClose={handleCloseModal} onUpload={handleUpload} />
      )}
    </div>
  );
};

export default DocumentViewer;
