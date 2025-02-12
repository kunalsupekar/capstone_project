import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../config/Config";

export default function AllUserList() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

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
      setFilteredUsers(response.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    filterUsers(status, searchQuery);
  };

  const handleSearch = () => {
    filterUsers(selectedStatus, searchQuery);
  };

  const filterUsers = (status, query) => {
    let filtered = users;
    if (status !== "ALL") {
      filtered = filtered.filter((user) => user.status === status);
    }
    if (query.trim() !== "") {
      filtered = filtered.filter(
        (user) =>
          user.firstName.toLowerCase().includes(query.toLowerCase()) ||
          user.lastName.toLowerCase().includes(query.toLowerCase())
      );
    }
    setFilteredUsers(filtered);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary fw-bold mb-4">User List</h2>

      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by First or Last Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={selectedStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            <option value="ALL">All Users</option>
            <option value="ACTIVE">Active Users</option>
            <option value="INACTIVE">Inactive Users</option>
            <option value="PENDING">Pending Users</option>
          </select>
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" onClick={handleSearch}>
            Find User
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped text-center">
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
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/admin-dashboard/edit/${user.id}`)}
                >
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
                <td colSpan="5" className="text-center text-muted">
                  No users found matching <strong>"{searchQuery}"</strong> under{" "}
                  <strong>{selectedStatus}</strong> status.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
