import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { usePortal } from '../context/PortalContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, currentUser, activePersona } = usePortal();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/portal/login" state={{ from: location }} replace />;
  }

  const user = currentUser || activePersona;
  const userRole = user.role;

  // Determine home path by role
  const getHomePath = (role: UserRole) => {
    if (role === 'telecaller') return '/portal/telecaller';
    if (role === 'developer') return '/portal/tasks';
    return '/portal';
  };

  if (allowedRoles && allowedRoles.length > 0) {
    const isAllowed = allowedRoles.includes(userRole) || (userRole === 'super_admin' && allowedRoles.includes('admin'));
    if (!isAllowed) {
      return <Navigate to={getHomePath(userRole)} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
