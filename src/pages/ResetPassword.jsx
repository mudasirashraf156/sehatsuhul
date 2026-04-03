import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

export default function ResetPassword() {
  const { token }             = useParams();
  const navigate              = useNavigate();
  const [password, setPassword]     = useState('');
  const [confirm, setConfirm]       = useState('');
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      return setError('Password must be at least 8 characters.');
    }
    if (password !== confirm) {
      return setError('Passwords do not match.');
    }

    setLoading(true);
    try {
      await axios.post(`/api/auth/reset-password/${token}`, { password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-v2-page">
      <div className="login-v2-body">
        <div className="login-v2-form-wrap">

          {success ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: 'var(--slate)', marginBottom: 10 }}>
                Password Reset!
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
                Your password has been updated. Redirecting you to login…
              </p>
              <Link to="/login" className="login-v2-submit login-v2-submit--teal" style={{ display: 'block', textDecoration: 'none', textAlign: 'center' }}>
                Go to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="login-v2-form-header">
                <span>🔑</span>
                <div>
                  <h2>Set New Password</h2>
                  <p>Choose a strong password for your account.</p>
                </div>
              </div>

              {error && (
                <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>
              )}

              <form className="login-v2-form" onSubmit={submit}>
                <div className="field">
                  <label>New Password</label>
                  <input
                    type="password"
                    placeholder="Minimum 8 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="field">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Repeat your new password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="login-v2-submit login-v2-submit--teal"
                  disabled={loading}
                >
                  {loading ? 'Updating…' : '🔐 Reset Password'}
                </button>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
