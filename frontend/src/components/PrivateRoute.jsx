import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

const PrivateRoute = ({ children, allowedRoles }) => {
  const user = authService.getCurrentUser();
  const isAuthenticated = !!user;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role.toUpperCase();
  const hasRequiredRole = allowedRoles.includes(userRole);

  if (!hasRequiredRole) {
    // Rediriger vers le dashboard approprié en fonction du rôle
    const roleRoutes = {
      'ADMIN': '/admin-dashboard',
      'MANAGER': '/manager-dashboard',
      'EMPLOYE': '/employee-dashboard',
      'RESPONSABLE': '/responsable-dashboard'
    };

    const redirectPath = roleRoutes[userRole] || '/login';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default PrivateRoute; 