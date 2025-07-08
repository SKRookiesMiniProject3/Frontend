import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import FilterTabs from '../components/FilterTabs';
import DocumentGrid from '../components/DocumentGrid';
import UploadModal from '../components/UploadModal';
import Pagination from '../components/Pagination';
import './DocumentViewer.css';
import useAuthStore from "../stores/authStore";

const dummyDocuments = [
  { id: 1, title: 'R&D 계획서', date: '2024-06-01', locked: false },
  { id: 2, title: '재무 계획서', date: '2024-06-02', locked: true },
  { id: 3, title: '인사 평가 기준', date: '2024-06-03', locked: true },
  { id: 4, title: '제품 소개서', date: '2024-06-04', locked: false },
  { id: 5, title: '기술 로드맵', date: '2024-06-05', locked: true },
  { id: 6, title: '위기 대응 매뉴얼', date: '2024-06-06', locked: true },
  { id: 7, title: '고객 응대 매뉴얼', date: '2024-06-07', locked: false },
  { id: 8, title: '법률 문서', date: '2024-06-08', locked: true },
];

const DocumentViewer = () => {
  const [activeMode, setActiveMode] = useState("열람");
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [showMenu, setShowMenu] = useState(false);
  const { logout, user } = useAuthStore();
  console.log(user?.role);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const documentsPerPage = 4;

  const totalPages = Math.ceil(dummyDocuments.length / documentsPerPage);

  const paginatedDocs = dummyDocuments.slice(
    (currentPage - 1) * documentsPerPage,
    currentPage * documentsPerPage
  );

  // 등록 모드일 경우 모달 열기
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

  const handleUpload = ({ title, file }) => {
    console.log("업로드된 문서:", title, file);
    setShowUploadModal(false);
    setActiveMode("열람");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleAdminPage = () => {
    if (user?.role === "[CEO]") {
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
        <Sidebar selectedMode={activeMode} onSelectMode={setActiveMode} />
        <div className="content-area">
          <FilterTabs />
          <DocumentGrid documents={paginatedDocs} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
        {/* 로그아웃, 관리자 페이지 이동 */}
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
