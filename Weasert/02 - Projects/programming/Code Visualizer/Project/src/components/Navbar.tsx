import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/code', label: 'Code' },
    { path: '/settings', label: 'Settings' },
  ];

  return (
    <nav className="bg-gray-800 text-white h-full w-64 p-4 shadow-lg">
      <div className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">Code Visualizer</div>
      <ul>
        {navItems.map((item) => (
          <li key={item.path} className="mb-2">
            <Link
              to={item.path}
              className={`block px-4 py-2 rounded-md transition-all duration-200 ${location.pathname === item.path ? 'bg-blue-600 text-white font-semibold' : 'hover:bg-gray-700 hover:pl-5'}`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;