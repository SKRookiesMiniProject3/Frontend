// src/api/auth.js
import axios from "axios";

const BASE_URL = "http://localhost:8080/api/v1"; // 실제 API 주소로 바꿔주세요

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      username,
      password,
    });

    return response.data; // accessToken 등
  } catch (error) {
    throw error.response?.data || error;
  }
};
