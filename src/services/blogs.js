import axios from "axios";
const baseUrl = "http://localhost:3001/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (newBlog) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(`${baseUrl}`, newBlog, config);
  return response.data;
};

const update = async (blog, id) => {
  const response = await axios.put(`${baseUrl}/${id}`, blog);
  return response.data;
};

const deleteBlog = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`);
  return response.data;
};

export default { getAll, create, update, deleteBlog, setToken };
