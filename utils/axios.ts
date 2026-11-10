import axios from "axios";
 
const baseURL = (
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  process.env.BASE_URL ||
  ''
).trim().replace(/\/+$/, '');
 
export const axiosInstance = axios.create({
  baseURL,
});