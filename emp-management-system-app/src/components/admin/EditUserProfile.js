import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../config/Config";

export default function EditUserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editedUser, setEditedUser] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    status: "",
  });

  useEffect(() => {
    fetchUser();
  }, [userId]); // ✅ Added userId as a dependency

  const fetchUser = async () => {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.get(`${API_ENDPOINTS.GET_USERBYID}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      setEditedUser({
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        mobile: response.data.mobile,
        status: response.data.status,
      });
    } catch (error) {
      console.error("Error fetching user details", error);
      alert("Failed to fetch user details.");
    }
  };

  const handleChange = (field, value) => {
    setEditedUser({ ...editedUser, [field]: value });
  };

  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem("jwtToken");
      await axios.put(`${API_ENDPOINTS.UPDATE_USER}/${userId}`, editedUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("User updated successfully!");
      navigate("/admin-dashboard/find-all"); // ✅ Adjusted redirection path
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user.");
    }
  };

  if (!user) return <p className="text-center mt-4">Loading user details...</p>;

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary fw-bold">Edit User Profile</h2>
      <div className="card p-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label">First Name</label>
          <input
            type="text"
            className="form-control"
            value={editedUser.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <input
            type="text"
            className="form-control"
            value={editedUser.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Mobile</label>
          <input
            type="text"
            className="form-control"
            value={editedUser.mobile}
            onChange={(e) => handleChange("mobile", e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            className="form-control"
            value={editedUser.status}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
        <button className="btn btn-success" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
}
