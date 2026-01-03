import React from 'react';
import { Link } from 'react-router-dom';

export default function CarCard({ car }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition transform hover:scale-105">
      <div className="relative">
        <img
          src={car.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
          alt={car.title}
          className="w-full h-48 object-cover"
        />
        <span className={`absolute top-2 right-2 px-3 py-1 rounded text-white text-sm font-bold ${
          car.status === 'Available' ? 'bg-green-500' : 
          car.status === 'Sold' ? 'bg-red-500' : 
          'bg-yellow-500'
        }`}>
          {car.status}
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800">{car.title}</h3>
        <p className="text-sm text-gray-600">{car.brand} {car.model} • {car.year}</p>
        
        <div className="flex justify-between text-gray-600 text-sm my-2">
          <span>⛽ {car.fuelType}</span>
          <span>🔧 {car.transmission}</span>
          <span>📍 {car.mileage} km</span>
        </div>

        <p className="text-gray-700 text-sm line-clamp-2 mb-3">{car.description}</p>

        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-blue-600">₹{car.price.toLocaleString()}</span>
          <Link
            to={`/car/${car._id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
