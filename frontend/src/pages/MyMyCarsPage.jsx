import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import { carAPI } from '../api/car.api';
import { useAuth } from '../hooks/useAuth';

export default function MyMyCarsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchMyCars();
    }
  }, [user]);

  const fetchMyCars = async () => {
    try {
      setLoading(true);
      const response = await carAPI.getMyCars();
      setCars(response.data.cars || []);
      setError(null);
    } catch (err) {
      setError('Failed to load your cars');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCar = async (id) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await carAPI.deleteCar(id);
        setCars(cars.filter(car => car._id !== id));
        alert('Car deleted successfully');
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete car');
      }
    }
  };

  const statusColor = {
    'Available': 'bg-green-100 text-green-800',
    'Sold': 'bg-red-100 text-red-800',
    'Pending': 'bg-yellow-100 text-yellow-800',
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">My Cars</h1>
          <button
            onClick={() => navigate('/sell-car')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-bold transition"
          >
            + List New Car
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {cars.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 text-lg mb-4">You haven't listed any cars yet</p>
            <button
              onClick={() => navigate('/sell-car')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-bold transition"
            >
              List Your First Car
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <div key={car._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                <img
                  src={car.images?.[0] || 'https://via.placeholder.com/300x200'}
                  alt={car.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{car.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor[car.status] || 'bg-gray-100'}`}>
                      {car.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{car.brand} {car.model} ({car.year})</p>
                  <p className="text-2xl font-bold text-blue-600 mb-4">₹{car.price.toLocaleString('en-IN')}</p>
                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <p>Mileage: {car.mileage.toLocaleString('en-IN')} km</p>
                    <p>Fuel: {car.fuelType} | Transmission: {car.transmission}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/edit-car/${car._id}`)}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-bold transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCar(car._id)}
                      className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 font-bold transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
