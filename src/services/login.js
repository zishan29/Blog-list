import axios from "axios";
const baseurl = "http://localhost:3001/api/login";

const login = async (credentials) => {
  const response = await axios.post(`${baseurl}`, credentials);
  return response.data;
};

export default { login };
