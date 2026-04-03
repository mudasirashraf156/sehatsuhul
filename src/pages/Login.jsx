import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Auth.css';

const ROLES = [
  {
    key: 'patient',
    icon: '🏥',
    color: 'teal',
    title: 'Patient',
    desc: 'Book certified nurses, lab tests and medicines from home. Available 24/7.',
    btnText: 'Login as Patient',
  },
  {
    key: 'nurse',
    icon: '👩‍⚕️',
    color: 'rose',
    title: 'Nurse',
    desc: 'Manage your bookings, availability, and patient care all in one place.',
    btnText: 'Login as Nurse',
  },
  {
    key: 'shopOwner',
    icon: '💊',
    color: 'teal',
    title: 'Pharmacist',
    desc: 'Manage your pharmacy listing, medicines and orders all in one place.',
    btnText: 'Login as Pharmacist',
  },
];

export default function Login() {
  const [role, setRole] = useState(null);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [errorData, setErrorData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setErrorData(null);
    setLoading(true);
    try {
      const user = await login(form.email, form.password, role);
      navigate(
        user.role === 'nurse'     ? '/nurse/dashboard' :
        user.role === 'shopOwner' ? '/shop/dashboard'  :
        '/patient/dashboard'
      );
    } catch (err) {
      const errorResponse = err.response?.data;
      setError(errorResponse?.message || 'Login failed. Check your credentials.');
      if (errorResponse?.notVerified) setErrorData(errorResponse);
    } finally {
      setLoading(false);
    }
  };

  const selected = ROLES.find(r => r.key === role);

  return (
    <div className="login-v2-page">

      <div className="login-v2-body">

        {/* Card Selection */}
        {!role && (
          <>
            <div className="login-v2-headline">
              <h1>Welcome Back 👋</h1>
              <p>Choose your role to sign in to SehatSehul</p>
            </div>
            <div className="login-v2-cards">
              {ROLES.map(r => (
                <div
                  key={r.key}
                  className={`login-v2-card login-v2-card--${r.color}`}
                  onClick={() => { setRole(r.key); setError(''); setErrorData(null); }}
                >
                  <div className="lv2-card-icon">{r.icon}</div>
                  <div className="lv2-card-body">
                    <h3>{r.title}</h3>
                    <p>{r.desc}</p>
                  </div>
                  <div className="lv2-card-btn">{r.btnText}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {!role && (
          <p className="auth-switch" style={{ marginTop: 24, textAlign: 'center' }}>
            Don't have an account?{' '}
            <Link to="/register">Create one →</Link>
          </p>
        )}

        {/* Login Form */}
        {role && selected && (
          <div className="login-v2-form-wrap">
            <button className="login-v2-back" onClick={() => { setRole(null); setError(''); setErrorData(null); }}>
              ← Back to roles
            </button>

            <div className={`login-v2-form-header${selected.color === 'rose' ? ' login-v2-form-header--rose' : ''}`}>
              <span>{selected.icon}</span>
              <div>
                <h2>{selected.title} Login</h2>
                <p>{selected.desc}</p>
              </div>
            </div>

            {error && (
              <div className="alert alert-error" style={{ marginBottom: 16 }}>
                {error}
                {errorData?.notVerified && (
                  <button
                    style={{ marginLeft: 8, color: 'var(--teal)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
                    onClick={async () => {
                      try {
                        await axios.post('/api/auth/resend-verification', { email: form.email });
                        alert('Verification email resent! Check your inbox.');
                      } catch {
                        alert('Failed to resend verification email. Please try again.');
                      }
                    }}
                  >
                    Resend email →
                  </button>
                )}
              </div>
            )}

            <form className="login-v2-form" onSubmit={submit}>
              <div className="field">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
                <div style={{ textAlign: 'right', marginTop: 6 }}>
                  <Link to="/forgot-password" style={{ fontSize: 12, color: 'var(--teal)', fontWeight: 600, textDecoration: 'none' }}>Forgot password?</Link>
                </div>
              </div>
              <button
                type="submit"
                className={`login-v2-submit login-v2-submit--${selected.color}`}
                disabled={loading}
              >
                {loading ? <span className="spinner" /> : selected.btnText}
              </button>
            </form>

            <p className="auth-switch" style={{ marginTop: 20, textAlign: 'center' }}>
              Don't have an account?{' '}
              <Link to={`/register?role=${role}`}>Create one →</Link>
            </p>
          </div>
        )}

      </div>
    </div>
  );
}