import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import "../styles/ErrorReportDetail.css";
import errorReportStore from "../stores/errorReportStore";
//import { updateErrorReport } from "../api/errorReports";

//Fallback 기본값
const fallbackReport = {
  id: 0,
  fileId: 0,
  memberId: null,
  status: "NOT_STARTED",
  comment: "",
  is_deleted: false,
  created_dt: "정보 없음",
};

const ErrorReportDetail = () => {
  //const { selectedReport, setSelectedReport, updateReportById } = errorReportStore();
  const { selectedReport, setSelectedReport } = errorReportStore();
  const location = useLocation();
  const passedReport = location.state?.report;

  useEffect(() => {
    if (passedReport) setSelectedReport(passedReport);
  }, [passedReport]);

  const report = selectedReport || fallbackReport;

  const [status, setStatus] = useState(report.status);
  const [comment, setComment] = useState(report.comment || "");

  useEffect(() => {
    setStatus(report.status);
    setComment(report.comment || "");
  }, [report.id]);

  // const handleSave = async () => {
  //   try {
  //     await updateErrorReport(report.id, status, comment);
  //     updateReportById(report.id, { status, comment });
  //     alert("에러 리포트가 저장되었습니다.");
  //   } catch (err) {
  //     console.error(err);
  //     alert("저장 실패");
  //   }
  // };

  const handleDownload = async () => {
    try {
      const res = await fetch(`/api/v1/files/${report.fileId}/download`);
      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Error_Report_${report.id}.txt`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("리포트 다운로드 실패");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  return (
    <div className="viewer-container">
      <Header />
      <div className="main-content">
        <Sidebar active="리포트 관리" />
        <div className="content-area">
          <div className="detail-container">
            <h2 className="detail-title">에러 리포트 상세</h2>

            <div className="info-grid">
              <p><strong>리포트 ID:</strong> {report.id}</p>
              <p><strong>파일 ID:</strong> {report.fileId}</p>
              <p><strong>에러 원인 사용자:</strong> {report.memberId ?? "미확인"}</p>
              <p><strong>발생일시:</strong> {formatDate(report.created_dt)}</p>
            </div>

            <div className="edit-section">
              <label>
                <strong>진행상태:</strong>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="NOT_STARTED">미처리</option>
                  <option value="IN_PROGRESS">진행 중</option>
                  <option value="COMPLETED">처리</option>
                </select>
              </label>

              <label>
                <strong>코멘트:</strong>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="필요한 코멘트를 입력하세요"
                />
              </label>
            </div>

            <div className="btn-group">
              <button className="download-btn" onClick={handleDownload}>
                리포트 다운로드
              </button>
              {/* <button className="save-btn" onClick={handleSave}>
                저장
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ErrorReportDetail;
