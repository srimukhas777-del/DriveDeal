import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import { carAPI, offerAPI } from '../api/car.api';
import { useAuth } from '../hooks/useAuth';

export default function CarDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerPrice, setOfferPrice] = useState('');
  const [offerLoading, setOfferLoading] = useState(false);

  useEffect(() => {
    fetchCarDetails();
  }, [id]);

  const fetchCarDetails = async () => {
    try {
      setLoading(true);
      const response = await carAPI.getCarById(id);
      setCar(response.data.car);
      setError(null);
    } catch (err) {
      setError('Failed to load car details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isSeller = () => {
    if (!user || !car) return false;
    const sellerId = typeof car.seller === 'object' ? car.seller._id : car.seller;
    const userId = typeof user === 'object' ? user._id : user;
    return userId === sellerId;
  };

  const handleNextImage = () => {
    if (car?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % car.images.length);
    }
  };

  const handlePrevImage = () => {
    if (car?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length);
    }
  };

  const handleDeleteCar = async () => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await carAPI.deleteCar(id);
        navigate('/my-cars');
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete car');
      }
    }
  };

  const handleMakeOffer = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (!offerPrice || parseInt(offerPrice) <= 0) {
      alert('Please enter a valid offer price');
      return;
    }

    setOfferLoading(true);
    try {
      await offerAPI.createOffer(id, { offerPrice: parseInt(offerPrice) });
      alert('Offer sent successfully!');
      setOfferPrice('');
      setShowOfferForm(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send offer');
    } finally {
      setOfferLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-center py-8"><p className="text-red-600 text-xl">{error}</p></div>;
  if (!car) return <div className="text-center py-8"><p className="text-xl">Car not found</p></div>;

  const currentImage = car.images?.[currentImageIndex] || 'https://via.placeholder.com/600x400';
  const statusColor = {
    'Available': 'bg-green-100 text-green-800',
    'Sold': 'bg-red-100 text-red-800',
    'Pending': 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
        >
          ← Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-lg p-6 shadow-lg">
          {/* Image Gallery */}
          <div>
            <div className="relative bg-gray-200 rounded-lg overflow-hidden h-96 flex items-center justify-center">
              <img
                src={currentImage}
                alt={car.title}
                className="w-full h-full object-cover"
              />
              {car.images && car.images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
                  >
                    ◀
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
                  >
                    ▶
                  </button>
                </>
              )}
            </div>
            {car.images && car.images.length > 1 && (
              <div className="mt-4 flex gap-2 overflow-x-auto">
                {car.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${car.title} ${idx + 1}`}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`h-20 w-20 object-cover rounded cursor-pointer border-2 ${
                      idx === currentImageIndex ? 'border-blue-600' : 'border-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Car Details */}
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-800">{car.title}</h1>
                <p className="text-gray-600 text-lg">{car.brand} {car.model} ({car.year})</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-bold ${statusColor[car.status] || 'bg-gray-100'}`}>
                {car.status}
              </span>
            </div>

            <p className="text-4xl font-bold text-blue-600 mb-6">₹{car.price.toLocaleString('en-IN')}</p>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-100 rounded-lg">
              <div>
                <p className="text-gray-600 text-sm">Fuel Type</p>
                <p className="font-bold text-lg">{car.fuelType}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Transmission</p>
                <p className="font-bold text-lg">{car.transmission}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Mileage</p>
                <p className="font-bold text-lg">{car.mileage.toLocaleString('en-IN')} km</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Year</p>
                <p className="font-bold text-lg">{car.year}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-lg mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{car.description}</p>
            </div>

            {/* Seller Info */}
            <div className="p-4 bg-blue-50 rounded-lg mb-6 border border-blue-200">
              <h3 className="font-bold text-lg mb-3">Seller Information</h3>
              {typeof car.seller === 'object' ? (
                <>
                  <p className="text-gray-800 mb-2"><strong>Name:</strong> {car.seller.name}</p>
                  <p className="text-gray-800 mb-2"><strong>Email:</strong> {car.seller.email}</p>
                  <p className="text-gray-800"><strong>Phone:</strong> {car.seller.phone || 'Not provided'}</p>
                </>
              ) : (
                <p className="text-gray-800"><strong>Seller ID:</strong> {car.seller}</p>
              )}
            </div>

            {/* Actions */}
            {isSeller() ? (
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/edit-car/${id}`)}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-bold transition"
                >
                  Edit Car
                </button>
                <button
                  onClick={handleDeleteCar}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-bold transition"
                >
                  Delete Car
                </button>
              </div>
            ) : (
              <>
                {!showOfferForm ? (
                  <button
                    onClick={() => setShowOfferForm(true)}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-bold transition text-lg"
                  >
                    Make an Offer
                  </button>
                ) : (
                  <form onSubmit={handleMakeOffer} className="space-y-3">
                    <div>
                      <label className="block text-gray-700 font-bold mb-2">Your Offer Price (₹)</label>
                      <input
                        type="number"
                        value={offerPrice}
                        onChange={(e) => setOfferPrice(e.target.value)}
                        placeholder="Enter your offer price"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={offerLoading}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-bold disabled:bg-gray-400 transition"
                      >
                        {offerLoading ? 'Sending...' : 'Send Offer'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowOfferForm(false)}
                        className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 font-bold transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
