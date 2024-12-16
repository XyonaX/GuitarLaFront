import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuthStore } from "../../store/authStore";

interface PrivateRouteProps {
  children: ReactNode; // Define que `children` es un nodo de React
  requiredRole?: string; // `requiredRole` es opcional y de tipo string
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredRole }) => {
  const { role } = useAuthStore();

  if (!role) {
    // Redirigir al login si no está autenticado
    return <Navigate to="/login" />;
  }

  if (requiredRole && role !== requiredRole) {
    // Redirigir si el rol no coincide
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
