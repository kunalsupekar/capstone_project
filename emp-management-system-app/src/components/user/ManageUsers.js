import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = sessionStorage.getItem("jwtToken");
        const response = await axios.get("http://localhost:8999/users/find/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Manage Users</h2>
      <ul className="mt-6">
        {users.map((user) => (
          <li key={user.id} className="border p-2 m-2">
            {user.username} - {user.role}
          </li>
        ))}
      </ul>
      <button onClick={() => navigate("/admin-dashboard")} className="bg-gray-500 text-white p-2 mt-4">
        Back to Dashboard
      </button>
    </div>
  );
}
