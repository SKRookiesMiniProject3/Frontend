import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Pagination from '../ui/Pagination';
import './ErrorReportTable.css';
import errorReportStore from "../../stores/errorReportStore";
import useAuthStore from "../../../stores/authStore";
import { fetchLatestErrorReports } from "../../api/errorReports";

const ErrorReportTable = ({ 
  showSeeMore, 
  usePagination = false, 
  currentPage = 1, 
  itemsPerPage = 7, 
  onPageChange = () => {}, 
  limit, 
  statusFilter = "", 
  enableStatusFilter = false,
  enableSorting = true,
  sortConfig,
  setSortConfig,
}) => {
  const { accessToken } = useAuthStore();
  const { reports, setReports } = errorReportStore();
  const navigate = useNavigate();

  useEffect(() => {
    const loadReports = async () => {
      if (!accessToken) return;

      const data = await fetchLatestErrorReports(accessToken);
      const mappedData = data.map((r) => ({
        ...r,
        created_dt: r.createdAt,
      }));
      setReports(mappedData);
    };

    loadReports();
  }, [accessToken, setReports]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `🗓️ ${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  };

  // 에러 리포트 상태 필터링
  const filteredReports = statusFilter
    ? reports.filter((r) => String(r.resolved) === statusFilter)
    : reports;

  //에러 리포트 정렬
  const sortedReports = enableSorting
    ? [...filteredReports].sort((a, b) => {
        if (!sortConfig?.key) return 0;
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      })
    : filteredReports;

  const limitedReports = limit ? sortedReports.slice(0, limit) : sortedReports;

  const paginatedReports = usePagination
    ? limitedReports.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : limitedReports;

  const totalPages = Math.ceil(limitedReports.length / itemsPerPage);

  const handleSort = (key) => {
    if (!enableSorting) return;
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <div className="error-report-container">
      <div className="table-header">
        <h2 className="table-title">Error Report List</h2>
        {showSeeMore && (
          <button className="see-more-btn" onClick={() => navigate('/admin/error-report')}>
            See More
          </button>
        )}
        {enableStatusFilter && (
          <div className="status-filter">
            <button onClick={() => onPageChange(1)}>전체</button>
            <button onClick={() => onPageChange(1, "미처리")}>미처리</button>
            <button onClick={() => onPageChange(1, "처리")}>처리 완료</button>
          </div>
        )}
      </div>
      <table className="error-report-table">
        <thead>
          <tr>
            {["id", "message", "created_dt", "resolved"].map((key) => (
              <th key={key} onClick={() => handleSort(key)}>
                {key === "created_dt" ? "Date" : key.charAt(0).toUpperCase() + key.slice(1)}
                {enableSorting && (
                  <span className={`sort-indicator ${sortConfig.key === key ? "sorted" : ""}`}>
                    {sortConfig.key === key
                      ? sortConfig.direction === "asc"
                        ? "▲"
                        : "▼"
                      : "▼"}
                  </span>
                )}
              </th>
            ))}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {paginatedReports.map((row) => (
            <tr key={`${row.id}`}>
              <td>{row.id}</td>
              <td>{row.message}</td>
              <td>{formatDate(row.created_dt)}</td>
              <td>{row.resolved ? "✅" : "❌"}</td>
              <td>
                <button
                  className="check-btn"
                  onClick={() => {
                    navigate('/admin/error-report-detail', {
                      state: {
                        report: row,
                      },
                    });
                  }}
                >
                  확인
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {usePagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default ErrorReportTable;
