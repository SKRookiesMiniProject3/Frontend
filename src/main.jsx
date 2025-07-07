import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // ✅ 추가
import App from './App.jsx';
import './index.css'; // 전체 스타일 (필요시)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* ✅ 라우터로 감싸줌 */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
