import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../../components/Sidebar.module.css";
import {
  LayoutDashboard,
  Users,
  FileText,
  ShieldAlert,
  Menu as MenuIcon,
  LogOut
} from "lucide-react";

const Sidebar = ({ selectedMode, onSelectMode, onLogout }) => {
  const [activeMain, setActiveMain] = useState(selectedMode || "대시보드");
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedMode) {
      setActiveMain(selectedMode);
    }
  }, [selectedMode]);

  const menuItems = [
    { label: "대시보드", path: "/admin", icon: <LayoutDashboard size={18} /> },
    { label: "회원관리", path: "/admin/member-crud", icon: <Users size={18} /> },
    { label: "리포트 관리", path: "/admin/error-report", icon: <FileText size={18} /> },
    { label: "공격 리포트 관리", path: "/admin/error-report/attack", icon: <ShieldAlert size={18} /> },
  ];

  const handleMainClick = (menu) => {
    setActiveMain(menu.label);
    onSelectMode(menu.label);
    navigate(menu.path);
  };

  const handleToggle = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      <div className={styles.toggleWrapper}>
        <button className={styles.toggleButton} onClick={handleToggle}>
          <MenuIcon size={20} />
        </button>
      </div>

      <div className={styles.menuSection}>
        {menuItems.map((menu) => (
          <button
            key={menu.label}
            className={`${styles.menuItem} ${
              activeMain === menu.label ? styles.active : ""
            }`}
            onClick={() => handleMainClick(menu)}
          >
            {menu.icon}
            {!collapsed && <span>{menu.label}</span>}
          </button>
        ))}
      </div>

      <div className={styles.logoutSection}>
        <button className={styles.menuItem} onClick={onLogout}>
          <LogOut size={18} />
          {!collapsed && <span>로그아웃</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
