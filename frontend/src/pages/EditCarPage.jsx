import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import { carAPI } from '../api/car.api';
import { useAuth } from '../hooks/useAuth';

export default function EditCarPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [car, setCar] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    mileage: '',
    fuelType: 'Petrol',
    transmission: 'Manual',
    description: '',
  });

  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user && id) {
      fetchCar();
    }
  }, [id, user]);

  const fetchCar = async () => {
    try {
      setLoading(true);
      const response = await carAPI.getCarById(id);
      const carData = response.data.car;
      
      // Wait for user to load if not available yet
      if (!user) {
        console.log('User not loaded yet, waiting...');
        return;
      }

      // Check if user is the seller
      if (!carData || !carData.seller) {
        setError('Unable to load car data');
        return;
      }

      const sellerId = typeof carData.seller === 'object' ? carData.seller._id : carData.seller;
      const userId = typeof user === 'object' ? user._id : user;

      console.log('Seller ID:', sellerId, 'User ID:', userId);

      if (sellerId !== userId) {
        setError('You can only edit your own cars');
        setTimeout(() => navigate('/my-cars'), 2000);
        return;
      }

      setCar(carData);
      setFormData({
        title: carData.title,
        brand: carData.brand,
        model: carData.model,
        year: carData.year,
        price: carData.price,
        mileage: carData.mileage,
        fuelType: carData.fuelType,
        transmission: carData.transmission,
        description: carData.description,
      });
      setExistingImages(carData.images || []);
      setError(''); // Clear any previous errors
    } catch (err) {
      setError('Failed to load car details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'year' || name === 'price' || name === 'mileage' ? parseInt(value) : value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (existingImages.length + newImages.length + files.length > 5) {
      setError('Maximum 5 images allowed (including existing images)');
      return;
    }

    const updatedNewImages = [...newImages, ...files];
    setNewImages(updatedNewImages);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setNewImagePreviews([...newImagePreviews, ...newPreviews]);
    setError('');
  };

  const removeNewImage = (index) => {
    const updatedImages = newImages.filter((_, i) => i !== index);
    const updatedPreviews = newImagePreviews.filter((_, i) => i !== index);
    setNewImages(updatedImages);
    setNewImagePreviews(updatedPreviews);
  };

  const removeExistingImage = (index) => {
    const updatedImages = existingImages.filter((_, i) => i !== index);
    setExistingImages(updatedImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (existingImages.length === 0 && newImages.length === 0) {
      setError('Please keep at least one image');
      return;
    }

    setUpdating(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('brand', formData.brand);
      formDataToSend.append('model', formData.model);
      formDataToSend.append('year', formData.year);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('mileage', formData.mileage);
      formDataToSend.append('fuelType', formData.fuelType);
      formDataToSend.append('transmission', formData.transmission);
      formDataToSend.append('description', formData.description);

      newImages.forEach((image) => {
        formDataToSend.append('images', image);
      });

      formDataToSend.append('existingImages', JSON.stringify(existingImages));

      await carAPI.updateCar(id, formDataToSend);
      navigate(`/car/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update car');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Edit Car Listing</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2">Car Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2">Model</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">Year</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                min="1990"
                max={new Date().getFullYear()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">Mileage (km)</label>
              <input
                type="number"
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2">Fuel Type</label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option>Petrol</option>
                <option>Diesel</option>
                <option>CNG</option>
                <option>Hybrid</option>
                <option>Electric</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">Transmission</label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option>Manual</option>
                <option>Automatic</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          {existingImages.length > 0 && (
            <div>
              <label className="block text-gray-700 font-bold mb-2">Current Images</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {existingImages.map((img, index) => (
                  <div key={index} className="relative">
                    <img src={img} alt={`Current ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Add New Images ({existingImages.length + newImages.length}/5)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-4 py-3 border-2 border-dashed border-blue-600 rounded-lg text-blue-600 font-bold hover:bg-blue-50 transition"
            >
              + Add More Images
            </button>
          </div>

          {newImagePreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {newImagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img src={preview} alt={`New ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={updating}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-bold disabled:bg-gray-400 transition text-lg"
            >
              {updating ? 'Updating...' : 'Update Car'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/car/${id}`)}
              className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 font-bold transition text-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
