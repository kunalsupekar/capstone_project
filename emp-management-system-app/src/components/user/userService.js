import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function UserProfile() {
  const { email } = useParams(); // Get user email from URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email || email === "undefined") {
      console.error("Invalid user email");
      return;
    }

    setLoading(true);

    fetch(`http://localhost:8999/users/find/${encodeURIComponent(email)}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("User not found");
        }
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        setLoading(false);
      });
  }, [email]);

  if (loading) {
    return <h2 className="text-center mt-5">Loading user details...</h2>;
  }

  if (!user) {
    return <h2 className="text-center mt-5">No user data found</h2>;
  }

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow">
        <h2 className="text-center">User Profile</h2>
        <p><strong>First Name:</strong> {user.firstName}</p>
        <p><strong>Last Name:</strong> {user.lastName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Mobile:</strong> {user.mobile}</p>
        <p><strong>Status:</strong> {user.status}</p>
        <p><strong>Roles:</strong> {user.roles?.map(role => role.name).join(", ")}</p>
      </div>
    </div>
  );
}
