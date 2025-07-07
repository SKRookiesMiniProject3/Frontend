import React, { useState } from "react";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import ErrorReportTable from "../components/report/ErrorReportTable";
import ReportTrendChart from "../components/report/ReportTrendChart";
import "../styles/ErrorReportList.css";
import errorReportStore from "../stores/errorReportStore";

const statusLabelMap = {
  NOT_STARTED: "미처리",
  IN_PROGRESS: "진행 중",
  COMPLETED: "처리",
};

const ErrorReportList = () => {
  const reports = errorReportStore((state) => state.reports);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [statusFilter, setStatusFilter] = useState("");
  const [period, setPeriod] = useState("7");
  const [mode, setMode] = useState("리포트 관리");

  // 날짜 필터 로직
  const today = new Date();

  const filteredData = reports
    .filter(r => {
      const reportDate = new Date(r.created_dt);
      if (period === "7") return today - reportDate <= 7 * 24 * 60 * 60 * 1000;
      if (period === "30") return today - reportDate <= 30 * 24 * 60 * 60 * 1000;
      return true;
    })
    .filter(r => {
      if (!statusFilter) return true;
      return r.status === statusFilter;
    })
    .reduce((acc, r) => {
      const dateObj = new Date(r.created_dt);
      const dateStr = `${dateObj.getFullYear()}.${String(dateObj.getMonth() + 1).padStart(2, "0")}.${String(dateObj.getDate()).padStart(2, "0")}`;
      acc[dateStr] = (acc[dateStr] || 0) + 1;
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
            <button className={`status-filter-btn ${statusFilter === "" ? "active" : ""}`} onClick={() => setStatusFilter("")}>
              전체
            </button>
            {Object.entries(statusLabelMap).map(([key, label]) => (
              <button
                key={key}
                className={`status-filter-btn ${statusFilter === key ? "active" : ""}`}
                onClick={() => setStatusFilter(key)}
              >
                {label}
              </button>
            ))}
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