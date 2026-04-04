import axios from "axios";

const API = "http://49.249.61.246:9097/api/v1.0";

// Helper to get Basic Auth header from sessionStorage
const getAuthHeader = () => {
  const auth = sessionStorage.getItem("auth");
  if (auth) {
    const { basicAuth } = JSON.parse(auth);
    return { Authorization: basicAuth };
  }
  return {};
};

const studentService = {
  getStudent: (registerNo) => {
    return axios.get(`${API}/student/profile/${registerNo}`, {
      headers: getAuthHeader(),
    });
  },
  updateStudentProfile: (registerNo, payload) => {
    return axios.put(`${API}/student/profile/${registerNo}`, payload, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
    });
  },
};

export default studentService;
