import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

//최신 에러 리포트 조회
export const fetchLatestErrorReports = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/error-reports/list/latest`, {
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
    const response = await axios.get(`${BASE_URL}/api/v1/error-reports/analytics/daily-count`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("일별 에러 개수 조회 실패:", error);
    return [];
  }
};

//status 통계 조회
export const getErrorReportStatusStats = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/error-reports/analytics/statistics`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("에러 리포트 통계 조회 실패:", error);
    return [];
  }
};

//카테고리 통계 조회
export const getErrorReportCategoryStats = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/error-reports/analytics/category-statistics`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("에러 리포트 카테고리 통계 조회 실패:", error);
    return [];
  }
};

// 에러 상세 조회
export const fetchErrorReportById = async (id, token) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/error-reports/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(`에러 리포트 ID ${id} 조회 실패:`, error);
    return null;
  }
};

//상태 변경
export const updateErrorStatusById = async (id, status, token) => {
  try {
    const response = await axios.patch(`${BASE_URL}/api/v1/error-reports/${id}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, data: response.data };
  } catch (e) {
    return { success: false, error: e };
  }
};

//comment 입력
export const updateErrorCommentById = async (id, comment, token) => {
  try {
    const response = await axios.patch(`${BASE_URL}/api/v1/error-reports/${id}/comment`, { comment }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, data: response.data };
  } catch (e) {
    return { success: false, error: e };
  }
};

//삭제
export const deleteErrorReportById = async (id, token) => {
  try {
    const response = await axios.delete(`${BASE_URL}/api/v1/error-reports/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(`에러 리포트 ID ${id} 삭제 실패:`, error);
    return null;
  }
};

// 에러 해결 처리
export const resolveErrorReportById = async (id, token) => {
  try {
    const response = await axios.patch(`${BASE_URL}/errors/${id}/resolve`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(`에러 리포트 해결 실패:`, error);
    return null;
  }
};