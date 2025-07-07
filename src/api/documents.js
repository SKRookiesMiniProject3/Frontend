// src/api/documents.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const uploadDocument = async (formData, accessToken) => {
  const response = await axios.post(`${BASE_URL}/documents/upload`, formData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
