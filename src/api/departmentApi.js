import axios from "axios";
const BASE_URL = "http://localhost:8080/api/departments";

export const getDepartments = async () => {
  const res = await axios.get(BASE_URL);
  return res.data; // Directly returns the array
};