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

const eventService = {
  getEvents: async () => {
    return await axios.get(`${BASE_URL}/events`, {
      headers: getAuthHeader(),
    });
  },

  createEvent: async (eventData, file) => {
    const formData = new FormData();
    formData.append("event", JSON.stringify(eventData));
    formData.append("file", file);

    return axios.post(`${BASE_URL}/events/add`, formData, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "multipart/form-data",
      },
    });
  },

  updateEvent: async (eventId, eventData, file) => {
    const formData = new FormData();
    formData.append("event", JSON.stringify(eventData));

    if (file) {
      formData.append("file", file);
    }

    return axios.put(`${BASE_URL}/events/edit/${eventId}`, formData, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "multipart/form-data",
      },
    });
  },

  deleteEvent: async (eventId) => {
    return await axios.delete(`${BASE_URL}/events/${eventId}`, {
      headers: getAuthHeader(),
    });
  },
};

export default eventService;
