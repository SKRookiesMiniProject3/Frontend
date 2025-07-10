import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import "../styles/ErrorReportList.css";
import useAuthStore from "../../stores/authStore";
import errorReportStore from "../stores/errorReportStore";
import AttackErrorReportTable from '../components/report/AttackErrorReportTable';
import { fetchAttackErrorReports, fetchReportsByDateRange } from "../api/errorReports";
import FilterControls from "../../components/FilterControls";
import AttackErrorReportChart from "../components/report/AttackErrorReportChart";


const AttackErrorReportList = () => {
  const { accessToken, logout } = useAuthStore();
  const { setReports } = errorReportStore();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [mode, setMode] = useState("공격 리포트 관리");
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [, setPeriod] = useState("all");

  const statusFilterOptions = {
    NOT_STARTED: "시작 안함",
    IN_PROGRESS: "진행중",
    COMPLETED: "완료",
  };

  const handleStatusFilter = (page, status) => {
    setStatusFilter(status);
    setCurrentPage(page);
  };

  const handleReset = async () => {
    setCurrentPage(1);
    setSortConfig({ key: null, direction: "asc" });
    setStatusFilter("");
    setStartDate("");
    setEndDate("");
    setPeriod("all");

    const data = await fetchAttackErrorReports(accessToken);
    const mapped = data
      .map((r) => ({ ...r, created_dt: r.createdDt }))
      .filter((r) => r.reportCategory === "ATTACK");

    setReports(mapped);
  };

  const handleDateFilter = async () => {
    if (!startDate || !endDate) {
      alert("시작일과 종료일을 모두 선택해주세요.");
      return;
    }

    const data = await fetchReportsByDateRange(startDate, endDate, accessToken);
    setReports(
      data
        .map((r) => ({ ...r, created_dt: r.createdDt }))
        .filter((r) => r.reportCategory === "ATTACK")
    );
    setCurrentPage(1);
    setPeriod("custom");
  };

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

          <div className="status-filter-container">
            <button
              className={`status-filter-btn ${statusFilter === "" ? "active" : ""}`}
              onClick={() => handleStatusFilter(1, "")}
            >
              전체
            </button>
            {Object.entries(statusFilterOptions).map(([key, label]) => (
              <button
                key={key}
                className={`status-filter-btn ${statusFilter === key ? "active" : ""}`}
                onClick={() => handleStatusFilter(1, key)}
              >
                {label}
              </button>
            ))}
            <div className="reset-button-container">
              <button className="reset-btn" onClick={handleReset}>🔄 새로고침</button>
            </div>
          </div>

          <div className="date-filter-container">
            <FilterControls
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
            />
            <button className="date-search-btn" onClick={handleDateFilter}>
              📅 선택기간 조회
            </button>
          </div>

          <AttackErrorReportTable
            showSeeMore={false}
            usePagination={true}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
            statusFilter={statusFilter}
            onSortReset={handleReset}
          />

          <div className="chart-wrapper">
            <AttackErrorReportChart />
          </div>

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