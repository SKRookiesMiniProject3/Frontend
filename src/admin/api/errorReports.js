import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

//일별 에러 리포트 개수 조회
export const fetchDailyErrorCounts = async (token, period = "7") => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/error-reports/analytics/daily-count`, {
      params: { period },
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

//status 별 에러 리포트 목록 조회
export const fetchReportsByStatus = async (status, token) => {
  let endpoint = "";

  switch (status) {
    case "NOT_STARTED":
      endpoint = "/api/v1/error-reports/list/not-started";
      break;
    case "IN_PROGRESS":
      endpoint = "/api/v1/error-reports/list/in-progress";
      break;
    case "COMPLETED":
      endpoint = "/api/v1/error-reports/list/completed";
      break;
    default:
      endpoint = "/api/v1/error-reports";
  }

  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (e) {
    console.error("리포트 상태별 조회 실패:", e);
    return [];
  }
};

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

// 기간별 에러 리포트 조회
export const fetchReportsByDateRange = async (startDate, endDate, token) => {
  const toKstISOString = (date) => {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString();
  };

  // 종료일을 하루 뒤로 조정 (당일 포함되도록)
  const adjustedEndDate = new Date(endDate);
  adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
  adjustedEndDate.setHours(0, 0, 0, 0);

  try {
    const response = await axios.get(`${BASE_URL}/api/v1/error-reports/list/by-date-range`, {
      params: {
        startDate: toKstISOString(startDate),
        endDate: toKstISOString(adjustedEndDate), // 하루 뒤 날짜로 전송
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("기간별 리포트 조회 실패:", error);
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
export const updateErrorStatusById = async (id, status, token, comment = "") => {
  let url = `${BASE_URL}/api/v1/error-reports/${id}/status`;

  // 상태별로 URL 변경
  switch (status) {
    case "NOT_STARTED":
      url += "/not-started";
      break;
    case "IN_PROGRESS":
      url += "/in-progress";
      break;
    case "COMPLETED":
      url += `/completed`;
      if (comment) {
        // 완료 상태일 때만 쿼리로 코멘트 추가
        url += `?completionComment=${encodeURIComponent(comment)}`;
      }
      break;
    default:
      return { success: false, error: "지원하지 않는 상태입니다." };
  }

  try {
    const response = await axios.patch(url, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { success: true, data: response.data };
  } catch (e) {
    return { success: false, error: e };
  }
};

//comment 입력
export const updateErrorCommentById = async (id, comment, token) => {
  try {
    const encoded = encodeURIComponent(comment);
    const url = `${BASE_URL}/api/v1/error-reports/${id}/comment?comment=${encoded}`;

    const response = await axios.patch(url, null, {
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

//valid 카테고리 조회
export const fetchValidErrorReports = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/error-reports/list/valid`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("VALID 에러 리포트 조회 실패:", error);
    return [];
  }
};

//invalid 카테고리 조회
export const fetchInvalidErrorReports = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/error-reports/list/invalid`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("INVALID 에러 리포트 조회 실패:", error);
    return [];
  }
};

//공격 에러 리포트 조회
export const fetchAttackErrorReports = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/error-reports/list/attacks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("공격 에러 리포트 조회 실패:", error);
    return [];
  }
};

//공격 에러 리포트 통계 조회
export const fetchAttackErrorReportsCount = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/error-reports/analytics/recent-attacks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("공격 에러 리포트 통계 조회 실패:", error);
    return [];
  }
};