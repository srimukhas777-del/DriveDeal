import React, { useState, useEffect } from 'react';
import CarCard from '../components/CarCard';
import Loader from '../components/Loader';
import { carAPI } from '../api/car.api';

export default function HomePage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await carAPI.getAllCars();
      setCars(response.data.cars || []);
      setError(null);
    } catch (err) {
      setError('Failed to load cars');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 className="text-5xl font-bold mb-4 text-center">Welcome to CarMarket</h1>
        <p className="text-xl text-gray-600 text-center mb-8">
          Find your perfect car from thousands of listings
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-6">Featured Cars</h2>
        {cars.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No cars available at the moment</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
