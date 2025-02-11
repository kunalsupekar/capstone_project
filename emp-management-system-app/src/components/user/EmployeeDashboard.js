import { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";

const EmployeeDashboard = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUsername(decodedToken.sub || "Employee");  // Extract username
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg w-96 text-center">
      <h2 className="text-2xl font-bold text-blue-600">Welcome, {username} 👨‍💼</h2>
      <p className="text-gray-600 mb-4">Employee Dashboard</p>

      <div className="bg-blue-100 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800">Your Tasks</h3>
        <ul className="text-gray-700 text-left mt-2">
          <li>Task 1: Complete project documentation</li>
          <li> Task 2: Attend team meeting at 3 PM</li>
          <li> Task 3: Submit weekly report</li>
        </ul>
      </div>

      <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
        View More
      </button>
    </div>
  );
};

export default EmployeeDashboard;
