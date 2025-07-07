import React, { useState } from "react";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import ErrorReportTable from "../components/report/ErrorReportTable";
import ReportTrendChart from "../components/report/ReportTrendChart";
import "../styles/ErrorReportList.css";

const ErrorReportList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [statusFilter, setStatusFilter] = useState("");
  const [period, setPeriod] = useState("7");
  const [mode, setMode] = useState("리포트 관리");

  const reports = [
    { no: 1, name: '이도건', fileId: 121, created_dt: '🗓️ 2025.06.12', status: '처리' },
    { no: 2, name: '이도건', fileId: 15, created_dt: '🗓️ 2025.07.06', status: '진행 중' },
    { no: 3, name: '이도건', fileId: 5, created_dt: '🗓️ 2025.07.02', status: '처리' },
    { no: 4, name: '이도건', fileId: 11, created_dt: '🗓️ 2025.07.02', status: '미처리' },
    { no: 5, name: '이도건', fileId: 1, created_dt: '🗓️ 2025.06.25', status: '진행 중' },
    { no: 6, name: '이도건', fileId: 74, created_dt: '🗓️ 2025.07.04', status: '미처리' },
    { no: 7, name: '이도건', fileId: 2, created_dt: '🗓️ 2025.07.05', status: '미처리' },
  ];

  // 날짜 필터 로직
  const today = new Date();

  const filteredData = reports
    .filter(r => {
      const dateStr = r.created_dt.replace("🗓️ ", "");
      const reportDate = new Date(dateStr);
      if (period === "7") return today - reportDate <= 7 * 24 * 60 * 60 * 1000;
      if (period === "30") return today - reportDate <= 30 * 24 * 60 * 60 * 1000;
      return true;
    })
    .reduce((acc, r) => {
      const date = r.created_dt.replace("🗓️ ", "");
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

  const chartData = Object.entries(filteredData)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

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
              onClick={() => setStatusFilter("")}
            >
              전체
            </button>
            <button
              className={`status-filter-btn ${statusFilter === "미처리" ? "active" : ""}`}
              onClick={() => setStatusFilter("미처리")}
            >
              미처리
            </button>
            <button
              className={`status-filter-btn ${statusFilter === "진행 중" ? "active" : ""}`}
              onClick={() => setStatusFilter("진행 중")}
            >
              진행 중
            </button>
            <button
              className={`status-filter-btn ${statusFilter === "처리" ? "active" : ""}`}
              onClick={() => setStatusFilter("처리")}
            >
              처리
            </button>
          </div>

          <ErrorReportTable
            showSeeMore={false}
            usePagination={true}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            statusFilter={statusFilter}
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
  console.log("period 바뀌기 전:", period);
  setPeriod("30");

  console.log("period 바뀐 후:", period);
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