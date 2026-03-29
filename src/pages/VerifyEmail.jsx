import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const token = params.get('token');
    if (!token) { setStatus('error'); return; }
    axios.get(`/api/auth/verify-email?token=${token}`)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, []);

  return (
    <div style={{textAlign:'center',padding:'80px 24px',maxWidth:480,margin:'0 auto'}}>
      {status === 'loading' && <>
        <div style={{fontSize:48,marginBottom:16}}>⏳</div>
        <h2 style={{fontFamily:"'Playfair Display',serif"}}>Verifying your email…</h2>
      </>}
      {status === 'success' && <>
        <div style={{fontSize:64,marginBottom:20}}>✅</div>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:28,marginBottom:12}}>Email Verified!</h2>
        <p style={{color:'var(--muted)',marginBottom:24}}>Your account is now active. You can login now.</p>
        <Link to="/login" className="btn btn-teal">Login to SehatSehul →</Link>
      </>}
      {status === 'error' && <>
        <div style={{fontSize:64,marginBottom:20}}>❌</div>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:28,marginBottom:12}}>Link Expired</h2>
        <p style={{color:'var(--muted)',marginBottom:24}}>This verification link is invalid or expired.</p>
        <Link to="/register" className="btn btn-teal">Register Again →</Link>
      </>}
    </div>
  );
}