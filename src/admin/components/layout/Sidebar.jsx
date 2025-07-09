import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../../components/Sidebar.module.css";

const Sidebar = ({ selectedMode, onSelectMode }) => {
  const [activeMain, setActiveMain] = useState(selectedMode || "대시보드");

  const navigate = useNavigate();

  useEffect(() => {
    if (selectedMode) {
      setActiveMain(selectedMode);
    }
  }, [selectedMode]);

  const menuItems = [
    { label: "대시보드", path: "/admin" },
    { label: "회원관리", path: "/admin/member-crud" },
    { label: "리포트 관리", path: "/admin/error-report" },
    { label: "공격 리포트 관리", path: "/admin/error-report/attack" },
  ];

  const handleMainClick = (menu) => {
    console.log("이동 경로 확인:", menu.path);
    setActiveMain(menu.label);
    onSelectMode(menu.label);
    navigate(menu.path);
  };

  return (
    <div className={styles.sidebar}>
      {/* Main 메뉴 */}
      <div className={styles.menuSection}>
        {menuItems.map((menu) => (
          <button
            key={menu.label}
            className={`${styles.menuItem} ${
              activeMain === menu.label ? styles.active : ""
            }`}
            onClick={() => handleMainClick(menu)}
          >
            {menu.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
