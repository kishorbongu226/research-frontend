import axios from "axios";

const BASE_URL = "http://localhost:8080/api/v1.0";

const projectService = {
  getProjectsByCenter: async (centerId) => {
    return await axios.get(`${BASE_URL}/center/${centerId}`);
  },
  getProjectById: async (projectId) => {
    return await axios.get(`${BASE_URL}/project/${projectId}`);
  },

  createProject: async (projectData, file) => {
    const formData = new FormData();
    formData.append("project", JSON.stringify(projectData));
    formData.append("file", file);

    return await axios.post(`${BASE_URL}/projects/add`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  applyForProject: async (applicationData, file) => {
    const formData = new FormData();
    formData.append("details", JSON.stringify(applicationData));
    formData.append("file", file);

    return await axios.post(`${BASE_URL}/student/apply`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  getAllProjects: async () => {
    return await axios.get(`${BASE_URL}/projects`);
  },
};

export default projectService;
