// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

import { fetchUsers } from '../api/users';
import useUserStore from '../stores/userStore';
import useAuthStore from "../../stores/authStore";
import errorReportStore from '../stores/errorReportStore';

import ErrorReportTable from '../components/report/ErrorReportTable';
import MemberListTable from '../components/member/MemberListTable';

import Header from '../../components/Header'; // ✅ 공통 Header로 변경
import Sidebar from '../components/layout/Sidebar';
import StatCard from '../components/ui/StatCard';
import WeeklyReportChart from '../components/report/WeeklyReportChart';
import StatusBarChart from "../components/report/StatusBarChart";
import CategoryPieChart from "../components/report/CategoryPieChart";
import { getErrorReportStatusStats, getErrorReportCategoryStats, fetchAttackErrorReportsCount } from "../api/errorReports";

import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const { users, setUsers } = useUserStore();
  const [mode, setMode] = useState("대시보드");
  const { accessToken, logout } = useAuthStore();
  const { reports } = errorReportStore();

  const navigate = useNavigate();

  const [totalCount, setTotalCount] = useState(0);
  const [weeklyCount, setWeeklyCount] = useState(0);
  const [unprocessedCount, setUnprocessedCount] = useState(0);
  const [weeklyReportCounts, setWeeklyReportCounts] = useState([0, 0, 0, 0]);
  const [completedCount, setCompletedCount] = useState(0);
  const [statusStats, setStatusStats] = useState({});
  const [categoryStats, setCategoryStats] = useState({});
  const [attackReportCount, setAttackReportCount] = useState(0);

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

  const getWeekOfMonth = (dateString) => {
    const date = new Date(dateString);
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfWeek = firstDay.getDay();
    const adjustedDate = date.getDate() + dayOfWeek;
    return Math.ceil(adjustedDate / 7);
  };

  //사용자 정보
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const users = await fetchUsers(accessToken);
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

  //StatCard에 출력할 정보
  useEffect(() => {
    const calcStats = () => {
      const total = reports.length;
      const weekly = reports.filter(r => isThisWeek(r.created_dt)).length;
      const unprocessed = reports.filter(
        (r) => r.reportStatus === "IN_PROGRESS" || r.reportStatus === "NOT_STARTED"
      ).length;
      const completed = reports.filter(
        r => r.reportStatus === "COMPLETED"
      ).length;
      const weekCounts = [0, 0, 0, 0];
      reports.forEach(r => {
        const w = getWeekOfMonth(r.created_dt);
        if (w >= 1 && w <= 4) weekCounts[w - 1]++;
      });

      setTotalCount(total);
      setWeeklyCount(weekly);
      setUnprocessedCount(unprocessed);
      setWeeklyReportCounts(weekCounts);
      setCompletedCount(completed);
    };

    calcStats();
  }, [reports]);

  //에러 리포트
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

  //공격 에러 리포트
  useEffect(() => {
    const loadAttackReportStats = async () => {
      try {
        const res = await fetchAttackErrorReportsCount(accessToken);
        if (res?.data !== undefined) {
          setAttackReportCount(res.data);
        }
      } catch (error) {
        console.error("공격 리포트 통계 fetch 실패:", error);
      }
    };

    if (accessToken) loadAttackReportStats();
  }, [accessToken]);

  //클라이언트 페이지 이동을 위한 핸들러
  const handleToggleClientPage = () => {
    navigate("/");
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

          {/* 합계 카드 */}
          <div className="stat-card-container">
            <StatCard title="Total Error Report Count" count={totalCount} max={totalCount} color="#22c55e" />
            <StatCard title="Weekly Error Report Count" count={weeklyCount} max={totalCount} color="#22c55e" />
            <StatCard title="Unprocessed Report Count" count={unprocessedCount} max={totalCount} color="#facc15" />
            <StatCard title="✅ Completed Reports" count={completedCount} max={totalCount} color="#22c55e" />
            <StatCard title="🚨 Attack Error Reports" count={attackReportCount} max={totalCount} color="#ef4444" />
          </div>

          <div className="report-chart-wrapper">
            <div className="report-table-container">
              <ErrorReportTable showSeeMore={true} limit={7} enableStatusFilter={false} enableSorting={false}/>
            </div>
            <div className="weekly-chart-container">
              <WeeklyReportChart counts={weeklyReportCounts} />
            </div>
          </div>

          <div className="chart-section">
            <div className="chart-box wide">
              <h3>Report Statistics by Status</h3>
              <StatusBarChart data={statusStats} />
            </div>
            <div className="chart-box narrow">
              <h3>Report Statistics by Category</h3>
              <CategoryPieChart data={categoryStats} />
            </div>
          </div>

          <MemberListTable members={users} limit={5} showCheck={false} enableSorting={false}/>
        
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
