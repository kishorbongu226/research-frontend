import axios from "axios";

const API = "http://localhost:8080/api/v1.0";

const getStudent = (registerNo) => {
  return axios.get(`${API}/student/profile/${registerNo}`);
};

export default {
  getStudent,
};
