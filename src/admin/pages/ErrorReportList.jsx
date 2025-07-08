import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import ErrorReportTable from "../components/report/ErrorReportTable";
import ReportTrendChart from "../components/report/ReportTrendChart";
import "../styles/ErrorReportList.css";
import useAuthStore from "../../stores/authStore";
import { fetchDailyErrorCounts } from "../api/errorReports";

const ErrorReportList = () => {
  const { accessToken } = useAuthStore();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [statusFilter, setStatusFilter] = useState("");
  const [period, setPeriod] = useState("7");
  const [mode, setMode] = useState("리포트 관리");

  const [showMenu, setShowMenu] = useState(false);
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const loadChartData = async () => {
      try {
        const raw = await fetchDailyErrorCounts(accessToken);
        const formatted = raw
          .map((d) => ({
            date: d.date.replace(/-/g, "."), // 예: 2025-07-08 → 2025.07.08
            count: d.count,
          }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        setChartData(formatted);
      } catch (error) {
        console.error("일별 에러 리포트 차트 데이터 불러오기 실패:", error);
      }
    };

    if (accessToken) loadChartData();
  }, [accessToken]);

  const resolvedFilterOptions = {
    true: "처리",
    false: "미처리",
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleMainPage = () => {
    navigate("/");
  };

  //새로 고침 버튼과 연동
  const handleReset = () => {
    setCurrentPage(1);
    setSortConfig({ key: null, direction: "asc" });
    setStatusFilter("");
    setPeriod("7");
  };

  return (
    <div className="viewer-container">
      <Header />
      <div className="main-content">
        <Sidebar selectedMode={mode} onSelectMode={setMode} />
        <div className="content-area">
          <h2 className="page-title">에러 리포트 관리</h2>

          {/* 상태 필터 버튼 */}
          <div className="status-filter-container">
            <button className={`status-filter-btn ${statusFilter === "" ? "active" : ""}`} onClick={() => setStatusFilter("")}>
              전체
            </button>
            {Object.entries(resolvedFilterOptions).map(([key, label]) => (
              <button
                key={key}
                className={`status-filter-btn ${statusFilter === key ? "active" : ""}`}
                onClick={() => setStatusFilter(key)}
              >
                {label}
              </button>
            ))}
            {/* 새로고침 버튼 추가 */}
            <div className="reset-button-container">
              <button className="reset-btn" onClick={handleReset}>🔄 새로고침</button>
            </div>
          </div>

          <ErrorReportTable
            showSeeMore={false}
            usePagination={true}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            statusFilter={statusFilter}
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
          />

          {/* 차트 필터 */}
          <div className="filter-buttons">
            <button
              className={`filter-btn ${period === "7" ? "active" : ""}`}
              onClick={() => setPeriod("7")}
            >
              최근 7일
            </button>
            <button
              className={`filter-btn ${period === "30" ? "active" : ""}`}
              onClick={() => {
              setPeriod("30");
            }}
            >
              최근 30일
            </button>
            <button
              className={`filter-btn ${period === "all" ? "active" : ""}`}
              onClick={() => setPeriod("all")}
            >
              전체
            </button>
          </div>

          {/* 로그아웃, 메인 페이지 이동 */}
          <div className="content-toolbar">
          <button className="menu-button" onClick={() => setShowMenu(!showMenu)}>⋮</button>
          {showMenu && (
            <div className="dropdown-menu">
              <button onClick={handleMainPage}>메인 페이지</button>
              <button onClick={handleLogout}>로그아웃</button>
            </div>
          )}
          </div>
          {/* 차트 */}
          <div className="chart-container">
            <h3>에러 리포트 일별 합계</h3>
            <ReportTrendChart data={chartData} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default ErrorReportList;