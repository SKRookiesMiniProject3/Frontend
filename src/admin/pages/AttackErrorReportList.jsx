import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import "../styles/ErrorReportList.css";
import useAuthStore from "../../stores/authStore";
import AttackErrorReportTable from '../components/report/AttackErrorReportTable';

const AttackErrorReportList = () => {
  const { logout } = useAuthStore();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [mode, setMode] = useState("공격 리포트 관리");
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleMainPage = () => {
    navigate("/");
  };

  return (
    <div className="viewer-container">
      <Header />
      <div className="main-content">
        <Sidebar selectedMode={mode} onSelectMode={setMode} />
        <div className="content-area">
          <h2 className="page-title">🚨 공격 에러 리포트 관리</h2>

          <AttackErrorReportTable
            showSeeMore={false}
            usePagination={true}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
            statusFilter={""}
          />

          <div className="content-toolbar">
            <button className="menu-button" onClick={() => setShowMenu(!showMenu)}>⋮</button>
            {showMenu && (
              <div className="dropdown-menu">
                <button onClick={handleMainPage}>메인 페이지</button>
                <button onClick={handleLogout}>로그아웃</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttackErrorReportList;