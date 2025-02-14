import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function FindUser() {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFindUser = async () => {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.get(
        `http://localhost:8999/users/find/by/email?email=${email}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data);
      setError("");
    } catch (error) {
      setUser(null);
      setError("User not found.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Find User</h2>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter email"
        className="border p-2 m-2"
      />
      <button onClick={handleFindUser} className="bg-blue-500 text-white p-2">
        Search
      </button>
      {error && <p className="text-red-500">{error}</p>}
      {user && <p className="mt-4">Email: {user.email} | Role: {user.role}</p>}
      <button onClick={() => navigate("/admin-dashboard")} className="bg-gray-500 text-white p-2 mt-2">
        Back to Dashboard
      </button>
    </div>
  );
}
