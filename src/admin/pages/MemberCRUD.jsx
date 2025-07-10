import React, { useState, useEffect }  from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUsers } from '../api/users';

import useUserStore from '../stores/userStore';
import useAuthStore from "../../stores/authStore";

import MemberListTable from '../components/member/MemberListTable';

import Header from '../../components/Header'; // ✅ 공통 Header로 변경
import Sidebar from '../components/layout/Sidebar';
import MemberListToolbar from '../components/member/MemberListToolbar';
import MemberViewForm from "../components/member/MemberViewForm";

const MemberCRUD = () => {
  const users = useUserStore((state) => state.users);
  const setUsers = useUserStore((state) => state.setUsers);

  const { accessToken, logout } = useAuthStore();
  const navigate = useNavigate();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [mode, setMode] = useState("회원관리");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  //회원 정보
  useEffect(() => {
    if (!accessToken) return;

    fetchUsers(accessToken).then((fetchedUsers) => {
      const formatted = fetchedUsers.map((u) => ({
        id: u.id,
        name: u.username,
        email: `📧 ${u.email}`,
        phone: u.phone,
        date: u.createdAt ? `🗓️ ${u.createdAt.split(" ")[0].replace(/-/g, ".")}` : "",
        role: u.roleName,
        roleDescription: u.roleDescription,
        checked: false
      }));
      setUsers(formatted);
    });
  }, [setUsers]);
  
  //이름 검색
  const handleSearch = (keyword) => setSearchTerm(keyword);

  //체크박스
  const handleCheck = (id, checked) => {
    const updated = users.map((m) =>
      m.id === id ? { ...m, checked } : m
    );
    setUsers(updated);
  };

  // 조회 버튼 클릭 핸들러
  const handleView = () => {
    const checked = users.filter((m) => m.checked);
    console.log("선택된 회원:", checked);

    if (checked.length !== 1) {
      alert("조회할 회원을 1명만 선택하세요.");
      return;
    }

    setSelectedMember(checked[0]);
    console.log("setSelectedMember:", checked[0]);
  };

  //클라이언트 페이지 이동을 위한 핸들러
  const handleToggleClientPage = () => {
    navigate("/");
  };

  //새로 고침 버튼과 연동
  const handleReset = () => {
    setSearchTerm("");
    setCurrentPage(1);
    setSortConfig({ key: null, direction: "asc" });
  };

  return (
    <div className="viewer-container">
      <Header
        isAdminPage={true}
        onNavigateAdminPage={handleToggleClientPage}
      />
      <div className="main-content">
        <Sidebar selectedMode={mode} onSelectMode={setMode} onLogout={() => { logout(); navigate("/"); }} />
        <div className="content-area">
          
          {/* 회원 상단 툴바 */}
          <MemberListToolbar
            onSearch={handleSearch}
            onReset={handleReset}
            onView={handleView}
          />

          {/* 회원 테이블 */}
          <MemberListTable
            members={users}
            searchTerm={searchTerm}
            currentPage={currentPage}
            itemsPerPage={7}
            showSeeMore={false}
            showCheck={true}
            usePagination={true}
            onCheck={handleCheck}
            onPageChange={setCurrentPage}
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
          />
          {selectedMember && (
            <MemberViewForm
              memberId={selectedMember.id}
              onClose={() => setSelectedMember(null)}
            />
          )}
        </div>

      </div>
    </div>
  );
};

export default MemberCRUD;