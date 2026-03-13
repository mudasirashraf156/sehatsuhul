import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/Shared';
import './Dashboard.css';

export default function NurseDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('/api/bookings/nurse'),
      axios.get('/api/nurses/my/profile')
    ]).then(([bRes, pRes]) => {
      setBookings(bRes.data);
      setProfile(pRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    await axios.patch(`/api/bookings/${id}/status`, { status });
    setBookings(bookings.map(b => b._id === id ? {...b, status} : b));
  };

  const pending   = bookings.filter(b => b.status === 'pending');
  const active    = bookings.filter(b => ['confirmed','in-progress'].includes(b.status));
  const completed = bookings.filter(b => b.status === 'completed');
  const earnings  = completed.reduce((s, b) => s + b.totalAmount, 0);

  return (
    <div className="dash-page">
      <div className="dash-hero rose-hero">
        <div className="container">
          <div className="dash-hero-inner">
            <div>
              <h1>Welcome, {user?.firstName} 👩‍⚕️</h1>
              <p>Manage your bookings and availability</p>
            </div>
            <Link to="/nurse/profile" className="btn btn-white">Edit Profile</Link>
          </div>
        </div>
      </div>

      <div className="container dash-body">
        {!profile?.isVerified && (
          <div className="alert alert-warning" style={{marginBottom:'24px'}}>
            ⏳ Your profile is <strong>pending verification</strong>. You'll start receiving bookings once approved by our team.
          </div>
        )}

        <div className="dash-stats">
          <div className="stat-card"><div className="s-icon">🔔</div><div className="s-val">{pending.length}</div><div className="s-label">New Requests</div></div>
          <div className="stat-card"><div className="s-icon">🏃</div><div className="s-val">{active.length}</div><div className="s-label">Active Bookings</div></div>
          <div className="stat-card"><div className="s-icon">✅</div><div className="s-val">{completed.length}</div><div className="s-label">Completed</div></div>
          <div className="stat-card"><div className="s-icon">💰</div><div className="s-val">₨{earnings.toLocaleString()}</div><div className="s-label">Earnings</div></div>
        </div>

        {/* Nurse Tools */}
        <div className="dash-section">
          <h2>Nurse Tools</h2>
          <div className="quick-actions">
            <Link to="/nurse/profile" className="qa-card rose">
              <span>👤</span><strong>My Profile</strong><p>Update bio, services, rates</p>
            </Link>
            <Link to="/nurse/bookings" className="qa-card rose">
              <span>📋</span><strong>All Bookings</strong><p>View and manage requests</p>
            </Link>
            <Link to="/nurse/profile" className="qa-card rose">
              <span>🗓️</span><strong>Availability</strong><p>Set your working hours</p>
            </Link>
          </div>
        </div>

        {/* Pending Requests */}
        {pending.length > 0 && (
          <div className="dash-section">
            <h2>⚡ New Booking Requests ({pending.length})</h2>
            <div className="bookings-list">
              {pending.map(b => (
                <div key={b._id} className="booking-row">
                  <div className="br-left">
                    <div className="br-avatar rose-av">{b.patient?.firstName?.[0]}</div>
                    <div>
                      <strong>{b.patient?.firstName} {b.patient?.lastName}</strong>
                      <span>{b.service}</span>
                      <span>📅 {new Date(b.bookingDate).toLocaleDateString()} at {b.timeSlot}</span>
                      <span>📍 {b.city}</span>
                    </div>
                  </div>
                  <div className="br-right">
                    <div className="br-amount">₨{b.totalAmount?.toLocaleString()}</div>
                    <button className="btn btn-teal btn-sm" onClick={() => updateStatus(b._id, 'confirmed')}>✅ Accept</button>
                    <button className="btn btn-sm" style={{background:'var(--rose-l)',color:'var(--rose)',borderRadius:'50px',border:'none',cursor:'pointer',padding:'8px 16px',fontWeight:600}}
                      onClick={() => updateStatus(b._id, 'cancelled')}>❌ Decline</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active */}
        <div className="dash-section">
          <div className="section-header">
            <h2>All Bookings</h2>
            <Link to="/nurse/bookings" className="btn btn-outline btn-sm">View All</Link>
          </div>
          {loading ? <div className="page-loader">Loading…</div>
          : bookings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No bookings yet</h3>
              <p>Once your profile is verified, patients can book you</p>
            </div>
          ) : (
            <div className="bookings-list">
              {bookings.slice(0, 5).map(b => (
                <div key={b._id} className="booking-row">
                  <div className="br-left">
                    <div className="br-avatar rose-av">{b.patient?.firstName?.[0]}</div>
                    <div>
                      <strong>{b.patient?.firstName} {b.patient?.lastName}</strong>
                      <span>{b.service}</span>
                      <span>📅 {new Date(b.bookingDate).toLocaleDateString()} at {b.timeSlot}</span>
                    </div>
                  </div>
                  <div className="br-right">
                    <StatusBadge status={b.status}/>
                    <div className="br-amount">₨{b.totalAmount?.toLocaleString()}</div>
                    {b.status === 'confirmed' && (
                      <button className="btn btn-teal btn-sm" onClick={() => updateStatus(b._id, 'completed')}>Mark Done</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
