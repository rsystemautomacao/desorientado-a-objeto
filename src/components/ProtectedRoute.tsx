import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, profileComplete, profileLoading } = useAuth();
  const location = useLocation();

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/?login=1" state={{ from: location.pathname }} replace />;
  }

  // Profile incomplete and not already on /perfil → force profile fill
  if (profileComplete === false && location.pathname !== '/perfil') {
    return <Navigate to="/perfil" replace />;
  }

  return <>{children}</>;
}
