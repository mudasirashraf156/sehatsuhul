import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function PrivateRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loader">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    const path = user.role === 'nurse' ? '/nurse/dashboard' : user.role === 'admin' ? '/admin' : '/patient/dashboard';
    return <Navigate to={path} replace />;
  }
  return children;
}

export function Stars({ rating, size = 14 }) {
  return (
    <span className="stars" style={{ fontSize: size }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= Math.round(rating) ? '#f59e0b' : '#e2e8f0' }}>★</span>
      ))}
    </span>
  );
}

export function StatusBadge({ status }) {
  const map = {
    pending:     'badge-orange',
    confirmed:   'badge-blue',
    'in-progress':'badge-teal',
    completed:   'badge-green',
    cancelled:   'badge-rose',
  };
  return <span className={`badge ${map[status] || 'badge-gray'}`}>{status}</span>;
}
