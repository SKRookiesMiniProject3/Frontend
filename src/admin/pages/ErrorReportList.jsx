import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import ErrorReportTable from "../components/report/ErrorReportTable";
import ReportTrendChart from "../components/report/ReportTrendChart";
import "../styles/ErrorReportList.css";
import useAuthStore from "../../stores/authStore";
import { fetchDailyErrorCounts, fetchReportsByStatus, fetchLatestErrorReports, fetchReportsByDateRange } from "../api/errorReports";
import errorReportStore from "../stores/errorReportStore";
import FilterControls from "../../components/FilterControls";

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
  const { setReports } = errorReportStore();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const loadChartData = async () => {
      try {
        const raw = await fetchDailyErrorCounts(accessToken, period);

        const sorted = raw
          .map((d) => {
            const rawDate = new Date(d.date);
            return {
              date: formatToMonthDay(d.date),
              rawDate,
              count: d.count,
            };
          })
          .sort((a, b) => a.rawDate - b.rawDate);

        const today = new Date();
        let filtered = [...sorted];

        if (period === "7") {
          const sevenDaysAgo = new Date(today);
          sevenDaysAgo.setDate(today.getDate() - 6);
          filtered = sorted.filter((d) => d.rawDate >= sevenDaysAgo);
        } else if (period === "30") {
          const thirtyDaysAgo = new Date(today);
          thirtyDaysAgo.setDate(today.getDate() - 29);
          filtered = sorted.filter((d) => d.rawDate >= thirtyDaysAgo);
        }

        setChartData(
          filtered.map(({ date, count }) => ({
            date,
            count,
          }))
        );
      } catch (error) {
        console.error("일별 에러 리포트 차트 데이터 불러오기 실패:", error);
      }
    };

    if (accessToken) loadChartData();
  }, [accessToken, period]);

  const formatToMonthDay = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}/${day}`;
  };

  const statusFilterOptions = {
    "NOT_STARTED": "시작 안함",
    "IN_PROGRESS": "진행중",
    "COMPLETED": "완료"
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleMainPage = () => {
    navigate("/");
  };

  //새로 고침 버튼과 연동
  const handleReset = async () => {
    setCurrentPage(1);
    setSortConfig({ key: null, direction: "asc" });
    setStatusFilter("");
    setPeriod("7");

    const data = await fetchLatestErrorReports(accessToken);
    const mapped = data.map((r) => ({
      ...r,
      created_dt: r.createdDt,
    }));
    setReports(mapped);
  };


  const handleStatusFilter = async (page, status) => {
    setCurrentPage(page);
    setStatusFilter(status); // UI 필터 상태 유지

    let data;
    if (status) {
      data = await fetchReportsByStatus(status, accessToken);
    } else {
      data = await fetchLatestErrorReports(accessToken); // 전체 조회
    }

    const mapped = data.map((r) => ({
      ...r,
      created_dt: r.createdDt,
    }));

    setReports(mapped);
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
          {/* 날짜 필터 */}
          <div className="date-filter-container">
            <FilterControls
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
            />
            <button
              className="date-search-btn"
              onClick={async () => {
                if (!startDate || !endDate) {
                  alert("시작일과 종료일을 모두 선택해주세요.");
                  return;
                }

                const data = await fetchReportsByDateRange(startDate, endDate, accessToken);
                const mapped = data.map((r) => ({
                  ...r,
                  created_dt: r.createdDt,
                }));
                setReports(mapped);
                setCurrentPage(1);
                setPeriod("custom");
              }}
            >
              📅 선택기간 조회
            </button>
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