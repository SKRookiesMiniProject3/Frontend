import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './FilterControls.module.css';

const FilterControls = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  sortOrder,
  setSortOrder,
}) => {
  return (
    <div className={styles.controls}>
      {/* 기간 라벨 + 날짜 선택기 */}
      <div className={styles.dateWrapper}>
        <label className={styles.label}>기간</label>
        <div className={styles.dateRow}>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            className={styles.dateInput}
            placeholderText="시작일"
            portalId="root-portal"  

          />
          <span className={styles.tilde}>~</span>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy-MM-dd"
            className={styles.dateInput}
            placeholderText="종료일"
              portalId="root-portal"  

          />
        </div>
      </div>

      {/* 정렬 라벨 버튼 */}
      <div className={styles.sortWrapper}>
        <div className={styles.sortButtonGroup}>
          <button
            className={`${styles.sortButton} ${sortOrder === 'latest' ? styles.active : ''}`}
            onClick={() => setSortOrder('latest')}
          >
            최신순
          </button>
          <button
            className={`${styles.sortButton} ${sortOrder === 'oldest' ? styles.active : ''}`}
            onClick={() => setSortOrder('oldest')}
          >
            오래된순
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;
