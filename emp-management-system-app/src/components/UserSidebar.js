import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported

export default function Sidebar() {
  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 bg-dark text-white" style={{ width: "250px", height: "100vh" }}>
      <h4 className="text-center mb-4">User Menu</h4>
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link to="/profile" className="nav-link text-white">
            <i className="bi bi-person-circle me-2"></i> Profile
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/tasks" className="nav-link text-white">
            <i className="bi bi-list-task me-2"></i> My Tasks
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/settings" className="nav-link text-white">
            <i className="bi bi-gear me-2"></i> Settings
          </Link>
        </li>
      </ul>
      <hr />
      <button className="btn btn-danger w-100">Logout</button>
    </div>
  );
}
