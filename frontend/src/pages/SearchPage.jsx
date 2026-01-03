import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import { offerAPI } from '../api/car.api';
import { useAuth } from '../hooks/useAuth';

export default function MyOffersPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchMyOffers();
    }
  }, [user]);

  const fetchMyOffers = async () => {
    try {
      setLoading(true);
      console.log('Fetching my offers...');
      const response = await offerAPI.getMyOffers();
      console.log('My offers response:', response);
      console.log('Response data:', response.data);
      
      let offersData = [];
      if (response.data.data?.offers) {
        offersData = response.data.data.offers;
      } else if (response.data.offers) {
        offersData = response.data.offers;
      } else if (Array.isArray(response.data)) {
        offersData = response.data;
      }
      
      console.log('Offers data:', offersData);
      setOffers(offersData);
      setError(null);
    } catch (err) {
      console.error('Error fetching offers:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">💰 My Offers</h1>
          <p className="text-gray-600">Track all the offers you've made on cars</p>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-6 shadow">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {offers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🚗</div>
            <p className="text-gray-600 text-lg mb-6">You haven't made any offers yet</p>
            <p className="text-gray-500 mb-6">Start browsing cars and make your first offer!</p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg hover:shadow-lg font-bold transition transform hover:scale-105"
            >
              🔍 Browse Cars Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {offers.map((offer) => (
              <div key={offer._id} className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
                
                {/* Car Image */}
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  {offer.car.images && offer.car.images.length > 0 ? (
                    <img
                      src={offer.car.images[0]}
                      alt={offer.car.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                      <span className="text-white text-4xl">🚗</span>
                    </div>
                  )}
                  <div className={`absolute top-3 right-3 px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(offer.status)}`}>
                    {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  {/* Car Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-1 cursor-pointer hover:text-blue-600 transition"
                      onClick={() => navigate(`/car/${offer.car._id}`)}>
                    {offer.car.title}
                  </h3>
                  
                  {/* Car Details */}
                  <div className="flex items-center gap-4 mb-4 text-gray-600">
                    <span className="text-sm">{offer.car.brand}</span>
                    <span className="text-sm">{offer.car.model}</span>
                    <span className="text-sm font-semibold text-blue-600">({offer.car.year})</span>
                  </div>

                  {/* Pricing Section */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-4 border border-blue-100">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 font-medium">Asking Price:</span>
                      <span className="font-bold text-gray-900">₹{offer.car.price.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 font-medium">Your Offer:</span>
                      <span className="font-bold text-lg text-blue-600">₹{offer.offerPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-blue-200">
                      <span className="text-sm text-gray-600">
                        Difference: 
                        <span className={`font-bold ml-2 ${offer.offerPrice < offer.car.price ? 'text-green-600' : 'text-red-600'}`}>
                          {offer.offerPrice < offer.car.price ? '−' : '+'}₹{Math.abs(offer.car.price - offer.offerPrice).toLocaleString('en-IN')}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Car Specs */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-gray-500 text-xs">Mileage</p>
                      <p className="font-semibold text-gray-800">{offer.car.mileage.toLocaleString()} km</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-gray-500 text-xs">Transmission</p>
                      <p className="font-semibold text-gray-800">{offer.car.transmission}</p>
                    </div>
                  </div>

                  {/* Date */}
                  <p className="text-xs text-gray-400 mb-4">
                    Offered on: {new Date(offer.createdAt).toLocaleDateString('en-IN', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>

                  {/* Action Buttons */}
                  {offer.status === 'accepted' ? (
                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate(`/chat/${offer.car.seller._id}`)}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2 rounded-lg hover:shadow-lg font-bold transition transform hover:scale-105"
                      >
                        💬 Chat with Seller
                      </button>
                      <button
                        onClick={() => navigate(`/car/${offer.car._id}`)}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded-lg hover:shadow-lg font-bold transition transform hover:scale-105"
                      >
                        📋 Car Details
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => navigate(`/car/${offer.car._id}`)}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:shadow-lg font-bold transition transform hover:scale-105"
                    >
                      📋 View Car Details
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
