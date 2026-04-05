import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export default function ShopDashboard() {
  const { user } = useAuth();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/shops/my/shop')
      .then(r => { setShop(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="dash-page">
      <div className="dash-hero" style={{background:'linear-gradient(135deg,#0d9488,#14b8a6)'}}>
        <div className="container">
          <div className="dash-hero-inner">
            <div>
              <h1>Welcome, {user?.firstName} 🏪</h1>
              <p>Manage your medical shop listing</p>
            </div>
            {!shop && (
              <Link to="/shops/register" className="btn btn-white">+ List Your Shop</Link>
            )}
          </div>
        </div>
      </div>

      <div className="container dash-body">
        {loading ? <div className="page-loader">Loading…</div> : !shop ? (
          <div className="empty-state">
            <div className="empty-icon">🏪</div>
            <h3>No Shop Listed Yet</h3>
            <p>Register your medical shop to start receiving customers</p>
            <Link to="/shops/register" className="btn btn-teal" style={{marginTop:16}}>
              + Register Your Shop
            </Link>
          </div>
        ) : (
          <div>
            {/* Status banner */}
            {shop.status === 'pending' && (
              <div className="alert alert-warning" style={{marginBottom:24}}>
                ⏳ Your shop is <strong>pending admin approval</strong>. We'll notify you within 24 hours.
                {!shop.isPaid && <span> · <strong>Payment not confirmed yet.</strong></span>}
              </div>
            )}
            {shop.status === 'approved' && (
              <div className="alert alert-success" style={{marginBottom:24}}>
                ✅ Your shop is <strong>live</strong> on SehatSehul! Customers can find you now.
              </div>
            )}
            {shop.status === 'rejected' && (
              <div className="alert alert-error" style={{marginBottom:24}}>
                ❌ Your shop was <strong>rejected</strong>. Please contact support at support@sehatsehul.in
              </div>
            )}

            {/* Shop stats */}
            <div className="dash-stats" style={{marginBottom:28}}>
              <div className="stat-card">
                <div className="s-icon">🏪</div>
                <div className="s-val">{shop.shopName}</div>
                <div className="s-label">Shop Name</div>
              </div>
              <div className="stat-card">
                <div className="s-icon">📍</div>
                <div className="s-val">{shop.city}</div>
                <div className="s-label">City</div>
              </div>
              <div className="stat-card">
                <div className="s-icon">⭐</div>
                <div className="s-val">{shop.rating || '—'}</div>
                <div className="s-label">Rating</div>
              </div>
              <div className="stat-card">
                <div className="s-icon">
                  {shop.status === 'approved' ? '✅' : shop.status === 'pending' ? '⏳' : '❌'}
                </div>
                <div className="s-val" style={{fontSize:16,textTransform:'capitalize'}}>{shop.status}</div>
                <div className="s-label">Status</div>
              </div>
            </div>

            {/* Shop details */}
            <div className="card" style={{marginBottom:20}}>
              <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:18,marginBottom:16,paddingBottom:12,borderBottom:'1px solid var(--border)'}}>
                Shop Details
              </h3>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                {[
                  ['Shop Name',   shop.shopName],
                  ['Owner',       shop.ownerName],
                  ['Phone',       shop.phone],
                  ['WhatsApp',    shop.whatsapp || '—'],
                  ['Address',     shop.address],
                  ['District',    shop.district],
                  ['License No.', shop.licenseNo],
                  ['Timing',      shop.isOpen24x7 ? 'Open 24×7' : shop.timing],
                ].map(([label, val]) => (
                  <div key={label} style={{padding:'12px',background:'var(--bg)',borderRadius:10}}>
                    <div style={{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'.05em',color:'var(--muted)',marginBottom:4}}>{label}</div>
                    <div style={{fontSize:14,fontWeight:600,color:'var(--slate)'}}>{val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="card" style={{marginBottom:20}}>
              <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:18,marginBottom:14,paddingBottom:12,borderBottom:'1px solid var(--border)'}}>
                Services
              </h3>
              <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                {(shop.services || []).map((s,i) => (
                  <span key={i} className="badge badge-teal">{s}</span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="quick-actions">
              <Link to="/shops" className="qa-card">
                <span>👀</span>
                <strong>View My Listing</strong>
                <p>See how customers see your shop</p>
              </Link>
              <Link to="/contact" className="qa-card">
                <span>📞</span>
                <strong>Contact Support</strong>
                <p>Get help from our team</p>
              </Link>
              <Link to="/profile" className="qa-card">
                <span>👤</span>
                <strong>My Profile</strong>
                <p>Update your account details</p>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}