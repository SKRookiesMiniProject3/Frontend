import React from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '../ui/Pagination';
import './MemberListTable.css';
import useUserStore from '../../stores/userStore';

const MemberListTable = ({
  limit = null,
  showSeeMore = true,
  showCheck = true,
  usePagination = false,
  currentPage = 1,
  itemsPerPage = 7,
  searchTerm = "",
  onPageChange = () => {},
  enableSorting = true,
  sortConfig,
  setSortConfig,
}) => {
  const users = useUserStore((state) => state.users);
  const setUsers = useUserStore((state) => state.setUsers);
  const navigate = useNavigate();

  //직급 순서
  const rolePriority = {
    intern: 1,
    staff: 2,
    senior_staff: 3,
    assistant_manager: 4,
    manager: 5,
    senior_manager: 6,
    director: 7,
    vice_president: 8,
    president: 9,
    executive_vice_president: 10,
    ceo: 11,
  };

  //검색 필터 적용
  const filtered = users.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //정렬
  const sortedMembers = [...filtered].sort((a, b) => {
    if (!sortConfig.key) return 0;

    if (sortConfig.key === "role") {
      const aPriority = rolePriority[a.role.toLowerCase()] || 0;
      const bPriority = rolePriority[b.role.toLowerCase()] || 0;
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

  // limit, pagination 병행 처리
  const limited = limit ? sortedMembers.slice(0, limit) : sortedMembers;
  const paginated = usePagination
    ? limited.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : limited;

  const totalPages = Math.ceil(limited.length / itemsPerPage);

  const handleSort = (key) => {
    if (!enableSorting) return;
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleCheck = (id, checked) => {
    const updated = users.map((m) =>
      m.id === id ? { ...m, checked } : m
    );
    setUsers(updated);
  };

  return (
    <div className="member-list-container">
      <div className="table-header">
        <h2 className="table-title">Member List</h2>
        {/* AdminDashboard.jsx일 때만 See More 버튼 활성화 */}
        {showSeeMore && (
          <button className="see-more-btn" onClick={() => navigate('/admin/member-crud')}>
            See More
          </button>
        )}
      </div>
      {/* 회원 목록 테이블 */}
      <div className="member-table-wrapper">
      <table className="member-list-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("id")}>
              ID
              {enableSorting && (
                <span className={`sort-indicator ${sortConfig.key === "id" ? "sorted" : ""}`}>
                  {enableSorting && sortConfig.key === "id"
                    ? sortConfig.direction === "asc"
                      ? "▲"
                      : "▼"
                    : "▼"}
                </span>
              )}
            </th>
            <th onClick={() => handleSort("name")}>
              Name
              {enableSorting && (
                <span className={`sort-indicator ${sortConfig.key === "name" ? "sorted" : ""}`}>
                  {enableSorting && sortConfig.key === "name"
                    ? sortConfig.direction === "asc"
                      ? "▲"
                      : "▼"
                    : "▼"}
                </span>
              )}
            </th>
            <th onClick={() => handleSort("email")}>
              Email
              {enableSorting && (
                <span className={`sort-indicator ${sortConfig.key === "email" ? "sorted" : ""}`}>
                  {enableSorting && sortConfig.key === "email"
                    ? sortConfig.direction === "asc"
                      ? "▲"
                      : "▼"
                    : "▼"}
                </span>
              )}
            </th>
            <th onClick={() => handleSort("phone")}>
              Phone
              {enableSorting && (
                <span className={`sort-indicator ${sortConfig.key === "phone" ? "sorted" : ""}`}>
                  {enableSorting && sortConfig.key === "phone"
                    ? sortConfig.direction === "asc"
                      ? "▲"
                      : "▼"
                    : "▼"}
                </span>
              )}
            </th>
            <th onClick={() => handleSort("date")}>
              Date
              {enableSorting && (
                <span className={`sort-indicator ${sortConfig.key === "date" ? "sorted" : ""}`}>
                  {enableSorting && sortConfig.key === "date"
                    ? sortConfig.direction === "asc"
                      ? "▲"
                      : "▼"
                    : "▼"}
                </span>
              )}
            </th>
            <th onClick={() => handleSort("role")}>
              Role
              {enableSorting && (
                <span className={`sort-indicator ${sortConfig.key === "role" ? "sorted" : ""}`}>
                  {enableSorting && sortConfig.key === "role"
                    ? sortConfig.direction === "asc"
                      ? "▲"
                      : "▼"
                    : "▼"}
                </span>
              )}
            </th>
            <th>직급 설명</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((m) => (
            <tr key={m.id}>
              <td>
                {showCheck && (
                  <input
                    type="checkbox"
                    checked={m.checked || false}
                    onChange={(e) => handleCheck(m.id, e.target.checked)}
                  />
                )}
                {m.id}
              </td>
              <td>{m.name}</td>
              <td>{m.email}</td>
              <td>{m.phone}</td>
              <td>{m.date}</td>
              <td>
                <span className={`role-badge ${m.role.toLowerCase().replace(/_/g, "-")}`}>
                  {m.role}
                </span>
              </td>
              <td>{m.roleDescription}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* 페이지네이션 내부 배치 */}
      {usePagination && (
        <div className="pagination-wrapper">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
      </div>
    </div>
  );
};

export default MemberListTable;
