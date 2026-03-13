import { useState, useEffect } from 'react';
import axios from 'axios';
import { StatusBadge } from '../components/Shared';
import { Link } from 'react-router-dom';
import './Bookings.css';

export function PatientBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    axios.get('/api/bookings/patient')
      .then(r => { setBookings(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const cancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    await axios.patch(`/api/bookings/${id}/status`, { status: 'cancelled' });
    setBookings(bookings.map(b => b._id === id ? {...b, status:'cancelled'} : b));
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div className="bookings-page">
      <div className="bk-header">
        <div className="container">
          <h1>My Bookings</h1>
          <p>Track and manage all your nurse bookings</p>
        </div>
      </div>
      <div className="container bk-body">
        <div className="bk-filters">
          {['all','pending','confirmed','in-progress','completed','cancelled'].map(f => (
            <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              {f !== 'all' && <span>{bookings.filter(b => b.status === f).length}</span>}
            </button>
          ))}
        </div>

        {loading ? <div className="page-loader">Loading…</div>
        : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No {filter !== 'all' ? filter : ''} bookings</h3>
            <p>Your bookings will appear here</p>
            <Link to="/nurses" className="btn btn-teal" style={{marginTop:'16px'}}>Find a Nurse</Link>
          </div>
        ) : (
          <div className="bk-list">
            {filtered.map(b => (
              <div key={b._id} className="bk-card">
                <div className="bk-card-top">
                  <div className="bk-nurse-info">
                    <div className="bk-avatar">{b.nurse?.firstName?.[0]}</div>
                    <div>
                      <h3>Nurse {b.nurse?.firstName} {b.nurse?.lastName}</h3>
                      <span>{b.nurseProfile?.specialization}</span>
                    </div>
                  </div>
                  <StatusBadge status={b.status}/>
                </div>
                <div className="bk-details">
                  <div><span>📋</span> {b.service}</div>
                  <div><span>📅</span> {new Date(b.bookingDate).toLocaleDateString('en-PK',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</div>
                  <div><span>⏰</span> {b.timeSlot}</div>
                  <div><span>📍</span> {b.address}, {b.city}</div>
                  {b.notes && <div><span>📝</span> {b.notes}</div>}
                </div>
                <div className="bk-footer">
                  <div className="bk-total">Total: <strong>₨{b.totalAmount?.toLocaleString()}</strong></div>
                  <div className="bk-actions">
                    {['pending','confirmed'].includes(b.status) && (
                      <button className="btn btn-sm" style={{background:'var(--rose-l)',color:'var(--rose)',border:'none',borderRadius:'50px',cursor:'pointer',padding:'8px 18px',fontWeight:600}} onClick={() => cancel(b._id)}>
                        Cancel
                      </button>
                    )}
                    {b.status === 'completed' && !b.isPaid && (
                      <Link to={`/review/${b._id}/${b.nurse?._id}`} className="btn btn-teal btn-sm">⭐ Leave Review</Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function NurseBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    axios.get('/api/bookings/nurse')
      .then(r => { setBookings(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const update = async (id, status) => {
    await axios.patch(`/api/bookings/${id}/status`, { status });
    setBookings(bookings.map(b => b._id === id ? {...b, status} : b));
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div className="bookings-page">
      <div className="bk-header rose-bk">
        <div className="container">
          <h1>Patient Bookings</h1>
          <p>Manage and respond to your patient requests</p>
        </div>
      </div>
      <div className="container bk-body">
        <div className="bk-filters">
          {['all','pending','confirmed','in-progress','completed','cancelled'].map(f => (
            <button key={f} className={filter === f ? 'active rose-active' : ''} onClick={() => setFilter(f)}>
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              {f !== 'all' && <span>{bookings.filter(b=>b.status===f).length}</span>}
            </button>
          ))}
        </div>

        {loading ? <div className="page-loader">Loading…</div>
        : filtered.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">📋</div><h3>No bookings</h3></div>
        ) : (
          <div className="bk-list">
            {filtered.map(b => (
              <div key={b._id} className="bk-card">
                <div className="bk-card-top">
                  <div className="bk-nurse-info">
                    <div className="bk-avatar rose-av">{b.patient?.firstName?.[0]}</div>
                    <div>
                      <h3>{b.patient?.firstName} {b.patient?.lastName}</h3>
                      <span>📞 {b.patient?.phone}</span>
                    </div>
                  </div>
                  <StatusBadge status={b.status}/>
                </div>
                <div className="bk-details">
                  <div><span>📋</span> {b.service}</div>
                  <div><span>📅</span> {new Date(b.bookingDate).toLocaleDateString('en-PK',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</div>
                  <div><span>⏰</span> {b.timeSlot} ({b.hours} hr{b.hours>1?'s':''})</div>
                  <div><span>📍</span> {b.address}, {b.city}</div>
                  {b.notes && <div><span>📝</span> {b.notes}</div>}
                </div>
                <div className="bk-footer">
                  <div className="bk-total">Total: <strong>₨{b.totalAmount?.toLocaleString()}</strong></div>
                  <div className="bk-actions">
                    {b.status === 'pending' && <>
                      <button className="btn btn-teal btn-sm" onClick={() => update(b._id, 'confirmed')}>✅ Accept</button>
                      <button className="btn btn-sm" style={{background:'var(--rose-l)',color:'var(--rose)',border:'none',borderRadius:'50px',cursor:'pointer',padding:'8px 18px',fontWeight:600}} onClick={() => update(b._id, 'cancelled')}>❌ Decline</button>
                    </>}
                    {b.status === 'confirmed' && (
                      <button className="btn btn-teal btn-sm" onClick={() => update(b._id, 'completed')}>✅ Mark Completed</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
