import React, { useEffect, useState } from "react";
import { fetchUsers } from '../api/api';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import ErrorReportTable from '../components/report/ErrorReportTable';
import MemberListTable from '../components/member/MemberListTable';
import StatCard from '../components/ui/StatCard';
import WeeklyReportChart from '../components/report/WeeklyReportChart';
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {

  const [memberData, setMemberData] = useState([]);

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
      setMemberData(formatted);
    });
  }, []);

  return (
    <div className="viewer-container">
      <Header />
      <div className="main-content">
        <Sidebar active="대시보드" />
        <div className="content-area">
          
          {/* 합계 카드 */}
          <div className="stat-card-container">
            <StatCard title="Total Error Report Count" count={51} />
            <StatCard title="Weekly Error Report Count" count={12} />
            <StatCard title="Unprocessed Report Count" count={3} />
            <StatCard title="Total Member Count" count={memberData.length} />
          </div>

          <div className="report-chart-wrapper">
            {/* 에러 리포트 테이블 */}
            <div className="report-table-container">
              <ErrorReportTable showSeeMore={true} limit={7} enableStatusFilter={false}/>
            </div>
            {/* 주간 에러 리포트 합계 차트 */}
            <div className="weekly-chart-container">
              <WeeklyReportChart />
            </div>
          </div>
          {/* 회원 리스트 테이블 */}
          <MemberListTable members={memberData} limit={5} showCheck={false} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
