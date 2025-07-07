import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const tempToken = '임의 토큰값';

// 전체 사용자 목록 조회
export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/ceo/users`, {
      headers: { Authorization: `Bearer ${tempToken}` }
    });
    return response.data.data.users;
  } catch (error) {
    console.error("사용자 목록 조회 실패:", error);
    return [];
  }
};

// 개별 사용자 조회
export const fetchUserById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/ceo/users/${id}`, {
      headers: { Authorization: `Bearer ${tempToken}` }
    });
    return response.data.data;
  } catch (error) {
    console.error(`ID ${id} 회원 조회 실패:`, error);
    return null;
  }
};