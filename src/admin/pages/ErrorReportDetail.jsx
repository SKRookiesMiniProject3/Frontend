import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { fetchErrorReportById } from "../api/errorReports";
import { updateErrorStatusById, updateErrorCommentById, deleteErrorReportById } from "../api/errorReports";

import useAuthStore from "../../stores/authStore";
import errorReportStore from "../stores/errorReportStore";

import Header from '../../components/Header'; // ✅ 공통 Header로 변경
import Sidebar from '../components/layout/Sidebar';

import "../styles/ErrorReportDetail.css";

const ErrorReportDetail = () => {
  const { selectedReport, setSelectedReport } = errorReportStore();
  const { id } = useParams();
  const { logout, accessToken } = useAuthStore();

  const navigate = useNavigate();

  const [mode, setMode] = useState("리포트 상세보기");

  const [status, setStatus] = useState("");
  const [comment, setComment] = useState("");

  //해당 id의 에러 리포트 정보
  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchErrorReportById(id, accessToken);
      if (result?.success && result.data) {
        setSelectedReport(result.data);
        setStatus(result.data.reportStatus);
        setComment(result.data.reportComment || "");
      } else {
        console.error("에러 상세 조회 실패 또는 데이터 없음");
      }
    };
    fetchData();
  }, [id, accessToken]);

  if (!selectedReport) {
    return <div className="loading">🔄 에러 리포트를 불러오는 중입니다...</div>;
  }

  const report = selectedReport;

  //File Path를 위한 url 설정
  const fileBaseUrl = import.meta.env.VITE_API_FILE_BASE_URL;
  const fullPath = `${fileBaseUrl}/${report.reportPath}`;

  //날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return "정보 없음";
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  //status 변경 핸들러
  const handleStatusUpdate = async () => {
    const result = await updateErrorStatusById(report.id, status, accessToken, comment);
    if (result?.success) {
      alert("상태가 업데이트되었습니다.");
      setSelectedReport(result.data.data);
    } else {
      alert("상태 업데이트 실패");
    }
  };

  //클라이언트 페이지 이동을 위한 핸들러
  const handleToggleClientPage = () => {
    navigate("/");
  };

  //코멘트 저장 핸들러
  const handleCommentSave = async () => {
    const result = await updateErrorCommentById(report.id, comment, accessToken);
    if (result?.success) {
      alert("코멘트가 저장되었습니다.");
      setSelectedReport(result.data.data);
    } else {
      alert("코멘트 저장 실패");
    }
  };

  //에러 리포트 삭제 핸들러
  const handleDelete = async () => {
    const confirmed = window.confirm("정말로 이 에러 리포트를 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      const result = await deleteErrorReportById(report.id, accessToken);
      if (result?.success) {
        alert("리포트가 성공적으로 삭제되었습니다.");
        navigate("/admin/error-report");
      } else {
        alert("삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("삭제 중 오류 발생:", error);
      alert("서버 오류로 인해 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="viewer-container">
      <Header
        isAdminPage={true}
        onNavigateAdminPage={handleToggleClientPage}
      />
      <div className="main-content">
        <Sidebar selectedMode={mode} onSelectMode={setMode} onLogout={() => { logout(); navigate("/"); }} />
        <div className="content-area">
          <div className="detail-container">
            
            <div className="detail-header">
              <h2 className="detail-title">{report.reportTitle}</h2>
              <button className="delete-btn" onClick={handleDelete}>
                🗑️ 삭제하기
              </button>
            </div>

            <div className="info-grid">
              <div style={{ lineHeight: '1.8', fontSize: '16px' }}>
                <p style={{ marginBottom: '10px' }}>
                  📄 <strong style={{ fontSize: '16.5px' }}>Report ID:</strong> {report.id}
                </p>
                <p style={{ marginBottom: '10px' }}>
                  📅 <strong style={{ fontSize: '16.5px' }}>Date:</strong> {formatDate(report.createdDt)}
                </p>
                <p style={{ marginBottom: '10px' }}>
                  🧾 <strong style={{ fontSize: '16.5px' }}>Preview:</strong> {report.reportPreview}
                </p>
                <p style={{ marginBottom: '10px' }}>
                  🗂️ <strong style={{ fontSize: '16.5px' }}>Category:</strong> {report.reportCategory} ({report.reportCategoryDescription})
                </p>
                <p style={{ marginBottom: '10px' }}>
                  📌 <strong style={{ fontSize: '16.5px' }}>Status:</strong>
                  <span
                    className={`status-badge ${report.reportStatus}`}
                    style={{ marginLeft: '6px' }}
                  >
                    {report.reportStatusDescription}
                  </span>
                </p>
                <p style={{ marginBottom: '0' }}>
                  📁 <strong style={{ fontSize: '16.5px' }}>File Path:</strong>{" "}
                  <a href={fullPath} target="_blank" rel="noopener noreferrer">
                    {fullPath}
                  </a>
                </p>
              </div>
            </div>

            <div className="edit-section">
              <label className="status-row">
                <strong>진행상태:</strong>
                <div className="status-control">
                  <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="NOT_STARTED">시작 안함</option>
                    <option value="IN_PROGRESS">진행중</option>
                    <option value="COMPLETED">완료</option>
                  </select>
                  <button onClick={handleStatusUpdate} className="save-btn">상태 저장</button>
                </div>
              </label>

              <label>
                <strong>코멘트:</strong>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="코멘트를 입력하세요"
                />
                <div className="comment-btn-container">
                  <button onClick={handleCommentSave} className="save-btn">코멘트 저장</button>
                </div>
              </label>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
export default ErrorReportDetail;
