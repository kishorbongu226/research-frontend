import axios from "axios";

const BASE_URL = "http://localhost:8080/api/v1.0";

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
};

export default professorService;
