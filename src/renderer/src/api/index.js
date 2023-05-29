import axios from "axios";

const baseURL = import.meta.env.RENDERER_VITE_API_URL;

const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.interceptors.request.use((req) => {
  if (sessionStorage.getItem("user")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(sessionStorage.getItem("user")).accessToken
    }`;
  }
  return req;
});

export const getFoods = async (data) =>
  axiosInstance.post("/api/menu/food/list", data);

export const createQrCode = async (data) =>
  axiosInstance.post("/api/payment/create-qr", data, { responseType: "blob" });

export const createQrCodeStatic = async (data) =>
axiosInstance.post("/api/payment/create-qr-static", data, { responseType: "blob" });

export const generateOtpDelete = async () =>
  axiosInstance.get("/api/user/generate-otp-delete");
