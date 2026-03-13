import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const user = await login(form.email, form.password, 'admin');
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div style={{minHeight:'calc(100vh - 68px)',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg)',padding:'40px 24px'}}>
      <div style={{width:'100%',maxWidth:'400px'}}>
        <div style={{textAlign:'center',marginBottom:'32px'}}>
          <div style={{fontSize:'48px',marginBottom:'12px'}}>⚙️</div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'28px',color:'var(--slate)',marginBottom:'6px'}}>Admin Portal</h1>
          <p style={{color:'var(--muted)',fontSize:'13px'}}>Restricted access — authorized personnel only</p>
        </div>

        <div className="card">
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={submit}>
            <div className="field">
              <label>Admin Email</label>
              <input type="email" placeholder="admin@sehatsuhul.pk"
                value={form.email} onChange={e => setForm({...form, email: e.target.value})} required/>
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" placeholder="••••••••"
                value={form.password} onChange={e => setForm({...form, password: e.target.value})} required/>
            </div>
            <button type="submit" disabled={loading}
              style={{width:'100%',padding:'13px',background:'#1e293b',color:'white',border:'none',borderRadius:'12px',fontSize:'15px',fontWeight:'600',cursor:'pointer',fontFamily:"'DM Sans',sans-serif",display:'flex',alignItems:'center',justifyContent:'center',gap:'8px'}}>
              {loading ? <span className="spinner"/> : '🔐 Login as Admin'}
            </button>
          </form>
        </div>

        <p style={{textAlign:'center',fontSize:'12px',color:'var(--muted2)',marginTop:'20px'}}>
          This page is not publicly listed. Do not share this URL.
        </p>
      </div>
    </div>
  );
}