import axios from "axios";

const BASE_URL = "http://49.249.61.246:9097/api/v1.0";

const getAuthHeader = () => {
  const auth = sessionStorage.getItem("auth");
  if (auth) {
    const { basicAuth } = JSON.parse(auth);
    return { Authorization: basicAuth };
  }
  return {};
};

const applicationService = {
  approveApplication: async (applicationId) => {
    return await axios.put(
      `${BASE_URL}/application/${applicationId}/APPROVE`,
      {},
      { headers: getAuthHeader() },
    );
  },

  declineApplication: async (applicationId) => {
    return await axios.put(
      `${BASE_URL}/application/${applicationId}/DECLINE`,
      {},
      { headers: getAuthHeader() },
    );
  },

  getPendingApplications: async () => {
    return await axios.get(`${BASE_URL}/applications/pending/`, {
      headers: getAuthHeader(),
    });
  },

  getApprovedApplications: async () => {
    return await axios.get(`${BASE_URL}/applications/approved/`, {
      headers: getAuthHeader(),
    });
  },

  getStudentApplications: async (registerNo) => {
    return await axios.get(`${BASE_URL}/student/${registerNo}/applications`, {
      headers: getAuthHeader(),
    });
  },
};

export default applicationService;
