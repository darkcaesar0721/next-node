import axios, { AxiosError } from "axios";
import axiosRetry from 'axios-retry';

const axiosClient = axios.create({
  baseURL: '/api',
  headers: { "content-type": "application/json" },
});


axiosRetry(axiosClient, { retries: 3 });

// Interceptor for requests
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    console.error("Error in request interceptor:", error);
    return Promise.reject(error);
  }
);

// Interceptor for responses
axiosClient.interceptors.response.use(
  (response) => {
    return response.data; // Return only the data from the response
  },
  (error: AxiosError) => {
    console.error("Error in response interceptor:", error);
    const errorMessage = (error.response?.data as any)?.error || error.message;
    return Promise.reject(errorMessage);
  }
);

export default axiosClient;
