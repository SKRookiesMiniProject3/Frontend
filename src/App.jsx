// src/App.jsx
import React from 'react';
import LoginPage from './pages/LoginPage';
import DocumentViewer from './pages/DocumentViewer';
import useAuthStore from './stores/authStore';

const App = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return <div>{isLoggedIn ? <DocumentViewer /> : <LoginPage />}</div>;
};

export default App;