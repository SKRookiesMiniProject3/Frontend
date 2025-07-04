// src/pages/DocumentViewer.jsx
import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import FilterTabs from '../components/FilterTabs';
import DocumentGrid from '../components/DocumentGrid';
// import Pagination from '../components/Pagination';
import styles from './DocumentViewer.module.css'; 

const DocumentViewer = () => {
  return (
    <div className={styles.viewerContainer}>
      <Header />
      <div className={styles.mainContent}>
        <Sidebar />
        <div className={styles.contentArea}>
          <FilterTabs />
          <DocumentGrid />
          {/* <Pagination /> */}
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
