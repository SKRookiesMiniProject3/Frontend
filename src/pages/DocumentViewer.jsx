import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import FilterTabs from '../components/SortTabs';
import DocumentGrid from '../components/DocumentGrid';
// import Pagination from '../components/Pagination';
import './DocumentViewer.css';

const DocumentViewer = () => {
  return (
    <div className="viewer-container">
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="content-area">
          <FilterTabs />
          <DocumentGrid />
          {/* <Pagination /> */}
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
