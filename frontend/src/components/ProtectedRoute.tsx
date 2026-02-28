import type { JSX } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export const OtpProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  if (!location.state?.email) {
    return <Navigate to="/" replace />;
  }

  return children;
};