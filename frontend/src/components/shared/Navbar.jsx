import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-md">
      <div className="container px-4 py-4 mx-auto">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-bold text-indigo-600"
          >
            GPS Attendance
          </Link>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="flex items-center gap-2 text-gray-700">
                  <FaUser /> {user.name} ({user.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;