import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";  // ✅ Fixed import
import AdminDashboard from "./admin/AdminDashboard";
import UserDashboard from "./user/UserDashboard";
import EmployeeDashboard from "./user/EmployeeDashboard";

export default function Dashboard() {
  const [role, setRole] = useState("USER");  
  const [username, setUsername] = useState("");  // ✅ Added username
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      console.warn("No token found, redirecting...");
      navigate("/login");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      console.log("Decoded Token:", decodedToken);

      setUsername(decodedToken.sub || "User");  

      let roles = decodedToken.roles || "";
      if (typeof roles === "string") {
        roles = roles.split(",");
      }

      console.log("User Roles:", roles);

      if (roles.includes("ROLE_ADMIN")) setRole("ADMIN");
      else if (roles.includes("ROLE_EMPLOYEE")) setRole("EMPLOYEE");
      else setRole("USER");
    } catch (error) {
      console.error("Error decoding token:", error);
      localStorage.removeItem("jwtToken");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 shadow-lg rounded-lg w-96 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Welcome, {username} 👋</h2>
        <p className="text-gray-600 mb-4">This is your professional dashboard.</p>

        <div className="mt-4">
          {role === "ADMIN" && <AdminDashboard />}
          {role === "EMPLOYEE" && <EmployeeDashboard/>}
          {role === "USER" && <UserDashboard />}
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
