import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './FilterControls.module.css';

const FilterControls = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  onSearchClick,
}) => {
  return (
    <div className={styles.controls}>
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
          <button className={styles.searchBtn} onClick={onSearchClick}>
            📅 선택기간 조회
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;
