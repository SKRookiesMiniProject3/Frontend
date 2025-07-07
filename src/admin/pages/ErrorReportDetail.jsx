import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import "../styles/ErrorReportDetail.css";

const ErrorReportDetail = () => {
  const location = useLocation();
  const passedReport = location.state?.report;

  //Fallback 기본값
  const report = passedReport || {
    no: 0,
    fileId: 0,
    name: "미확인",
    status: "NOT_STARTED",
    comment: "",
    is_deleted: false,
    created_dt: "정보 없음",
  };

  const [status, setStatus] = useState("NOT_STARTED");
  const [comment, setComment] = useState("");
  const [showLogs, setShowLogs] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLogs, setFilteredLogs] = useState([]);

  useEffect(() => {
    if (passedReport) {
      if (passedReport.status) setStatus(passedReport.status);
      if (passedReport.comment) setComment(passedReport.comment);
    }
  }, [passedReport]);

  const logs = [
    "[2025-07-04 14:22:50] 서버 연결 시도",
    "[2025-07-04 14:22:51] 연결 타임아웃 오류 발생",
    "[2025-07-04 14:22:52] 재시도 실패",
    "[2025-07-04 14:22:53] 재시도 실패",
    "[2025-07-04 14:22:54] 재시도 실패",
    "[2025-07-04 14:23:00] 장애 리포트 생성됨",
  ];

  //로그 메시지 검색
  const handleSearch = () => {
    const result = logs.filter((line) =>
      line.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLogs(result);
  };

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

  return (
    <div className="viewer-container">
      <Header />
      <div className="main-content">
        <Sidebar active="리포트 관리" />
        <div className="content-area">
          <div className="detail-container">
            <h2 className="detail-title">에러 리포트 상세
              <button className="download-btn" onClick={handleDownload}>
                리포트 다운로드
              </button>
            </h2>
            <div className="info-row">
              <p><strong>리포트 ID:</strong> {report.id}</p>
              <p><strong>파일 ID:</strong> {report.fileId}</p>
              <p><strong>발생일시:</strong> {report.created_dt}</p>
              <p><strong>에러 원인 사용자:</strong> {report.name || "미확인"}</p>

              <label>
                <strong>진행상태:</strong>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="NOT_STARTED">미처리</option>
                  <option value="IN_PROGRESS">진행 중</option>
                  <option value="COMPLETED">처리</option>
                </select>
              </label>

              <button
                className="save-btn"
                onClick={() => alert("저장되었습니다.")}
              >
                저장
              </button>
            </div>

            <hr />

            <h3>에러 코드 및 메시지</h3>
            <ul>
              <li>에러 코드: ERROR_502</li>
              <li>메시지: 서버 연결 실패 - 타임아웃 발생</li>
            </ul>

            <div className="log-header">
              <h3>전체 로그 확인</h3>
              <div className="log-actions">
                <div className="search-box">
                  <div className="search-wrapper">
                    <input
                      type="text"
                      placeholder="에러 메시지 검색"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="search-icon-btn" onClick={handleSearch}>
                      🔍
                    </button>
                  </div>
                </div>

                <button
                  className="toggle-btn"
                  onClick={() => setShowLogs(!showLogs)}
                >
                  {showLogs ? "로그 숨기기" : "로그 펼치기"}
                </button>

                <button
                  className="reset-btn"
                  onClick={() => {
                    setSearchTerm("");
                    setFilteredLogs([]);
                  }}
                >
                  🔄 새로 고침
                </button>
              </div>
            </div>

            {showLogs && (
              <pre className="log-box">
                {(filteredLogs.length > 0 ? filteredLogs : logs).join("\n")}
              </pre>
            )}

            <div style={{ marginTop: "20px" }}>
              <label>
                <strong>코멘트:</strong>
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="필요한 코멘트를 입력하세요"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ErrorReportDetail;
