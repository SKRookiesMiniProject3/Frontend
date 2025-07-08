import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 에러 리포트 목록 조회
export const fetchErrorReports = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/error-reports`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data.reports;
  } catch (error) {
    console.error("에러 리포트 목록 조회 실패:", error);
    return [];
  }
};

//에러 리포트 개별 수정
export const updateErrorReport = async (token, id, status, comment) => {
  try {
    const response = await axios.patch(`${BASE_URL}/api/v1/error-reports/${id}`, 
      {
        report_status: status,
        report_comment: comment,
      }, 
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`에러 리포트 수정 실패 (ID: ${id}):`, error);
    throw error;
  }
};