import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 문서 업로드
export const uploadDocument = async (formData, accessToken) => {
  const response = await axios.post(`${BASE_URL}/documents/upload`, formData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// 문서 다운로드 (자동 저장)
export const downloadDocumentByHash = async (hash, fileName = 'downloaded_file.pdf') => {
  try {
    const response = await axios.get(`${BASE_URL}/documents/files/${hash}`, {
      responseType: 'blob', // 바이너리 파일
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    // Blob → 다운로드 처리
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName); // 파일 이름 지정
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url); // 메모리 해제
  } catch (error) {
    console.error("파일 다운로드 실패:", error);
    throw error;
  }
};

// 문서 리스트 가져오기
export const fetchDocuments = async ({ categoryTypeId, startDate, endDate } = {}) => {
  const token = localStorage.getItem("accessToken");

  const params = {};
  if (categoryTypeId) params.categoryTypeId = categoryTypeId;
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const response = await axios.get(`${BASE_URL}/documents`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });

  return response.data;
};
