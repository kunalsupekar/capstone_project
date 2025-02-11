import { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/Config";

export default function AllUserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.get(API_ENDPOINTS.GET_USERS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  return (
    <div>
      <h2 className="text-center mt-5">User List</h2>
      <div className="table-responsive">
        <table className="table table-bordered table-striped mt-3">
          <thead className="table-dark">
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.mobile}</td>
                  <td>
                    <span
                      className={`badge ${
                        user.status === "ACTIVE"
                          ? "bg-success"
                          : user.status === "INACTIVE"
                          ? "bg-danger"
                          : "bg-warning"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
