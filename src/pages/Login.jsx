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
      navigate(
        user.role === 'nurse'      ? '/nurse/dashboard' :
        user.role === 'shopOwner'  ? '/shop/dashboard'  :
        '/patient/dashboard'
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    }
    setLoading(false);
  };

  const sideContent = {
    patient: {
      icon: '🏥',
      title: 'Your Health,\nOur Priority',
      desc: 'Book certified nurses and lab tests from the comfort of your home. Available 24/7.',
    },
    nurse: {
      icon: '👩‍⚕️',
      title: 'Welcome Back,\nCaregiver',
      desc: 'Manage your bookings, availability, and patient care all in one place.',
    },
    shopOwner: {
      icon: '🏪',
      title: 'Welcome Back,\nShop Owner',
      desc: 'Manage your medical shop listing, track customers and grow your business.',
    },
  };

  const tabs = [
    { key: 'patient',   label: '🙋 Patient'    },
    { key: 'nurse',     label: '👩‍⚕️ Nurse'      },
    { key: 'shopOwner', label: '🏪 Shop Owner'  },
  ];

  const btnLabel = {
    patient:   'Login as Patient',
    nurse:     'Login as Nurse',
    shopOwner: 'Login as Shop Owner',
  };

  const demoAccounts = {
    patient:   'patient@test.com',
    nurse:     'sara@nurse.com',
    shopOwner: 'Register a shop first',
  };

  const { icon, title, desc } = sideContent[role];

  return (
    <div className="auth-page">
      <div className="auth-wrap">

        {/* Side Panel */}
        <div className={`auth-side ${role}`}>
          <div className="as-deco"/>
          <div className="as-icon">{icon}</div>
          <h2>{title}</h2>
          <p>{desc}</p>
          <div className="as-trust">
            <span>✅ Secure Login</span>
            <span>🔒 JWT Protected</span>
          </div>
          {role === 'shopOwner' && (
            <div className="as-steps" style={{marginTop:20}}>
              <div>🏪 List your medical shop</div>
              <div>📍 Reach customers in J&K</div>
              <div>✅ Admin verified listing</div>
            </div>
          )}
        </div>

        {/* Form Panel */}
        <div className="auth-form-panel">
          <Link to="/" className="auth-back">← Back to Home</Link>
          <h1>Sign In</h1>
          <p className="auth-sub">Welcome back! Please enter your details.</p>

          {/* Role Tabs */}
          <div className="role-tabs">
            {tabs.map(t => (
              <button
                key={t.key}
                className={role === t.key ? 'active' : ''}
                onClick={() => { setRole(t.key); setError(''); }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={submit}>
            <div className="field">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="you@email.com"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                required
              />
            </div>
            <div className="field">
              <label>Password</label>
              <input
                type="password"
                placeholder="Your password"
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                required
              />
            </div>
            <button
              type="submit"
              className={`auth-submit ${role === 'shopOwner' ? 'patient' : role}`}
              disabled={loading}
            >
              {loading ? <span className="spinner"/> : btnLabel[role]}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account?{' '}
            <Link to={`/register?role=${role}`}>Create one →</Link>
          </p>

         
        </div>

      </div>
    </div>
  );
}