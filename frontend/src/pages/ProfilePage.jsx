import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authAPI } from '../api/car.api';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    photo: null,
    photoPreview: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        photo: null,
        photoPreview: user.profileImage || null,
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          photo: file,
          photoPreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const updateData = {
        name: formData.name,
        phone: formData.phone,
      };

      // If photo is selected, convert to base64 and include in update
      if (formData.photo) {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = async () => {
            updateData.profileImage = reader.result;
            try {
              const response = await authAPI.updateProfile(updateData);
              // Update the user context with the new data
              setUser(response.data.user);
              setSuccess('Profile updated successfully!');
              setIsEditing(false);
              setFormData(prev => ({
                ...prev,
                photoPreview: reader.result,
                photo: null,
              }));
            } catch (err) {
              setError(err.response?.data?.message || 'Failed to update profile');
            } finally {
              setLoading(false);
              resolve();
            }
          };
          reader.readAsDataURL(formData.photo);
        });
      } else {
        // Call API without photo
        const response = await authAPI.updateProfile(updateData);
        // Update the user context with the new data
        setUser(response.data.user);
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        setLoading(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-gray-600 text-lg mb-4">Please log in to view your profile</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg hover:shadow-lg font-bold transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
        >
          ← Back
        </button>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white relative">
            <h1 className="text-4xl font-bold mb-2">👤 My Profile</h1>
            <p className="text-blue-100">Manage your account information</p>
          </div>

          {/* Content */}
          <div className="p-8">
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}

            {!isEditing ? (
              /* Display Mode */
              <div className="space-y-6">
                {/* Profile Photo */}
                <div className="flex flex-col items-center">
                  <div className="mb-4 relative">
                    {formData.photoPreview ? (
                      <img
                        src={formData.photoPreview}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-blue-600"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-5xl border-4 border-blue-600">
                        👤
                      </div>
                    )}
                  </div>
                </div>

                {/* User Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold mb-1">NAME</p>
                    <p className="text-gray-900 text-lg font-bold">{formData.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-semibold mb-1">EMAIL</p>
                    <p className="text-gray-900 text-lg font-bold">{formData.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-semibold mb-1">PHONE</p>
                    <p className="text-gray-900 text-lg font-bold">{formData.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-semibold mb-1">USER ID</p>
                    <p className="text-gray-900 text-lg font-bold">{user._id}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:shadow-lg font-bold transition transform hover:scale-105"
                  >
                    ✏️ Edit Profile
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-lg hover:shadow-lg font-bold transition transform hover:scale-105"
                  >
                    🚪 Logout
                  </button>
                </div>
              </div>
            ) : (
              /* Edit Mode */
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                {/* Photo Upload */}
                <div className="flex flex-col items-center mb-6">
                  <div className="mb-4">
                    {formData.photoPreview ? (
                      <img
                        src={formData.photoPreview}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-blue-600"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-5xl border-4 border-blue-600">
                        📸
                      </div>
                    )}
                  </div>
                  <label className="cursor-pointer bg-blue-100 hover:bg-blue-200 text-blue-700 px-6 py-2 rounded-lg font-semibold transition">
                    📷 Change Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-gray-500 mt-2">Optional - Max 5MB</p>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      required
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      required
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg hover:shadow-lg font-bold transition transform hover:scale-105 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : '✅ Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 rounded-lg hover:shadow-lg font-bold transition transform hover:scale-105"
                  >
                    ❌ Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
