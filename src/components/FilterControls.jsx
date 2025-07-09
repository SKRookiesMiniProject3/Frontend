// src/components/FilterControls.jsx
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './FilterControls.module.css';

const FilterControls = ({ startDate, endDate, setStartDate, setEndDate }) => {
  return (
    <div className={styles.controls}>
      <div className={styles.dateRow}>
        <div className={styles.dateItem}>
          <label>시작일</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            className={styles.dateInput}
            placeholderText="시작일 선택"
          />
        </div>

        <span className={styles.tilde}>~</span>

        <div className={styles.dateItem}>
          <label>종료일</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy-MM-dd"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            className={styles.dateInput}
            placeholderText="종료일 선택"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterControls;
