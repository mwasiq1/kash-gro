import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchApi = async (url: string, options: any = {}) => {
  try {
    const isFormData = options.body instanceof FormData;
    const response = await api({
      url,
      method: options.method || "GET",
      data: isFormData ? options.body : (options.body ? JSON.parse(options.body) : undefined),
      headers: {
        ...(isFormData ? { "Content-Type": "multipart/form-data" } : {}),
        ...options.headers,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("API Fetch Error:", error.response?.data || error.message);
    return error.response?.data || { success: false, error: "Something went wrong" };
  }
};

export default api;
