import React, { useEffect, useState } from "react";
import { fetchUsers } from '../api/users';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import ErrorReportTable from '../components/report/ErrorReportTable';
import MemberListTable from '../components/member/MemberListTable';
import StatCard from '../components/ui/StatCard';
import WeeklyReportChart from '../components/report/WeeklyReportChart';
import "../styles/AdminDashboard.css";
import useUserStore from '../stores/userStore';
import errorReportStore from '../stores/errorReportStore';

const AdminDashboard = () => {
  const { users, setUsers } = useUserStore();
  const { setReports } = errorReportStore();
  const [mode, setMode] = useState("대시보드");
  const { totalCount, weeklyCount, unprocessedCount, setTotalCount, setWeeklyCount, setUnprocessedCount } = errorReportStore();
  const [weeklyReportCounts, setWeeklyReportCounts] = useState([0, 0, 0, 0]);

  const fetchErrorReports = async () => {
    //더미 데이터
    return [
      { created_dt: "2024-07-01", report_status: "NOT_STARTED" },
      { created_dt: "2024-07-03", report_status: "DONE" },
      { created_dt: "2024-07-10", report_status: "NOT_STARTED" },
      { created_dt: "2024-07-15", report_status: "DONE" },
    ];
  };

    //주간 에러 리포트 수 처리 로직
  const isThisWeek = (dateString) => {
    const now = new Date();
    const todayDay = now.getDay();
    
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - todayDay);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const targetDate = new Date(dateString);

    return targetDate >= startOfWeek && targetDate <= endOfWeek;
  };

  // 특정 날짜가 이번 달 몇 번째 주인지 계산
  const getWeekOfMonth = (dateString) => {
    const date = new Date(dateString);
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfWeek = firstDay.getDay(); // 0: 일 ~ 6: 토

    const adjustedDate = date.getDate() + dayOfWeek;
    return Math.ceil(adjustedDate / 7); // 1 ~ 5 주차 반환
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const users = await fetchUsers();
        console.log("회원 목록 로드 완료", users);
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
        setUsers(formatted);

        const reports = await fetchErrorReports();
        setReports(reports.map((r) => ({
          id: r.id,
          fileId: r.report_file_id,
          memberId: r.error_source_member,
          status: r.report_status,
          created_dt: r.created_dt,
        })));

        // 총합
        setTotalCount(reports.length);

        // 주간 리포트 수
        const weeklyCount = reports.filter(r => isThisWeek(r.created_dt)).length;
        setWeeklyCount(weeklyCount);

        // 미처리 리포트 수
        const unprocessedCount = reports.filter(r => r.report_status === 'NOT_STARTED').length;
        setUnprocessedCount(unprocessedCount);

        // 주차별 분포
        const weekCounts = [0, 0, 0, 0];
        reports.forEach(r => {
          const week = getWeekOfMonth(r.created_dt);
          if (week >= 1 && week <= 4) {
            weekCounts[week - 1]++;
          }
        });
        setWeeklyReportCounts(weekCounts);

      } catch (error) {
        console.error("대시보드 데이터 로딩 실패:", error);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div className="viewer-container">
      <Header />
      <div className="main-content">
        <Sidebar selectedMode={mode} onSelectMode={setMode} />
        <div className="content-area">
          
          {/* 합계 카드 */}
          <div className="stat-card-container">
            <StatCard title="Total Error Report Count" count={totalCount} />
            <StatCard title="Weekly Error Report Count" count={weeklyCount} />
            <StatCard title="Unprocessed Report Count" count={unprocessedCount} />
            <StatCard title="Total Member Count" count={users.length} />
          </div>

          <div className="report-chart-wrapper">
            {/* 에러 리포트 테이블 */}
            <div className="report-table-container">
              <ErrorReportTable showSeeMore={true} limit={7} enableStatusFilter={false}/>
            </div>
            {/* 주간 에러 리포트 합계 차트 */}
            <div className="weekly-chart-container">
              <WeeklyReportChart counts={weeklyReportCounts} />
            </div>
          </div>
          {/* 회원 리스트 테이블 */}
          <MemberListTable members={users} limit={5} showCheck={false} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
