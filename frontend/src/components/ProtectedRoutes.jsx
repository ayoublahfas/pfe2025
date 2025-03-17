import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../services/authService';
import useInactivityTimer from '../hooks/useInactivityTimer';

const ProtectedRoutes = ({ allowedRoles = [] }) => {
  // Utiliser le hook d'inactivité
  useInactivityTimer();

  const user = authService.getCurrentUser();
  const token = localStorage.getItem('access_token');

  console.log('Current user:', user);
  console.log('Allowed roles:', allowedRoles);

  // Vérifier si l'utilisateur est connecté
  if (!user || !token) {
    console.log('No user or token, redirecting to login');
    return <Navigate to="/" replace />;
  }

  // Vérifier que le rôle est valide
  if (!authService.isValidRole(user.role)) {
    console.error('Invalid role detected:', user.role);
    authService.logout();
    return <Navigate to="/" replace />;
  }

  // Vérifier les rôles
  if (allowedRoles.length > 0) {
    console.log('User role:', user.role);
    
    const hasAccess = allowedRoles.includes(user.role);

    if (!hasAccess) {
      console.log('Access denied, redirecting to appropriate dashboard');
      // Rediriger vers le bon dashboard en fonction du rôle
      switch (user.role) {
        case 'ADMIN':
          return <Navigate to="/admin-dashboard" replace />;
        case 'EMPLOYE':
          return <Navigate to="/employee-dashboard" replace />;
        case 'MANAGER':
          return <Navigate to="/manager-dashboard" replace />;
        case 'RESPONSABLE':
          return <Navigate to="/responsable-dashboard" replace />;
        default:
          return <Navigate to="/" replace />;
      }
    }
  }

  // Si tout est OK, afficher les routes enfants
  return <Outlet />;
};

export default ProtectedRoutes; 