import axios from "axios";

const BASE_URL = "http://localhost:8080/api/v1.0";

const applicationService = {
  approveApplication: async (applicationId, professorId) => {
    return await axios.put(
      `${BASE_URL}/application/${applicationId}/APPROVE`,
      null,
      { params: { professorId } },
    );
  },

  declineApplication: async (applicationId, professorId) => {
    return await axios.put(
      `${BASE_URL}/application/${applicationId}/DECLINE`,
      null,
      { params: { professorId } },
    );
  },

  getPendingApplications: async (professorId) => {
    return await axios.get(`${BASE_URL}/applications/pending/${professorId}`);
  },
  getApprovedApplications: async (professorId) => {
    return await axios.get(`${BASE_URL}/applications/approved/${professorId}`);
  },
};

export default applicationService;
