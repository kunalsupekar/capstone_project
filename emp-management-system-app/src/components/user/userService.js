// userService.js
import axios from "axios";

export const fetchAllUsers = async () => {
  try {
    const response = await axios.get("/users/find/all");
    return response.data;
  } catch (error) {
    console.error("Error fetching users", error);
    return [];
  }
};

export const findUserByUsername = async (username) => {
    try {
      const response = await axios.get(`/users/find/by/username?username=${username}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.warn("User not found");
        return null; // Handle this case in UI
      }
      console.error("Error finding user", error);
      return null;
    }
  };
  
