import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';
import axios from 'axios';
export default function Register() {
  const [params] = useSearchParams();
  const [role, setRole] = useState(params.get('role') || 'patient');
  const [form, setForm] = useState({ firstName:'',lastName:'',email:'',phone:'',password:'',city:'',specialization:'',licenseNumber:'' });
  const [error, setError] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const h = e => setForm({...form, [e.target.name]: e.target.value});
  const [success, setSuccess] = useState(false);
const submit = async (e) => {
  e.preventDefault();
  if (form.password.length < 8) {
    setError('Password must be at least 8 characters');
    return; // Add return here to stop execution
  }
  setError(''); 
  setLoading(true);
  try {
    await axios.post('/api/auth/register', { ...form, role });
    setSuccess(true);
  } catch (err) {
    console.error('Registration error:', err.response?.data);
    setError(err.response?.data?.message || 'Registration failed');
    setLoading(false); // Add this to stop loading on error
    return; // Return early to prevent success state
  }
  setLoading(false); // This will only run if try block succeeds
};

  const sideContent = {
    patient: {
      icon: '🙋',
      title: 'Join SehatSehul',
      desc: 'Get access to hundreds of certified nurses. Book in minutes, care at your door.',
      steps: null,
    },
    nurse: {
      icon: '👩‍⚕️',
      title: 'Join Our\nCare Network',
      desc: 'Register your credentials, get verified, and start receiving patient bookings near you.',
      steps: ['1. Fill your details', '2. License verified by admin', '3. Profile goes live!'],
    },
    shopOwner: {
      icon: '🏪',
      title: 'List Your\nMedical Shop',
      desc: 'Register your shop on SehatSehul and reach thousands of patients across J&K.',
      steps: ['1. Create your account', '2. Fill shop details & pay ₹99', '3. Admin approves & shop goes live!'],
    },
  };

  const { icon, title, desc, steps } = sideContent[role];
  if (success) return (
  <div className="auth-page">
    <div style={{maxWidth:480,margin:'60px auto',textAlign:'center',padding:'0 24px'}}>
      <div style={{fontSize:64,marginBottom:20}}>📧</div>
      <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:28,marginBottom:12}}>Check Your Email!</h2>
      <p style={{color:'var(--muted)',lineHeight:1.7,marginBottom:24}}>
        We sent a verification link to <strong>{form.email}</strong>.<br/>
        Click the link in the email to activate your account.
      </p>
      <div className="alert alert-info">ℹ️ Check your spam folder if you don't see it within a few minutes.</div>
      <Link to="/login" className="btn btn-teal" style={{marginTop:20,display:'inline-flex'}}>Go to Login →</Link>
    </div>
  </div>
);
  return (
    <div className="auth-page">
      <div className="auth-wrap">

        {/* Side Panel */}
        <div className={`auth-side ${role === 'shopOwner' ? 'patient' : role}`}>
          <div className="as-deco"/>
          <div className="as-icon">{icon}</div>
          <h2>{title}</h2>
          <p>{desc}</p>
          {steps && (
            <div className="as-steps">
              {steps.map((s, i) => <div key={i}>{s}</div>)}
            </div>
          )}
        </div>

        {/* Form Panel */}
        <div className="auth-form-panel">
          <Link to="/" className="auth-back">← Back to Home</Link>
          <h1>Create Account</h1>
          <p className="auth-sub">Join thousands of users on SehatSehul</p>

          {/* Role Tabs */}
          <div className="role-tabs" style={{marginBottom:'20px'}}>
            <button className={role === 'patient'   ? 'active' : ''} onClick={() => { setRole('patient');   setError(''); }}>🙋 Patient</button>
            <button className={role === 'nurse'     ? 'active' : ''} onClick={() => { setRole('nurse');     setError(''); }}>👩‍⚕️ Nurse</button>
            <button className={role === 'shopOwner' ? 'active' : ''} onClick={() => { setRole('shopOwner'); setError(''); }}>🏪 Shop Owner</button>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={submit}>
            <div className="form-row">
              <div className="field"><label>First Name</label><input name="firstName" placeholder="Ahmed" value={form.firstName} onChange={h} required/></div>
              <div className="field"><label>Last Name</label><input name="lastName" placeholder="Khan" value={form.lastName} onChange={h} required/></div>
            </div>
            <div className="field"><label>Phone Number</label><input name="phone" type="tel" placeholder="+91 70061 88346" value={form.phone} onChange={h} required/></div>
            <div className="field"><label>Email Address</label><input name="email" type="email" placeholder="you@email.com" value={form.email} onChange={h} required/></div>
            <div className="field">
              <label>City</label>
              <select name="city" value={form.city} onChange={h} required>
                <option value="">Select your city</option>
                {['Srinagar','Budgam','Beerwah','Baramulla','Anantnag','Pulwama','Ganderbal','Kupwara','Bandipora'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="field"><label>Password</label><input name="password" type="password" placeholder="Min. 8 characters" value={form.password} onChange={h} required/></div>

            {/* Nurse-only fields */}
            {role === 'nurse' && <>
              <div className="field">
                <label>Specialization</label>
                <select name="specialization" value={form.specialization} onChange={h} required>
                  <option value="">Select specialization</option>
                  {['General Nursing','ICU / Critical Care','Pediatric Nursing','Midwifery','Wound Care','Phlebotomy','Elderly Care','Post-Op Care'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="field"><label>PNC License Number</label><input name="licenseNumber" placeholder="Srinagar Nursing Council No." value={form.licenseNumber} onChange={h} required/></div>
              <div className="alert alert-info">ℹ️ Your license will be verified within 24 hours before your profile goes live.</div>
            </>}

            {/* Shop Owner-only info */}
            {role === 'shopOwner' && (
              <div className="alert alert-info">
                🏪 After registering, you can list your medical shop from your dashboard. A one-time fee of ₹99/Month applies for listing.
              </div>
            )}
<div className="terms-check-wrap">
  <label className="terms-check-label">
    <input
      type="checkbox"
      checked={agreed}
      onChange={e => setAgreed(e.target.checked)}
      required
    />
    <span>
      I have read and agree to the{' '}
      <a href="/terms" target="_blank" rel="noreferrer">Terms & Conditions</a>
      {' '}and{' '}
      <a href="/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>
      {' '}of SehatSehul
    </span>
  </label>
</div>
           <button
  type="submit"
  className={`auth-submit ${role === 'shopOwner' ? 'patient' : role}`}
  disabled={loading || !agreed}
>
  {loading ? <span className="spinner"/> : `Create ${role === 'patient' ? 'Patient' : role === 'nurse' ? 'Nurse' : 'Shop Owner'} Account`}
</button>
          </form>

          <p className="auth-switch">Already have an account? <Link to={`/login?role=${role}`}>Sign in →</Link></p>
        </div>

      </div>
    </div>
  );
}