import React from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '../ui/Pagination';
import './ErrorReportTable.css';
import errorReportStore from "../../stores/errorReportStore";

const ErrorReportTable = ({ 
  showSeeMore, 
  usePagination = false, 
  currentPage = 1, 
  itemsPerPage = 5, 
  onPageChange = () => {}, 
  limit, 
  statusFilter = "", 
  enableStatusFilter = false,
  enableSorting = true,
  sortConfig,
  setSortConfig,
}) => {
  const reports = errorReportStore((state) => state.reports);
  const navigate = useNavigate();

  //에러 리포트 status
  const statusPriority = {
    "처리": 1,
    "진행 중": 2,
    "미처리": 3,
  };

  const getStatusClass = (status) => {
    switch (status) {
      case '처리':
        return 'completed';
      case '진행 중':
        return 'inprogress';
      case '미처리':
        return 'unprocessed';
      default:
        return '';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `🗓️ ${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  };

  //에러 리포트 정렬
  const sortedReports = [...reports].sort((a, b) => {
    if (!sortConfig.key) return 0;

    if (sortConfig.key === "status") {
      const aPriority = statusPriority[a.status] || 0;
      const bPriority = statusPriority[b.status] || 0;
      return sortConfig.direction === "asc"
        ? aPriority - bPriority
        : bPriority - aPriority;
    }

    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];

    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // 에러 리포트 상태 필터링
  const filteredReports = statusFilter
  ? sortedReports.filter((r) => r.status === statusFilter)
  : sortedReports;

  const limitedReports = limit ? filteredReports.slice(0, limit) : filteredReports;

  const paginatedReports = usePagination
    ? limitedReports.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : limitedReports;

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

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
            <button onClick={() => onPageChange(1, "진행 중")}>진행 중</button>
            <button onClick={() => onPageChange(1, "처리")}>처리 완료</button>
          </div>
        )}
      </div>
      <table className="error-report-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("id")}>
              No
              {enableSorting && (
                <span className={`sort-indicator ${sortConfig.key === "id" ? "sorted" : ""}`}>
                  {enableSorting && sortConfig.key === "id"
                    ? sortConfig.direction === "asc" ? "▲" : "▼"
                    : "▼"}
                </span>
              )}
            </th>
            <th onClick={() => handleSort("memberId")}>
              Member ID
              {enableSorting && (
                <span className={`sort-indicator ${sortConfig.key === "memberId" ? "sorted" : ""}`}>
                  {enableSorting && sortConfig.key === "memberId"
                    ? sortConfig.direction === "asc" ? "▲" : "▼"
                    : "▼"}
                </span>
              )}
            </th>
            <th onClick={() => handleSort("fileId")}>
              File ID
              {enableSorting && (
                <span className={`sort-indicator ${sortConfig.key === "fileId" ? "sorted" : ""}`}>
                  {enableSorting && sortConfig.key === "fileId"
                    ? sortConfig.direction === "asc" ? "▲" : "▼"
                    : "▼"}
                </span>
              )}
            </th>
            <th onClick={() => handleSort("created_dt")}>
              Date
              {enableSorting && (
                <span className={`sort-indicator ${sortConfig.key === "created_dt" ? "sorted" : ""}`}>
                  {enableSorting && sortConfig.key === "created_dt"
                    ? sortConfig.direction === "asc" ? "▲" : "▼"
                    : "▼"}
                </span>
              )}
            </th>
            <th onClick={() => handleSort("status")}>
              Report Status
              {enableSorting && (
                <span className={`sort-indicator ${sortConfig.key === "status" ? "sorted" : ""}`}>
                  {enableSorting && sortConfig.key === "status"
                    ? sortConfig.direction === "asc" ? "▲" : "▼"
                    : "▼"}
                </span>
              )}
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {paginatedReports.map((row) => (
            <tr key={`${row.id}-${row.fileId}`}>
              <td>{row.id}</td>
              <td>{row.fileId}</td>
              <td>{row.memberId ?? "Unknown"}</td>
              <td>{formatDate(row.created_dt)}</td>
              <td>
                <span className={`status ${getStatusClass((row.status))}`}>
                  {(row.status)}
                </span>
              </td>
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
