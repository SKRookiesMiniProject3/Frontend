import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import styles from "./Sidebar.module.css";
import {
  BookOpen,
  FilePlus,
  FileText,
  LayoutDashboard,
  FileCheck2,
  FileBarChart,
  FileSignature,
  FileCode2,
  Menu,
  LogOut
} from "lucide-react";

const Sidebar = ({
  activeMain,
  onSelectMain,
  activeCategory,
  onSelectCategory
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  // 사이드바 접기/펴기 토글
  const handleToggle = () => {
    setCollapsed(!collapsed);
  };

  // 로그아웃 후 메인으로 이동
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const categoryList = [
    "전체",
    "사업계획서",
    "R&D 계획서",
    "실적보고서",
    "재무계획서",
    "제품소개서",
  ];

  const categoryIcons = {
    전체: <FileText size={16} />,
    사업계획서: <FileCheck2 size={16} />,
    "R&D 계획서": <FileCode2 size={16} />,
    실적보고서: <FileBarChart size={16} />,
    재무계획서: <FileSignature size={16} />,
    제품소개서: <BookOpen size={16} />,
  };

  return (
    <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      <div className={styles.toggleWrapper}>
        <button className={styles.toggleButton} onClick={handleToggle}>
          <Menu size={22} />
        </button>
      </div>

      <div className={styles.menuSection}>
        {["열람", "등록"].map((menu) => (
          <button
            key={menu}
            className={`${styles.menuItem} ${activeMain === menu ? styles.active : ""}`}
            onClick={() => onSelectMain(menu)}
          >
            {menu === "열람" ? <LayoutDashboard size={22} /> : <FilePlus size={22} />}
            {!collapsed && <span>{menu}</span>}
          </button>
        ))}
      </div>

      <hr className={styles.divider} />

      {!collapsed && <div className={styles.categoryLabel}>보고서 종류</div>}
      <div className={styles.menuSection}>
        {categoryList.map((cat) => (
          <button
            key={cat}
            className={`${styles.subItem} ${activeCategory === cat ? styles.active : ""}`}
            onClick={() => onSelectCategory(cat)}
          >
            {categoryIcons[cat]}
            {!collapsed && <span>{cat}</span>}
          </button>
        ))}
      </div>

      <div className={styles.logoutSection}>
        <button className={styles.logoutButton} onClick={handleLogout}>
          <LogOut size={20} />
          {!collapsed && <span>로그아웃</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
