import React, { useState, useEffect }  from 'react';
import { fetchUsers } from '../api/api';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import MemberListTable from '../components/member/MemberListTable';
import MemberListToolbar from '../components/member/MemberListToolbar';
import MemberViewForm from "../components/member/MemberViewForm";

const MemberCRUD = () => {
  const [members, setMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    fetchUsers().then((users) => {
      const formatted = users.map((u) => ({
        id: u.id,
        name: u.username,
        email: `📧 ${u.email}`,
        phone: u.phone,
        date: u.createdAt ? `🗓️ ${u.createdAt.split(" ")[0].replace(/-/g, ".")}` : "",
        role: u.roleName,
        roleDescription: u.roleDescription,
        checked: false
      }));
      setMembers(formatted);
    });
  }, []);
  
  //이름 검색
  const handleSearch = (keyword) => setSearchTerm(keyword);

  //테이블 새로고침
  const handleReset = () => setSearchTerm("");

  //체크박스
  const handleCheck = (id, checked) => {
    const updated = members.map((m) =>
      m.id === id ? { ...m, checked } : m
    );
    setMembers(updated);
  };

  // 조회 버튼 클릭 핸들러
  const handleView = () => {
    const checked = members.filter((m) => m.checked);
    if (checked.length !== 1) {
      alert("조회할 회원을 1명만 선택하세요.");
      return;
    }
    setSelectedMember(checked[0]);
  };

  return (
    <div className="viewer-container">
      <Header />
      <div className="main-content">
        <Sidebar active="회원관리" />
        <div className="content-area">
          
          {/* 회원 상단 툴바 */}
          <MemberListToolbar
            onSearch={handleSearch}
            onReset={handleReset}
            onView={handleView}
          />

          {/* 회원 테이블 */}
          <MemberListTable
            members={members}
            searchTerm={searchTerm}
            currentPage={currentPage}
            itemsPerPage={7}
            showSeeMore={false}
            showCheck={true}
            usePagination={true}
            onCheck={handleCheck}
            onPageChange={setCurrentPage}
          />

          {selectedMember && (
            <MemberViewForm
              member={selectedMember}
              onClose={() => setSelectedMember(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberCRUD;