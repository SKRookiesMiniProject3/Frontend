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
  "등록": "upload"
};

const DocumentViewer = () => {
  const [documents, setDocuments] = useState([]);
  const [activeMode, setActiveMode] = useState("열람");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [sortOrder, setSortOrder] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAdminPage, setIsAdminPage] = useState(false);

  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const documentsPerPage = 10;

  const sortedDocs = [...documents].sort((a, b) => {
    return sortOrder === 'latest' ? b.id - a.id : a.id - b.id;
  });

  const totalPages = Math.ceil(sortedDocs.length / documentsPerPage);
  const paginatedDocs = sortedDocs.slice(
    (currentPage - 1) * documentsPerPage,
    currentPage * documentsPerPage
  );

  // 문서 리스트를 API에서 불러오는 함수
  const loadDocs = async () => {
    try {
      const categoryTypeId = categoryNameToId[selectedCategory];
      const result = await fetchDocuments({
        categoryTypeId,
        startDate: startDate ? startDate.toISOString().split('T')[0] : undefined,
        endDate: endDate ? endDate.toISOString().split('T')[0] : undefined
      });
      setDocuments(result);
    } catch (err) {}
  };

  useEffect(() => {
    loadDocs();
  }, [selectedCategory, startDate, endDate]);

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

  // 업로드 모달 닫기 핸들러
  const handleCloseModal = () => {
    setShowUploadModal(false);
    setActiveMode("열람");
  };

  // 문서 업로드 후 상태 초기화 및 문서 재조회
  const handleUpload = ({ title, file, category }) => {
    setShowUploadModal(false);
    setActiveMode("열람");
    setSelectedCategory("전체");
    loadDocs();
  };

  // 페이지 번호 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 관리자 페이지로 전환하거나 일반 페이지로 돌아가는 함수
  const handleToggleAdminPage = () => {
    if (user?.role === "CEO") {
      if (!isAdminPage) {
        navigate("/admin");
      } else {
        navigate("/");
      }
      setIsAdminPage(!isAdminPage);
    } else {
      alert("관리자만 접근할 수 있습니다.");
      window.location.reload();
    }
  };

  return (
    <div className="viewer-container">
      <Header
        onNavigateAdminPage={handleToggleAdminPage}
        isAdminPage={isAdminPage}
      />

      <div className="main-content">
        <Sidebar
          activeMain={activeMode}
          onSelectMain={setActiveMode}
          activeCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onLogout={() => {
            logout();
            navigate("/");
          }}
        />

        <div className="content-area">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <FilterControls
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
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
