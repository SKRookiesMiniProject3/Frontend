import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const tempToken = '임의 토큰값';

// 에러 리포트 목록 조회
export const fetchErrorReports = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/error-reports`, {
      headers: { Authorization: `Bearer ${tempToken}` }
    });
    return response.data.data.reports;
  } catch (error) {
    console.error("에러 리포트 목록 조회 실패:", error);
    return [];
  }
};