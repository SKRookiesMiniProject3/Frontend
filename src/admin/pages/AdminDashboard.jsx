// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { fetchUsers } from '../api/users';
import Header from '../../components/Header'; // ✅ 공통 Header로 변경
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
import { getErrorReportStatusStats, getErrorReportCategoryStats, fetchAttackErrorReportsCount } from "../api/errorReports";

const AdminDashboard = () => {
  const { users, setUsers } = useUserStore();
  const [mode, setMode] = useState("대시보드");
  const { accessToken, logout } = useAuthStore();
  const navigate = useNavigate();
  const { reports } = errorReportStore();

  const [totalCount, setTotalCount] = useState(0);
  const [weeklyCount, setWeeklyCount] = useState(0);
  const [unprocessedCount, setUnprocessedCount] = useState(0);
  const [weeklyReportCounts, setWeeklyReportCounts] = useState([0, 0, 0, 0]);

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

  useEffect(() => {
    const loadAttackReportStats = async () => {
      try {
        const res = await fetchAttackErrorReportsCount(accessToken);
        if (res?.data !== undefined) {
          setAttackReportCount(res.data);
        }
      } catch (error) {
        console.error("❌ 공격 리포트 통계 fetch 실패:", error);
      }
    };

    if (accessToken) loadAttackReportStats();
  }, [accessToken]);

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
          <div className="stat-card-container">
            <StatCard title="Total Error Report Count" count={totalCount} />
            <StatCard title="Weekly Error Report Count" count={weeklyCount} />
            <StatCard title="Unprocessed Report Count" count={unprocessedCount} />
            <StatCard title="Total Member Count" count={users.length} />
            <StatCard title="🚨 Attack Error Reports" count={attackReportCount} />
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
