import axios from "axios";

const API_URL = "http://localhost:8080/api/v1.0/facilities";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Automatically attach auth header
axiosInstance.interceptors.request.use((config) => {
  const auth = JSON.parse(sessionStorage.getItem("auth"));

  if (auth?.basicAuth) {
    config.headers.Authorization = auth.basicAuth;
  }

  return config;
});

const getFacilitiesByCenter = (centerId) => {
  return axiosInstance.get(`/center/${centerId}`);
};

const addFacility = (facilityData) => {
  return axiosInstance.post("/add", facilityData);
};

const deleteFacility = (facilityId) => {
  return axiosInstance.delete(`/${facilityId}`);
};

export default {
  getFacilitiesByCenter,
  addFacility,
  deleteFacility,
};
