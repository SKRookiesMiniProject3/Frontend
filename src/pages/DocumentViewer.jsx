import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import FilterControls from '../components/FilterControls';
import DocumentGrid from '../components/DocumentGrid';
import UploadModal from '../components/UploadModal';
import Pagination from '../components/Pagination';
import { fetchDocuments } from '../api/documents';
import { categoryNameToId } from '../constants/categoryMap';
import './DocumentViewer.css';
import useAuthStore from "../stores/authStore";

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
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [showMenu, setShowMenu] = useState(false);
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const documentsPerPage = 8;

  const totalPages = Math.ceil(documents.length / documentsPerPage);
  const paginatedDocs = documents.slice(
    (currentPage - 1) * documentsPerPage,
    currentPage * documentsPerPage
  );

  const loadDocs = async () => {
    try {
      const categoryTypeId = categoryNameToId[selectedCategory];
      const result = await fetchDocuments({
        categoryTypeId,
        startDate: startDate?.toISOString().split('T')[0],
        endDate: endDate?.toISOString().split('T')[0]
      });
      console.log("\ud30c\uc77c \ubc1c\uacac:", result);
      setDocuments(result);
    } catch (err) {
      console.error("\ubb38\uc11c \ubaa9\ub85d \ubd88\ub7ec\uc624\uae30 \uc2e4\ud328:", err);
    }
  };

  useEffect(() => {
    loadDocs();
  }, [selectedCategory, startDate, endDate]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  useEffect(() => {
    if (activeMode === "\ub4f1\ub85d") {
      setShowUploadModal(true);
    } else {
      setShowUploadModal(false);
    }
  }, [activeMode]);

  const handleCloseModal = () => {
    setShowUploadModal(false);
    setActiveMode("\uc5f4\ub7ad");
  };

  const handleUpload = ({ title, file, category }) => {
    console.log("\uc5c5\ub85c\ub4dc\ub41c \ubb38\uc11c:", title, file, category);
    setShowUploadModal(false);
    setActiveMode("\uc5f4\ub7ad");
    setSelectedCategory("\uc804\uccb4");
    loadDocs();
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
      alert("\uad00\ub9ac\uc790\ub9cc \uc811\uadfc\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.");
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
            <FilterControls
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
            />

            {/* <button
              onClick={loadDocs}
              className="refresh-btn"
               title="문서 새로고침"
            >
              🔄
            </button> */}
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
