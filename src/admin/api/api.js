import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';
const tempToken = '토큰값';

// JWT 토큰 가져오기 함수 (로컬스토리지 활용 예시)
// export const getAuthToken = () => {
//   return localStorage.getItem('token');
// };

// 전체 사용자 목록 조회
export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/ceo/users`, {
      headers: { Authorization: `Bearer ${tempToken}` }
    });
    return response.data.data.users;
  } catch (error) {
    console.error("사용자 목록 조회 실패:", error);
    return [];
  }
};