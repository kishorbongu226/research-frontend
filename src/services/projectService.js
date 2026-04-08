import axios from "axios";

const BASE_URL = "https://sathyabamaresearchprojects.co.in/api/v1.0";

// Helper to get Basic Auth header from sessionStorage
const getAuthHeader = () => {
  const auth = sessionStorage.getItem("auth");
  if (auth) {
    const { basicAuth } = JSON.parse(auth);
    return { Authorization: basicAuth };
  }
  return {};
};

const projectService = {
  getProjectsByCenter: async (centerId) => {
    return await axios.get(`${BASE_URL}/center/${centerId}`, {
      headers: getAuthHeader(),
    });
  },

  getProjectById: async (projectId) => {
    return await axios.get(`${BASE_URL}/project/${projectId}`, {
      headers: getAuthHeader(),
    });
  },
  updateProject: async (projectId, projectData) => {
    return await axios.put(`${BASE_URL}/project/${projectId}`, projectData, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
    });
  },
  getStudentsByProject: async (projectId) => {
    return await axios.get(`${BASE_URL}/project/${projectId}/students`, {
      headers: getAuthHeader(),
    });
  },
  removeStudentFromProject: async (projectId, applicationId) => {
    return await axios.delete(
      `${BASE_URL}/project/${projectId}/students/${applicationId}`,
      {
        headers: getAuthHeader(),
      },
    );
  },

  createProject: async (projectData, file) => {
    const formData = new FormData();
    formData.append("project", JSON.stringify(projectData));
    formData.append("file", file);

    return await axios.post(`${BASE_URL}/projects/add`, formData, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "multipart/form-data",
      },
    });
  },

  applyForProject: async (applicationData, file) => {
    const formData = new FormData();
    formData.append("details", JSON.stringify(applicationData));
    formData.append("file", file);

    return await axios.post(`${BASE_URL}/student/apply`, formData, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getAllProjects: async () => {
    return await axios.get(`${BASE_URL}/projects`, {
      headers: getAuthHeader(),
    });
  },
  markProjectCompleted: async (projectId) => {
  return await axios.post(`${BASE_URL}/project/completed/${projectId}`, {}, {
    headers: getAuthHeader(),
  });
},
getProjectsByStudent: async (registerNo) => {
  return await axios.get(`${BASE_URL}/student/${registerNo}/projects`, {
    headers: getAuthHeader(),
  });
},
};

export default projectService;
