import React, { useState } from "react";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  const [activeMain, setActiveMain] = useState("열람");
  const [activeCategory, setActiveCategory] = useState("사업계획서");

  return (
    <div className={styles.sidebar}>
      {/* Main 메뉴 */}
      <div className={styles.menuSection}>
        {[ "열람","수정", "등록","삭제"].map((menu) => (
          <button
            key={menu}
            className={`${styles.menuItem} ${
              activeMain === menu ? styles.active : ""
            }`}
            onClick={() => setActiveMain(menu)}
          >
            {menu}
          </button>
        ))}
      </div>

      <hr className={styles.divider} />

      {/* 보고서 종류 */}
      <div className={styles.categoryLabel}>보고서 종류</div>
      <div className={styles.menuSection}>
        {["사업계획서", "R&D 계획서", "실적보고서", "재무계획서","제품소개서"].map((cat) => (
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
