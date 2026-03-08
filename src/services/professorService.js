import axios from "axios";

const BASE_URL = "http://59.145.65.84:3000/api/v1.0";

// ⭐ same helper used in other services
const getAuthHeader = () => {
  const auth = sessionStorage.getItem("auth");
  if (auth) {
    const { basicAuth } = JSON.parse(auth);
    return { Authorization: basicAuth };
  }
  return {};
};

const professorService = {
  getAdminProfessors: async () => {
    return await axios.get(`${BASE_URL}/admins`, {
      headers: getAuthHeader(),
    });
  },
  getAdminProfessor: async (registerNo) => {
    return await axios.get(`${BASE_URL}/admins/${registerNo}`, {
      headers: getAuthHeader(),
    });
  },
};

export default professorService;
