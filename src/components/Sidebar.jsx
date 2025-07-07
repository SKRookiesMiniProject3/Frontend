// Sidebar.jsx
import React from "react";
import styles from "./Sidebar.module.css";

const Sidebar = ({ activeMain, onSelectMain, activeCategory, onSelectCategory }) => {
  return (
    <div className={styles.sidebar}>
      {/* Main 메뉴 */}
      <div className={styles.menuSection}>
        {["열람", "수정", "등록"].map((menu) => (
          <button
            key={menu}
            className={`${styles.menuItem} ${activeMain === menu ? styles.active : ""}`}
            onClick={() => onSelectMain(menu)}
          >
            {menu}
          </button>
        ))}
      </div>

      <hr className={styles.divider} />

      {/* 보고서 종류 */}
      <div className={styles.categoryLabel}>보고서 종류</div>
      <div className={styles.menuSection}>
        {["전체", "사업계획서", "R&D 계획서", "실적보고서", "재무계획서", "제품소개서"].map((cat) => (
          <button
            key={cat}
            className={`${styles.subItem} ${activeCategory === cat ? styles.active : ""}`}
            onClick={() => onSelectCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
