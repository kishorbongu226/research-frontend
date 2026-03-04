import axios from "axios";

const BASE_URL = "http://localhost:8080/api/v1.0";

const getAuthHeader = () => {
  const auth = sessionStorage.getItem("auth");
  if (auth) {
    const { basicAuth } = JSON.parse(auth);
    return { Authorization: basicAuth };
  }
  return {};
};

const centerService = {
  getCenters: async () => {
    return await axios.get(`${BASE_URL}/centers`, {
      headers: getAuthHeader(),
    });
  },

  getCenterById: async (centerId) => {
    return await axios.get(`${BASE_URL}/centers/${centerId}`, {
      headers: getAuthHeader(),
    });
  },

  createCenter: async (centerData, file) => {
    const formData = new FormData();
    formData.append("center", JSON.stringify(centerData));
    formData.append("file", file);

    return await axios.post(`${BASE_URL}/centers/add`, formData, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "multipart/form-data",
      },
    });
  },

  deleteCenter: async (centerId) => {
    return await axios.delete(`${BASE_URL}/centers/${centerId}`, {
      headers: getAuthHeader(),
    });
  },
};

export default centerService;