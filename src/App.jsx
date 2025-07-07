import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DocumentViewer from './pages/DocumentViewer';
import AdminDashboard from './admin/pages/AdminDashboard';
import MemberCRUD from './admin/pages/MemberCRUD';
import ErrorReportDetail from './admin/pages/ErrorReportDetail';
import ErrorReportList from './admin/pages/ErrorReportList';
import useAuthStore from './stores/authStore';

const App = () => {
  const { isLoggedIn, role } = useAuthStore();
  const DEV_TEST_MODE = import.meta.env.VITE_DEV_TEST_MODE === 'true';

  return (
    <Routes>
      <Route path="/" element={isLoggedIn ? <DocumentViewer /> : <LoginPage />} />

      {/* 관리자 페이지 전체 테스트 가능하게 설정 */}
      <Route
        path="/admin"
        element={
          DEV_TEST_MODE || (isLoggedIn && role === 'CEO') ? (
            <AdminDashboard />
          ) : (
            <LoginPage />
          )
        }
      />
      <Route
        path="/admin/member-crud"
        element={
          DEV_TEST_MODE || (isLoggedIn && role === 'CEO') ? (
            <MemberCRUD />
          ) : (
            <LoginPage />
          )
        }
      />
      <Route
        path="/admin/error-report"
        element={
          DEV_TEST_MODE || (isLoggedIn && role === 'CEO') ? (
            <ErrorReportList />
          ) : (
            <LoginPage />
          )
        }
      />
      <Route
        path="/admin/error-report-detail"
        element={
          DEV_TEST_MODE || (isLoggedIn && role === 'CEO') ? (
            <ErrorReportDetail />
          ) : (
            <LoginPage />
          )
        }
      />
    </Routes>
  );
};

export default App;