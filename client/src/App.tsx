import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ComparisonProvider } from './contexts/ComparisonContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Hotels from './pages/Hotels';
import HotelMap from './pages/HotelMap';
import UserProfile from './pages/UserProfile';
import HotelDetails from './pages/HotelDetails';
import OfferDetails from './pages/OfferDetails';
import OfferComparison from './pages/OfferComparison';
import SharedComparison from './pages/SharedComparison';
import TravelGroups from './pages/TravelGroups';
import FAQ from './pages/FAQ';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ComparisonProvider>
          <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/hotels" element={
            <ProtectedRoute>
              <Hotels />
            </ProtectedRoute>
          } />
          <Route path="/hotels/:slug" element={
            <ProtectedRoute>
              <HotelDetails />
            </ProtectedRoute>
          } />
          <Route path="/offers/:id" element={
            <ProtectedRoute>
              <OfferDetails />
            </ProtectedRoute>
          } />
          <Route path="/compare" element={
            <ProtectedRoute>
              <OfferComparison />
            </ProtectedRoute>
          } />
          <Route path="/compare/shared/:shareToken" element={<SharedComparison />} />
          <Route path="/map" element={
            <ProtectedRoute>
              <HotelMap />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />
          <Route path="/travel-groups" element={
            <ProtectedRoute>
              <TravelGroups />
            </ProtectedRoute>
          } />

          {/* Public Content Pages */}
          <Route path="/faq" element={<FAQ />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />

          <Route path="*" element={<div className="flex items-center justify-center h-screen bg-slate-950 text-white">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-2">404</h1>
              <p className="text-slate-400">Strona nie znaleziona</p>
            </div>
          </div>} />
        </Routes>
        </BrowserRouter>
        </ComparisonProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
