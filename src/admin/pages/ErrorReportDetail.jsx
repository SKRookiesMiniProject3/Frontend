import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import "../styles/ErrorReportDetail.css";
import useAuthStore from "../../stores/authStore";
import errorReportStore from "../stores/errorReportStore";
import { fetchErrorReportById } from "../api/errorReports";
import { updateErrorStatusById, updateErrorCommentById, deleteErrorReportById } from "../api/errorReports";

const ErrorReportDetail = () => {
  const { selectedReport, setSelectedReport } = errorReportStore();
  const { id } = useParams();
  const { accessToken } = useAuthStore();
  const [mode, setMode] = useState("리포트 상세보기");

  const [status, setStatus] = useState("");
  const [comment, setComment] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const { logout } = useAuthStore();
  const navigate = useNavigate();

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

  const formatDate = (dateString) => {
    if (!dateString) return "정보 없음";
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  const handleStatusUpdate = async () => {
    const result = await updateErrorStatusById(report.id, status, accessToken); // PATCH 호출
    if (result?.success) {
      alert("상태가 업데이트되었습니다.");
      setSelectedReport((prev) => ({ ...prev, reportStatus: status }));
    } else {
      alert("상태 업데이트 실패");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleMainPage = () => {
    navigate("/");
  };

  const handleCommentSave = async () => {
    const result = await updateErrorCommentById(report.id, comment, accessToken); // PATCH 호출
    if (result?.success) {
      alert("코멘트가 저장되었습니다.");
      setSelectedReport((prev) => ({ ...prev, reportComment: comment }));
    } else {
      alert("코멘트 저장 실패");
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("정말로 이 에러 리포트를 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      const result = await deleteErrorReportById(report.id, accessToken);
      if (result?.success) {
        alert("리포트가 성공적으로 삭제되었습니다.");
        navigate("/admin/error-report"); // 리스트 페이지 등으로 이동
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
      <Header />
      <div className="main-content">
        <Sidebar selectedMode={mode} onSelectMode={setMode} />
        <div className="content-area">
          <div className="detail-container">
            <div className="detail-header">
              <h2 className="detail-title">에러 리포트 상세</h2>
              <button className="delete-btn" onClick={handleDelete}>
                🗑️ 삭제하기
              </button>
            </div>

            {/* 로그아웃, 메인 페이지 이동 */}
            <div className="content-toolbar">
            <button className="menu-button" onClick={() => setShowMenu(!showMenu)}>⋮</button>
            {showMenu && (
              <div className="dropdown-menu">
                <button onClick={handleMainPage}>메인 페이지</button>
                <button onClick={handleLogout}>로그아웃</button>
              </div>
            )}
            </div>
            <div className="info-grid">
              <p><strong>리포트 ID:</strong> {report.id}</p>
              <p><strong>에러 발생자:</strong> {report.errorSourceMemberName || "알 수 없음"}</p>
              <p><strong>작성일시:</strong> {formatDate(report.createdDt)}</p>
            </div>

            <div className="edit-section">
              <label className="status-row">
                <strong>진행상태:</strong>
                <div className="status-control">
                  <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="NOT_STARTED">시작 안함</option>
                    <option value="IN_PROGRESS">진행중</option>
                    <option value="COMPLETED">완료</option>
                    <option value="CANCELLED">취소</option>
                    <option value="ON_HOLD">보류</option>
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
