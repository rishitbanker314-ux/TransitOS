import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../lib/contexts/AuthContext';

export function ProtectedRoute() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center bg-[#111] text-white">Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}
