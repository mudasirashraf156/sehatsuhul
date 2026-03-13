import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Register() {
  const [params] = useSearchParams();
  const [role, setRole] = useState(params.get('role') || 'patient');
  const [form, setForm] = useState({ firstName:'',lastName:'',email:'',phone:'',password:'',city:'',specialization:'',licenseNumber:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const h = e => setForm({...form, [e.target.name]: e.target.value});

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) return setError('Password must be at least 8 characters');
    setError(''); setLoading(true);
    try {
      const user = await register({ ...form, role });
      navigate(user.role === 'nurse' ? '/nurse/dashboard' : '/patient/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-wrap">
        <div className={`auth-side ${role}`}>
          <div className="as-deco"/>
          <div className="as-icon">{role === 'patient' ? '🙋' : '👩‍⚕️'}</div>
          <h2>{role === 'patient' ? 'Join SehatSuhul' : 'Join Our\nCare Network'}</h2>
          <p>{role === 'patient'
            ? 'Get access to hundreds of certified nurses. Book in minutes, care at your door.'
            : 'Register your credentials, get verified, and start receiving patient bookings near you.'}</p>
          {role === 'nurse' && (
            <div className="as-steps">
              <div>1. Fill your details</div>
              <div>2. License verified by admin</div>
              <div>3. Profile goes live!</div>
            </div>
          )}
        </div>

        <div className="auth-form-panel">
          <Link to="/" className="auth-back">← Back to Home</Link>
          <h1>Create Account</h1>
          <p className="auth-sub">Join thousands of users on SehatSuhul</p>

          <div className="role-tabs" style={{marginBottom:'20px'}}>
            <button className={role === 'patient' ? 'active' : ''} onClick={() => setRole('patient')}>🙋 Patient</button>
            <button className={role === 'nurse' ? 'active' : ''} onClick={() => setRole('nurse')}>👩‍⚕️ Nurse</button>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={submit}>
            <div className="form-row">
              <div className="field"><label>First Name</label><input name="firstName" placeholder="Ahmed" value={form.firstName} onChange={h} required/></div>
              <div className="field"><label>Last Name</label><input name="lastName" placeholder="Khan" value={form.lastName} onChange={h} required/></div>
            </div>
            <div className="field"><label>Phone Number</label><input name="phone" type="tel" placeholder="+92 300 0000000" value={form.phone} onChange={h} required/></div>
            <div className="field"><label>Email Address</label><input name="email" type="email" placeholder="you@email.com" value={form.email} onChange={h} required/></div>
            <div className="field"><label>City</label>
              <select name="city" value={form.city} onChange={h} required>
                <option value="">Select your city</option>
                {['Srinagar', 'Budgam', 'Beerwah', 'Baramulla', 'Anantnag', 'Pulwama', 'Ganderbal', 'Kupwara', 'Bandipora'].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="field"><label>Password</label><input name="password" type="password" placeholder="Min. 8 characters" value={form.password} onChange={h} required/></div>

            {role === 'nurse' && <>
              <div className="field"><label>Specialization</label>
                <select name="specialization" value={form.specialization} onChange={h} required>
                  <option value="">Select specialization</option>
                  {['General Nursing','ICU / Critical Care','Pediatric Nursing','Midwifery','Wound Care','Phlebotomy','Elderly Care','Post-Op Care'].map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="field"><label>PNC License Number</label><input name="licenseNumber" placeholder="Srinagar Nursing Council No." value={form.licenseNumber} onChange={h} required/></div>
              <div className="alert alert-info">ℹ️ Your license will be verified within 24 hours before your profile goes live.</div>
            </>}

            <button type="submit" className={`auth-submit ${role}`} disabled={loading}>
              {loading ? <span className="spinner"/> : `Create ${role === 'patient' ? 'Patient' : 'Nurse'} Account`}
            </button>
          </form>
          <p className="auth-switch">Already have an account? <Link to={`/login?role=${role}`}>Sign in →</Link></p>
        </div>
      </div>
    </div>
  );
}
