import React, { useState } from "react";
import "./MemberListToolbar.css";

const MemberListToolbar = ({ onSearch, onReset, onView }) => {
  const [searchTerm, setSearchTerm] = useState("");

  //이름 검색
  const handleSearch = () => onSearch(searchTerm);

  //검색 초기화
  const handleReset = () => {
    setSearchTerm("");
    onReset();
  };

  return (
    <div className="toolbar-container">
      <div className="left-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-btn" onClick={handleSearch}>
            🔍
          </button>
        </div>

          <button className="reset-btn" onClick={handleReset}>
            🔄 새로 고침
          </button>

          <div className="right-section">
            <button className="view-btn" onClick={onView}>조회</button>
          </div>

        </div>
    </div>
  );
};

export default MemberListToolbar;
