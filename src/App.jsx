// src/App.jsx
import React from 'react';
import LoginPage from './pages/LoginPage';
import DocumentViewer from './pages/DocumentViewer';
import useAuthStore from './stores/authStore'; // ✅ Zustand에서 로그인 상태 가져오기

// const App = () => {
//   const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

//   return (
//     <div>
//       {isLoggedIn ? <DocumentViewer /> : <LoginPage />}
//     </div>
//   );
// };
const App = () => {
  return (
    <div>
      {/* <LoginPage /> */}
      <DocumentViewer />
    </div>
  );
};

export default App;
