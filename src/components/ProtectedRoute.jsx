import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { currentUser, initialized } = useAuth();

  if (!initialized) {
    return <div className="flex min-h-screen items-center justify-center text-slate-500">Loading your workspace...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}
