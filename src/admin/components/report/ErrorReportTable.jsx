import React, { useEffect, useState } from "react";
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
  const sortableKeys = ["reportStatus", "created_dt"];
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  useEffect(() => {
    const loadReports = async () => {
      if (!accessToken) return;

      const data = await fetchLatestErrorReports(accessToken);
      console.log("\ud83d\udce6 \uc5d0\ub7ec \ub9ac\ud3ec\ud2b8 fetch \uacb0\uacfc:", data);
      const mappedData = data.map((r) => ({
        ...r,
        created_dt: r.createdDt,
      }));
      setReports(mappedData);
    };

    loadReports();
  }, [accessToken, setReports]);

  const formatDate = (dateString) => {
    if (!dateString) return "\ub0a0\uc9dc \uc5c6\uc74c";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "\ub0a0\uc9dc \ud615\uc2dd \uc624\ub958";

    return `\ud83d\uddd3\ufe0f ${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  };

  const toggleCategoryFilter = () => {
    setCategoryFilter((prev) =>
      prev === "ALL" ? "VALID" : prev === "VALID" ? "INVALID" : "ALL"
    );
  };

  const filteredReports = reports.filter((r) => {
    if (statusFilter && r.reportStatus !== statusFilter) return false;
    if (categoryFilter === "VALID" && r.reportCategory !== "VALID") return false;
    if (categoryFilter === "INVALID" && r.reportCategory !== "INVALID") return false;
    return true;
  });

  const sortedReports = enableSorting
    ? [...filteredReports].sort((a, b) => {
        if (!sortConfig?.key) return 0;
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (aVal === undefined || bVal === undefined) return 0;

        if (typeof aVal === "string") {
          return sortConfig.direction === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

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
            <button onClick={() => onPageChange(1, "")}>전체</button>
            <button onClick={() => onPageChange(1, "NOT_STARTED")}>시작 안함</button>
            <button onClick={() => onPageChange(1, "IN_PROGRESS")}>진행중</button>
            <button onClick={() => onPageChange(1, "COMPLETED")}>완료</button>
            <button onClick={() => onPageChange(1, "CANCELLED")}>취소</button>
            <button onClick={() => onPageChange(1, "ON_HOLD")}>보류</button>
          </div>
        )}
      </div>
      <table className="error-report-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th onClick={toggleCategoryFilter} style={{ cursor: 'pointer' }}>
              Category ({categoryFilter})
            </th>
            <th onClick={() => handleSort("reportStatus")}>Status {enableSorting && sortConfig.key === "reportStatus" && (sortConfig.direction === "asc" ? "▲" : "▼")}</th>
            <th onClick={() => handleSort("created_dt")}>Date {enableSorting && sortConfig.key === "created_dt" && (sortConfig.direction === "asc" ? "▲" : "▼")}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {paginatedReports.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.reportTitle}</td>
              <td>{row.reportCategory}</td>
              <td>
                <div className={`status ${row.reportStatus}`}>
                  {row.reportStatus}
                </div>
              </td>
              <td>{formatDate(row.created_dt)}</td>
              <td>
                <button
                  className="check-btn"
                  onClick={() => {
                    navigate(`/admin/error-report-detail/${row.id}`, {
                      state: { report: row },
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
