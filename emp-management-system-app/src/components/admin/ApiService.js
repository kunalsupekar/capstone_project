import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserCheck, FaUserTimes, FaUserClock, FaBell } from "react-icons/fa";

export default function AdminDashboardCards() {
  const [stats, setStats] = useState({
    activeUsers: 0,
    inactiveUsers: 0,
    pendingUsers: 0,
  });
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem("jwtToken"); // Get token from session storage

    if (!token) {
      console.error("No JWT token found, authentication required.");
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // Fetch user statistics
    axios
      .get("http://localhost:8999/users/stats", { headers })
      .then((response) => setStats(response.data))
      .catch((error) => console.error("Error fetching user stats:", error));

    // Fetch notifications
    axios
      .get("http://localhost:8999/notifications", { headers })
      .then((response) => setNotifications(response.data))
      .catch((error) => console.error("Error fetching notifications:", error));
  }, []);

  return (
    <div className="row g-3">
      {/* Active Users Card */}
      <div className="col-md-4">
        <div className="card shadow-sm border-0 bg-success text-white">
          <div className="card-body d-flex align-items-center justify-content-between">
            <div>
              <h5 className="card-title">Active Users</h5>
              <h3>{stats.activeUsers}</h3>
            </div>
            <FaUserCheck size={40} />
          </div>
        </div>
      </div>

      {/* Inactive Users Card */}
      <div className="col-md-4">
        <div className="card shadow-sm border-0 bg-secondary text-white">
          <div className="card-body d-flex align-items-center justify-content-between">
            <div>
              <h5 className="card-title">Inactive Users</h5>
              <h3>{stats.inactiveUsers}</h3>
            </div>
            <FaUserTimes size={40} />
          </div>
        </div>
      </div>

      {/* Pending Users Card */}
      <div className="col-md-4">
        <div className="card shadow-sm border-0 bg-warning text-dark">
          <div className="card-body d-flex align-items-center justify-content-between">
            <div>
              <h5 className="card-title">Pending Users</h5>
              <h3>{stats.pendingUsers}</h3>
            </div>
            <FaUserClock size={40} />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="col-md-12">
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <h5 className="card-title d-flex align-items-center">
              <FaBell className="me-2 text-primary" size={24} />
              Notifications
            </h5>
            <ul className="list-group">
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <li key={index} className="list-group-item">
                    {notification.message}
                  </li>
                ))
              ) : (
                <li className="list-group-item text-muted">
                  No new notifications
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
