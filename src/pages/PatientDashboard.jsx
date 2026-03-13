import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/Shared';
import './Dashboard.css';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/bookings/patient')
      .then(r => { setBookings(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const upcoming = bookings.filter(b => ['pending','confirmed','in-progress'].includes(b.status));
  const completed = bookings.filter(b => b.status === 'completed');

  const cancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    await axios.patch(`/api/bookings/${id}/status`, { status: 'cancelled' });
    setBookings(bookings.map(b => b._id === id ? {...b, status:'cancelled'} : b));
  };

  return (
    <div className="dash-page">
      <div className="dash-hero teal-hero">
        <div className="container">
          <div className="dash-hero-inner">
            <div>
              <h1>Good day, {user?.firstName} 👋</h1>
              <p>Manage your bookings and health care</p>
            </div>
            <Link to="/nurses" className="btn btn-white">+ Book a Nurse</Link>
          </div>
        </div>
      </div>

      <div className="container dash-body">
        {/* Stats */}
        <div className="dash-stats">
          <div className="stat-card"><div className="s-icon">📅</div><div className="s-val">{upcoming.length}</div><div className="s-label">Upcoming</div></div>
          <div className="stat-card"><div className="s-icon">✅</div><div className="s-val">{completed.length}</div><div className="s-label">Completed</div></div>
          <div className="stat-card"><div className="s-icon">🧪</div><div className="s-val">0</div><div className="s-label">Lab Tests</div></div>
          <div className="stat-card"><div className="s-icon">💰</div><div className="s-val">₨{completed.reduce((s,b)=>s+b.totalAmount,0).toLocaleString()}</div><div className="s-label">Total Spent</div></div>
        </div>

        {/* Quick actions */}
        <div className="dash-section">
          <h2>Quick Actions</h2>
          <div className="quick-actions">
            <Link to="/nurses" className="qa-card">
              <span>👩‍⚕️</span><strong>Find a Nurse</strong><p>Browse verified nurses near you</p>
            </Link>
            <Link to="/services" className="qa-card">
              <span>🧪</span><strong>Book Lab Test</strong><p>Home sample collection</p>
            </Link>
            <Link to="/profile" className="qa-card">
              <span>👤</span><strong>My Profile</strong><p>Update your info</p>
            </Link>
          </div>
        </div>

        {/* Bookings */}
        <div className="dash-section">
          <div className="section-header">
            <h2>My Bookings</h2>
            <Link to="/patient/bookings" className="btn btn-outline btn-sm">View All</Link>
          </div>
          {loading ? <div className="page-loader">Loading bookings…</div>
          : bookings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No bookings yet</h3>
              <p>Book your first nurse visit to get started</p>
              <Link to="/nurses" className="btn btn-teal" style={{marginTop:'16px'}}>Find a Nurse</Link>
            </div>
          ) : (
            <div className="bookings-list">
              {bookings.slice(0, 5).map(b => (
                <BookingRow key={b._id} booking={b} onCancel={cancel}/>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function BookingRow({ booking: b, onCancel, showPatient = false }) {
  return (
    <div className="booking-row">
      <div className="br-left">
        <div className="br-avatar">
          {showPatient
            ? (b.patient?.firstName?.[0] || '?')
            : (b.nurse?.firstName?.[0] || '?')}
        </div>
        <div>
          <strong>
            {showPatient
              ? `${b.patient?.firstName} ${b.patient?.lastName}`
              : `Nurse ${b.nurse?.firstName} ${b.nurse?.lastName}`}
          </strong>
          <span>{b.service}</span>
          <span>📅 {new Date(b.bookingDate).toLocaleDateString()} at {b.timeSlot}</span>
        </div>
      </div>
      <div className="br-right">
        <StatusBadge status={b.status}/>
        <div className="br-amount">₨{b.totalAmount?.toLocaleString()}</div>
        {onCancel && ['pending','confirmed'].includes(b.status) && (
          <button className="btn-ghost btn-sm" onClick={() => onCancel(b._id)} style={{color:'var(--rose)',fontSize:'12px'}}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
