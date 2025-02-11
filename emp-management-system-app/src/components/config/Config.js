const API_BASE_URL = "http://localhost:8999";

const API_ENDPOINTS = {
  GET_USERS: `${API_BASE_URL}/users/find/all`,
  CREATE_EMPLOYEE: `${API_BASE_URL}/users/create`,
  FIND_USER: "/find-user",
  MANAGE_USERS: "/manage-users",
};

export { API_BASE_URL, API_ENDPOINTS };
