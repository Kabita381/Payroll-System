import axios from "axios";
const BASE_URL = "http://localhost:8080/api/designations";

export const getDesignations = async () => {
  const res = await axios.get(BASE_URL);
  return res.data; 
};