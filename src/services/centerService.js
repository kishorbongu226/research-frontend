import axios from "axios";

const BASE_URL = "http://localhost:8080/api/v1.0";

const centerService = {
  getCenters: async () => {
    return await axios.get(`${BASE_URL}/centers`);
  },
  getCenterById: async (centerId) => {
    return await axios.get(`${BASE_URL}/centers/${centerId}`);
  },

  createCenter: async (centerData, file) => {
    const formData = new FormData();

    formData.append("center", JSON.stringify(centerData));

    formData.append("file", file);

    return await axios.post(`${BASE_URL}/centers/add`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  deleteCenter: async (centerId) => {
    return await axios.delete(`${BASE_URL}/centers/${centerId}`);
  },
};

export default centerService;
