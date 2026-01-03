import axiosInstance from './axios.config';

export const carAPI = {
  // Get all cars
  getAllCars: async () => {
    return axiosInstance.get('/cars');
  },

  // Get car by ID
  getCarById: async (id) => {
    return axiosInstance.get(`/cars/${id}`);
  },

  // Create new car
  createCar: async (data) => {
    return axiosInstance.post('/cars', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Update car
  updateCar: async (id, data) => {
    return axiosInstance.put(`/cars/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete car
  deleteCar: async (id) => {
    return axiosInstance.delete(`/cars/${id}`);
  },

  // Get seller's cars (My Cars)
  getMyCars: async () => {
    return axiosInstance.get('/cars/user/mine');
  },

  // Alias for consistency
  getSellerCars: async () => {
    return axiosInstance.get('/cars/user/mine');
  },
};

export const authAPI = {
  // Register user
  register: async (userData) => {
    return axiosInstance.post('/auth/register', userData);
  },

  // Login user
  login: async (credentials) => {
    return axiosInstance.post('/auth/login', credentials);
  },

  // Get user profile
  getProfile: async () => {
    return axiosInstance.get('/auth/profile');
  },

  // Update user profile
  updateProfile: async (profileData) => {
    return axiosInstance.put('/auth/profile', profileData);
  },
};

export const offerAPI = {
  // Create offer
  createOffer: async (carId, offerData) => {
    return axiosInstance.post('/offers', { carId, ...offerData });
  },

  // Get offers for a car
  getOffersByCarId: async (carId) => {
    return axiosInstance.get(`/offers/car/${carId}`);
  },

  // Get my offers (buyer)
  getMyOffers: async () => {
    return axiosInstance.get('/offers/my-offers');
  },

  // Get offers received by seller
  getSellerOffers: async () => {
    return axiosInstance.get('/offers/seller-offers');
  },

  // Update offer status
  updateOfferStatus: async (offerId, status) => {
    return axiosInstance.put(`/offers/${offerId}`, { status });
  },
};
