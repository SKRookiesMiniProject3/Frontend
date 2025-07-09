// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DocumentViewer from './pages/DocumentViewer';
import AdminDashboard from './admin/pages/AdminDashboard';
import MemberCRUD from './admin/pages/MemberCRUD';
import ErrorReportList from './admin/pages/ErrorReportList';
import ErrorReportDetail from './admin/pages/ErrorReportDetail';
import useAuthStore from './stores/authStore';

const App = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <Routes>
      <Route
        path="/"
        element={isLoggedIn ? <DocumentViewer /> : <Navigate to="/login" />}
      />
      <Route
        path="/login"
        element={!isLoggedIn ? <LoginPage /> : <Navigate to="/" />}
      />
      <Route
        path="/admin"
        element={isLoggedIn ? <AdminDashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/admin/member-crud"
        element={isLoggedIn ? <MemberCRUD /> : <Navigate to="/login" />}
      />
      <Route
        path="/admin/error-report"
        element={isLoggedIn ? <ErrorReportList /> : <Navigate to="/login" />}
      />
      <Route
        path="/admin/error-report-detail/:id"
        element={isLoggedIn ? <ErrorReportDetail /> : <Navigate to="/login" />}
      />
    </Routes>
  );
};

export default App;