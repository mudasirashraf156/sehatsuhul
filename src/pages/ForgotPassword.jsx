import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

export default function ForgotPassword() {
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post('/api/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-v2-page">
      <div className="login-v2-body">
        <div className="login-v2-form-wrap">

          {sent ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>📬</div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: 'var(--slate)', marginBottom: 10 }}>
                Check your inbox
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
                If <strong>{email}</strong> is registered, we've sent a password reset link. It expires in <strong>1 hour</strong>.
              </p>
              <Link to="/login" className="login-v2-submit login-v2-submit--teal" style={{ display: 'block', textDecoration: 'none', textAlign: 'center' }}>
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <Link to="/login" className="login-v2-back">← Back to Login</Link>

              <div className="login-v2-form-header">
                <span>🔐</span>
                <div>
                  <h2>Forgot Password?</h2>
                  <p>Enter your email and we'll send you a reset link.</p>
                </div>
              </div>

              {error && (
                <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>
              )}

              <form className="login-v2-form" onSubmit={submit}>
                <div className="field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="login-v2-submit login-v2-submit--teal"
                  disabled={loading}
                >
                  {loading ? 'Sending…' : '📧 Send Reset Link'}
                </button>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
