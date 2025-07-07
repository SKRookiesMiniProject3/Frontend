import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '../ui/Pagination';
import './ErrorReportTable.css';

const ErrorReportTable = ({ showSeeMore, usePagination = false, currentPage = 1, itemsPerPage = 5, onPageChange = () => {}, limit, statusFilter = "", enableStatusFilter = false,}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const navigate = useNavigate();

  const reports = [
    { no: 1, name: '이도건', fileId: 121, created_dt: '🗓️ 2025.07.01', status: '처리' },
    { no: 2, name: '이도건', fileId: 15, created_dt: '🗓️ 2025.07.03', status: '진행 중' },
    { no: 3, name: '이도건', fileId: 5, created_dt: '🗓️ 2025.07.02', status: '처리' },
    { no: 4, name: '이도건', fileId: 11, created_dt: '🗓️ 2025.07.02', status: '미처리' },
    { no: 5, name: '이도건', fileId: 1, created_dt: '🗓️ 2025.07.01', status: '진행 중' },
    { no: 6, name: '이도건', fileId: 74, created_dt: '🗓️ 2025.07.04', status: '미처리' },
    { no: 7, name: '이도건', fileId: 2, created_dt: '🗓️ 2025.07.05', status: '미처리' },
  ];

  //에러 리포트 status
  const statusPriority = {
    "처리": 1,
    "진행 중": 2,
    "미처리": 3,
  };

  const statusMap = {
    "미처리": "NOT_STARTED",
    "진행 중": "IN_PROGRESS",
    "처리": "COMPLETED",
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
            <th onClick={() => handleSort("no")}>
              No
              <span className={`sort-indicator ${sortConfig.key === "no" ? "sorted" : ""}`}>
                {sortConfig.key === "no"
                  ? sortConfig.direction === "asc"
                    ? "▲"
                    : "▼"
                  : "▼"}
              </span>
            </th>
            <th onClick={() => handleSort("name")}>
              Member Name
              <span className={`sort-indicator ${sortConfig.key === "name" ? "sorted" : ""}`}>
                {sortConfig.key === "name"
                  ? sortConfig.direction === "asc"
                    ? "▲"
                    : "▼"
                  : "▼"}
              </span>
            </th>
            <th onClick={() => handleSort("fileId")}>
              File ID
              <span className={`sort-indicator ${sortConfig.key === "fileId" ? "sorted" : ""}`}>
                {sortConfig.key === "fileId"
                  ? sortConfig.direction === "asc"
                    ? "▲"
                    : "▼"
                  : "▼"}
              </span>
            </th>
            <th onClick={() => handleSort("created_dt")}>
              Date
              <span className={`sort-indicator ${sortConfig.key === "created_dt" ? "sorted" : ""}`}>
                {sortConfig.key === "created_dt"
                  ? sortConfig.direction === "asc"
                    ? "▲"
                    : "▼"
                  : "▼"}
              </span>
            </th>
            <th onClick={() => handleSort("status")}>
              Report Status
              <span className={`sort-indicator ${sortConfig.key === "status" ? "sorted" : ""}`}>
                {sortConfig.key === "status"
                  ? sortConfig.direction === "asc"
                    ? "▲"
                    : "▼"
                  : "▼"}
              </span>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {paginatedReports.map((row) => (
            <tr key={`${row.no}-${row.fileId}-${row.status}`}>
              <td>{row.no}</td>
              <td>{row.name}</td>
              <td>{row.fileId}</td>
              <td>{row.created_dt}</td>
              <td>
                <span className={`status ${getStatusClass(row.status)}`}>
                  {row.status}
                </span>
              </td>
              <td>
                 <button
                  className="check-btn"
                  onClick={() => {
                    navigate('/admin/error-report-detail', {
                      state: {
                        report: {
                          id: row.no,
                          fileId: row.fileId,
                          name: row.name,
                          created_dt: row.created_dt,
                          status: statusMap[row.status] || "NOT_STARTED",
                          comment: "",
                          is_deleted: false,
                        },
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
