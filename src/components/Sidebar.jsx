import React, { useState, useEffect } from "react";
import styles from "./Sidebar.module.css";

const Sidebar = ({ selectedMode, onSelectMode }) => {
  const [activeMain, setActiveMain] = useState(selectedMode || "열람");
  const [activeCategory, setActiveCategory] = useState("사업계획서");

  // 외부에서 전달된 mode가 바뀌면 내부도 동기화
  useEffect(() => {
    setActiveMain(selectedMode);
  }, [selectedMode]);

  const handleMainClick = (menu) => {
    setActiveMain(menu);
    onSelectMode(menu); // 상위 컴포넌트에 전달
  };

  return (
    <div className={styles.sidebar}>
      {/* Main 메뉴 */}
      <div className={styles.menuSection}>
        {["열람", "수정", "등록", "삭제"].map((menu) => (
          <button
            key={menu}
            className={`${styles.menuItem} ${
              activeMain === menu ? styles.active : ""
            }`}
            onClick={() => handleMainClick(menu)}
          >
            {menu}
          </button>
        ))}
      </div>

      <hr className={styles.divider} />

      {/* 보고서 종류 */}
      <div className={styles.categoryLabel}>보고서 종류</div>
      <div className={styles.menuSection}>
        {["사업계획서", "R&D 계획서", "실적보고서", "재무계획서", "제품소개서"].map((cat) => (
          <button
            key={cat}
            className={`${styles.subItem} ${
              activeCategory === cat ? styles.active : ""
            }`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
