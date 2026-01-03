import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search)}`);
      setSearch('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center mb-4">
          <Link to="/" className="text-3xl font-bold hover:opacity-80 transition">
            🚗 CarMarket
          </Link>

          <div className="flex space-x-2 items-center">
            {user ? (
              <>
                <span className="text-sm font-semibold mr-4">Welcome, <span className="text-yellow-300">{user.name}</span></span>
                <Link to="/" className="bg-blue-600 hover:bg-blue-800 px-4 py-2 rounded-lg font-medium transition">
                  🏠 Home
                </Link>
                <Link to="/profile" className="bg-indigo-600 hover:bg-indigo-800 px-4 py-2 rounded-lg font-medium transition">
                  👤 Profile
                </Link>
                <Link to="/my-cars" className="bg-blue-600 hover:bg-blue-800 px-4 py-2 rounded-lg font-medium transition">
                  📋 My Cars
                </Link>
                <Link to="/sell-car" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium transition">
                  ➕ Sell Car
                </Link>
                <Link to="/my-offers" className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-medium transition">
                  💰 My Offers
                </Link>
                <Link to="/seller-offers" className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg font-medium transition">
                  📨 Received Offers
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-medium transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/" className="bg-blue-600 hover:bg-blue-800 px-4 py-2 rounded-lg font-medium transition">
                  🏠 Home
                </Link>
                <Link to="/login" className="bg-blue-600 hover:bg-blue-800 px-4 py-2 rounded-lg font-medium transition">
                  Login
                </Link>
                <Link to="/register" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium transition">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search cars by brand, model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-grow px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-gray-800 px-6 py-2 rounded-lg font-bold transition">
            Search
          </button>
        </form>
      </div>
    </nav>
  );
}
