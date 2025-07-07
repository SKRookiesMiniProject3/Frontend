// src/api/auth.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/v1/auth/signin`, {
      username,
      password,
    });

    return response.data; // { accessToken: "..." }
  } catch (error) {
    throw error.response?.data || error;
  }
};
