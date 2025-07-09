import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { fetchUsers } from '../api/users';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import ErrorReportTable from '../components/report/ErrorReportTable';
import MemberListTable from '../components/member/MemberListTable';
import StatCard from '../components/ui/StatCard';
import WeeklyReportChart from '../components/report/WeeklyReportChart';
import "../styles/AdminDashboard.css";
import useUserStore from '../stores/userStore';
import useAuthStore from "../../stores/authStore";
import errorReportStore from '../stores/errorReportStore';
import StatusBarChart from "../components/report/StatusBarChart";
import CategoryPieChart from "../components/report/CategoryPieChart";
import { getErrorReportStatusStats, getErrorReportCategoryStats, } from "../api/errorReports";


const AdminDashboard = () => {
  const { users, setUsers } = useUserStore();
  const [mode, setMode] = useState("대시보드");

  const [showMenu, setShowMenu] = useState(false);
  const { accessToken, logout } = useAuthStore();
  const navigate = useNavigate();
  const { reports } = errorReportStore();

  const [totalCount, setTotalCount] = useState(0);
  const [weeklyCount, setWeeklyCount] = useState(0);
  const [unprocessedCount, setUnprocessedCount] = useState(0);
  const [weeklyReportCounts, setWeeklyReportCounts] = useState([0, 0, 0, 0]);

  const [statusStats, setStatusStats] = useState({});
  const [categoryStats, setCategoryStats] = useState({});


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
        const users = await fetchUsers(accessToken);
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

      } catch (error) {
        console.error("대시보드 데이터 로딩 실패:", error);
      }
    };

    loadDashboardData();
  }, []);

  useEffect(() => {
    const calcStats = () => {
      const total = reports.length;
      const weekly = reports.filter(r => isThisWeek(r.created_dt)).length;
      const unprocessed = reports.filter(r => !r.resolved).length;
      const weekCounts = [0, 0, 0, 0];
      reports.forEach(r => {
        const w = getWeekOfMonth(r.created_dt);
        if (w >= 1 && w <= 4) weekCounts[w - 1]++;
      });

      setTotalCount(total);
      setWeeklyCount(weekly);
      setUnprocessedCount(unprocessed);
      setWeeklyReportCounts(weekCounts);
    };

    calcStats();
  }, [reports]);

  useEffect(() => {
    const fetchStats = async () => {
      const statusRes = await getErrorReportStatusStats(accessToken);
      if (statusRes?.success) {
        setStatusStats(statusRes.data);
      }

      const categoryRes = await getErrorReportCategoryStats(accessToken);
      if (categoryRes?.success) {
        setCategoryStats(categoryRes.data);
      }
    };

    fetchStats();
  }, [accessToken]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleMainPage = () => {
    navigate("/");
  };

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
              <ErrorReportTable showSeeMore={true} limit={7} enableStatusFilter={false} enableSorting={false}/>
            </div>
            {/* 주간 에러 리포트 합계 차트 */}
            <div className="weekly-chart-container">
              <WeeklyReportChart counts={weeklyReportCounts} />
            </div>
          </div>
          <div className="chart-section">
            <h3>상태별 리포트 통계</h3>
            <StatusBarChart data={statusStats} />

            <h3>카테고리별 리포트 통계</h3>
            <CategoryPieChart data={categoryStats} />
          </div>
          {/* 회원 리스트 테이블 */}
          <MemberListTable members={users} limit={5} showCheck={false} enableSorting={false}/>
        </div>

        {/* 로그아웃, 메인 페이지 이동 */}
        <div className="content-toolbar">
          <button className="menu-button" onClick={() => setShowMenu(!showMenu)}>⋮</button>
          {showMenu && (
            <div className="dropdown-menu">
              <button onClick={handleMainPage}>메인 페이지</button>
              <button onClick={handleLogout}>로그아웃</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
