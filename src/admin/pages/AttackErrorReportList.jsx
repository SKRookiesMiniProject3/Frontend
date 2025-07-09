import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import ErrorReportTable from "../components/report/ErrorReportTable";
import "../styles/ErrorReportList.css";
import useAuthStore from "../../stores/authStore";
import { fetchAttackErrorReports } from "../api/errorReports";
import errorReportStore from "../stores/errorReportStore";

const AttackErrorReportList = () => {
  const { accessToken, logout } = useAuthStore();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [mode, setMode] = useState("공격 리포트 관리");
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const { reports, setReports } = errorReportStore();

  // 데이터 필터링 함수 (ATTACK만)
  const mapAndFilterAttackReports = (data) => {
    return data
      .map((r) => ({ ...r, created_dt: r.createdDt }))
      .filter((r) => r.reportCategory === "ATTACK");
  };

  // 초기 로딩
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchAttackErrorReports(accessToken);
      setReports(mapAndFilterAttackReports(data));
    };
    if (accessToken) loadData();
  }, [accessToken, setReports]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleMainPage = () => {
    navigate("/");
  };

  const filteredReports = reports.filter((r) => r.reportCategory === "ATTACK");

  return (
    <div className="viewer-container">
      <Header />
      <div className="main-content">
        <Sidebar selectedMode={mode} onSelectMode={setMode} />
        <div className="content-area">
          <h2 className="page-title">🚨 공격 에러 리포트 관리</h2>

          <ErrorReportTable
            reports={filteredReports}
            showSeeMore={false}
            usePagination={true}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            statusFilter={""}
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
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
