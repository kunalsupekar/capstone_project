import CreateEmployee from "./CreateEmployee";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/Config";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.get(API_ENDPOINTS.GET_USERS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Manage Users</h2>
      <CreateEmployee fetchUsers={fetchUsers} /> {/* ✅ Now fetchUsers is passed */}
    </div>
  );
}
