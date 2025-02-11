import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported
import UserSidebar from "../UserSidebar";

export default function UserDashboard() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT
        setUsername(decodedToken.sub || "User"); // Use 'sub' as username
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <UserSidebar />

      {/* Main Dashboard */}
      <div className="container-fluid p-4">
        <div className="card shadow-lg p-4">
          <h1 className="text-center">Welcome, {username} 👋</h1>
          <p className="text-muted text-center">You are logged in as a User.</p>

          <div className="mt-4 border-top pt-4 text-center">
            <h2 className="text-primary">User Dashboard</h2>
            <p className="text-secondary">Manage your profile, view your tasks, and stay updated.</p>
          </div>

          <div className="mt-4 d-flex justify-content-center gap-3">
            <button className="btn btn-primary btn-lg">
              <i className="bi bi-person-circle me-2"></i> View Profile
            </button>
            <button className="btn btn-success btn-lg">
              <i className="bi bi-list-task me-2"></i> My Tasks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
