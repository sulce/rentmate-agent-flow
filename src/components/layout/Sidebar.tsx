import { Link } from "react-router-dom";
import { Home, Settings, FileText } from "lucide-react";

export const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-md">
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link to="/" className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded">
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/applications" className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded">
              <FileText className="h-5 w-5" />
              <span>Applications</span>
            </Link>
          </li>
          <li>
            <Link to="/settings" className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}; 