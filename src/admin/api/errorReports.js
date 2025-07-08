import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

//최신 에러 리포트 조회
export const fetchLatestErrorReports = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/errors/latest`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("최신 에러 리포트 조회 실패:", error);
    return [];
  }
};

//미해결 에러 리포트 조회
export const fetchUnresolvedErrorReports = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/errors/unresolved`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("미해결 에러 리포트 조회 실패:", error);
    return [];
  }
};

//일별 에러 리포트 개수 조회
export const fetchDailyErrorCounts = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/errors/daily-count`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("일별 에러 개수 조회 실패:", error);
    return [];
  }
};

//에러 리포트 등록
// export const createErrorReport = async (token, errorReport) => {
//   try {
//     const response = await axios.post(`${BASE_URL}/errors`, errorReport, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("에러 리포트 등록 실패:", error);
//     throw error;
//   }
// };