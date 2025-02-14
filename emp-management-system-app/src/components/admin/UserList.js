import { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/Config";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("jwtToken");

    axios
      .get(API_ENDPOINTS.GET_USERS, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setUsers(response.data))
      .catch((error) => {
        console.error("Error fetching users:", error);
        setError("Failed to load users. Please try again.");
      });
  }, []);

  return (
    <div className="mt-4">
      {error && <div className="alert alert-danger">{error}</div>}

      <ul className="list-group">
        {users.map((user) => (
          <li key={user.id} className="list-group-item">
            {user.username} - {user.role}
          </li>
        ))}
      </ul>
    </div>
  );
}
