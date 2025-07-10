import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Pagination from '../ui/Pagination';
import './ErrorReportTable.css';
import errorReportStore from "../../stores/errorReportStore";
import useAuthStore from "../../../stores/authStore";
import { fetchAttackErrorReports } from "../../api/errorReports";

const AttackErrorReportTable = ({ 
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

      const data = await fetchAttackErrorReports(accessToken);
      const mappedData = data
        .filter((r) => r.reportCategory === "ATTACK")
        .map((r) => ({
          ...r,
          created_dt: r.createdDt,
        }));
      setReports(mappedData);
    };

    loadReports();
  }, [accessToken, setReports]);

  const formatDate = (dateString) => {
    if (!dateString) return "날짜 없음";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "날짜 형식 오류";
    return `📅 ${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  };

  const filteredReports = reports.filter((r) => {
    if (statusFilter && r.reportStatus !== statusFilter) return false;
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
        <h2 className="table-title">Attack Error Reports</h2>
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
          </div>
        )}
      </div>
      <table className="error-report-table">
        <thead>
          <tr>
            <th style={{ width: "6%" }}>ID</th>
            <th style={{ width: "32%" }}>Title</th>
            <th>Category</th>
            <th onClick={() => handleSort("reportStatus")}>Status {enableSorting && sortConfig.key === "reportStatus" && (sortConfig.direction === "asc" ? "▲" : "▼")}</th>
            <th onClick={() => handleSort("created_dt")}>Date {enableSorting && sortConfig.key === "created_dt" && (sortConfig.direction === "asc" ? "▲" : "▼")}</th>
            <th style={{ width: "10%" }}></th>
          </tr>
        </thead>
        <tbody>
          {paginatedReports.map((row) => (
            <tr
              key={row.id}
              onClick={() => {
                navigate(`/admin/error-report-detail/${row.id}`, {
                  state: { report: row },
                });
              }}
              className="clickable-row"
            >
              <td>{row.id}</td>
              <td>{row.reportTitle}</td>
              <td>{row.reportCategory}</td>
              <td>
                <div className={`status ${row.reportStatus}`}>
                  {row.reportStatus}
                </div>
              </td>
              <td>{formatDate(row.created_dt)}</td>
              <td></td>
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

export default AttackErrorReportTable;
