import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import CarDetailPage from '../pages/CarDetailPage';
import AddCarPage from '../pages/AddCarPage';
import SearchPage from '../pages/SearchPage';
import MyOffersPage from '../pages/MyOffersPage';
import MyMyCarsPage from '../pages/MyMyCarsPage';
import EditCarPage from '../pages/EditCarPage';
import ProfilePage from '../pages/ProfilePage';
import SellerOffersPage from '../pages/SellerOffersPage';
import ChatPage from '../pages/ChatPage';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/Loader';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" />;

  return children;
}

export default function AppRouter() {
  const { loading } = useAuth();

  if (loading) return <Loader />;

  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/car/:id" element={<CarDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-offers"
            element={
              <ProtectedRoute>
                <MyOffersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller-offers"
            element={
              <ProtectedRoute>
                <SellerOffersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:userId"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sell-car"
            element={
              <ProtectedRoute>
                <AddCarPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-cars"
            element={
              <ProtectedRoute>
                <MyMyCarsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-car/:id"
            element={
              <ProtectedRoute>
                <EditCarPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MainLayout>
    </Router>
  );
}
