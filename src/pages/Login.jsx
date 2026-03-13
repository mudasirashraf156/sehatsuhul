import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const [params] = useSearchParams();
  const [role, setRole] = useState(params.get('role') || 'patient');
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const user = await login(form.email, form.password, role);
      navigate(user.role === 'nurse' ? '/nurse/dashboard' : user.role === 'admin' ? '/admin' : '/patient/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-wrap">
        <div className={`auth-side ${role}`}>
          <div className="as-deco"/>
          <div className="as-icon">{role === 'patient' ? '🏥' : role === 'nurse' ? '👩‍⚕️' : '⚙️'}</div>
          <h2>{role === 'patient' ? 'Your Health,\nOur Priority' : role === 'nurse' ? 'Welcome Back,\nCaregiver' : 'Admin\nPortal'}</h2>
          <p>{role === 'patient'
            ? 'Book certified nurses and lab tests from the comfort of your home. 24/7.'
            : role === 'nurse' ? 'Manage your bookings, availability, and patient care all in one place.'
            : 'Manage the SehatSuhul platform, verify nurses, and monitor bookings.'}</p>
          <div className="as-trust">
            <span>✅ Secure Login</span>
            <span>🔒 JWT Protected</span>
          </div>
        </div>

        <div className="auth-form-panel">
          <Link to="/" className="auth-back">← Back to Home</Link>
          <h1>Sign In</h1>
          <p className="auth-sub">Welcome back! Please enter your details.</p>

          <div className="role-tabs">
            {['patient','nurse'].map(r => (
              <button key={r} className={role === r ? 'active' : ''} onClick={() => setRole(r)}>
                {r === 'patient' ? '🙋 Patient' : r === 'nurse' ? '👩‍⚕️ Nurse' : '⚙️ Admin'}
              </button>
            ))}
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={submit}>
            <div className="field">
              <label>Email Address</label>
              <input type="email" placeholder="you@email.com" value={form.email}
                onChange={e => setForm({...form, email: e.target.value})} required />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" placeholder="Your password" value={form.password}
                onChange={e => setForm({...form, password: e.target.value})} required />
            </div>
            <button type="submit" className={`auth-submit ${role}`} disabled={loading}>
              {loading ? <span className="spinner"/> : `Login as ${role.charAt(0).toUpperCase()+role.slice(1)}`}
            </button>
          </form>

          <p className="auth-switch">Don't have an account? <Link to={`/register?role=${role}`}>Create one →</Link></p>
          {role !== 'admin' && (
            <div className="demo-box">
              <strong>Demo credentials:</strong>
              {role === 'patient' ? ' patient@test.com' : ' sara@nurse.com'} / password123
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
