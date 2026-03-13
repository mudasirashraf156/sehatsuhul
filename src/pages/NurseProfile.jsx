import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Stars } from '../components/Shared';
import { useAuth } from '../context/AuthContext';
import './NurseProfile.css';

export default function NurseProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/nurses/${id}`)
      .then(r => { setData(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-loader">Loading profile…</div>;
  if (!data) return <div className="page-loader">Nurse not found</div>;

  const { nurse, reviews } = data;
  const u = nurse.user;

  return (
    <div className="np-page">
      <div className="container np-layout">
        {/* Left */}
        <div className="np-left">
          <div className="card np-card">
            <div className="np-avatar">{u?.firstName?.[0]}{u?.lastName?.[0]}</div>
            {nurse.isVerified && <div className="np-verified-badge">✅ Verified by SehatSuhul</div>}
            <h1>{u?.firstName} {u?.lastName}</h1>
            <div className="np-spec">{nurse.specialization}</div>
            <div className="np-rating">
              <Stars rating={nurse.rating} size={18}/>
              <span>{nurse.rating.toFixed(1)}</span>
              <span>({nurse.totalReviews} reviews)</span>
            </div>
            <div className="np-stats">
              <div><strong>{nurse.experience || 0}</strong><span>Yrs Exp</span></div>
              <div><strong>{nurse.totalBookings || 0}</strong><span>Bookings</span></div>
              <div><strong>{nurse.totalReviews}</strong><span>Reviews</span></div>
            </div>
            <div className="np-rate-box">
              <span className="np-rate">₨{nurse.hourlyRate}<small>/hr</small></span>
            </div>
            <div className="np-actions">
              {user?.role === 'patient' ? (
                <button className="btn btn-teal" style={{width:'100%',justifyContent:'center'}} onClick={() => navigate(`/book/${id}`)}>
                  📅 Book This Nurse
                </button>
              ) : !user ? (
                <Link to="/login?role=patient" className="btn btn-teal" style={{width:'100%',justifyContent:'center'}}>
                  Login to Book
                </Link>
              ) : null}
            </div>
            <div className="np-contact">
              {nurse.city && <div>📍 {nurse.city}</div>}
              {u?.phone && <div>📞 {u.phone}</div>}
            </div>
          </div>

          {/* Availability */}
          <div className="card" style={{marginTop:'16px'}}>
            <h3 style={{marginBottom:'14px',fontSize:'15px',fontWeight:'700'}}>Availability</h3>
            {(nurse.availability || []).map((a, i) => (
              <div key={i} className={`avail-row ${!a.available ? 'unavail' : ''}`}>
                <span>{a.day}</span>
                <span>{a.available ? `${a.startTime} – ${a.endTime}` : 'Not available'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="np-right">
          {nurse.bio && (
            <div className="card np-section">
              <h2>About</h2>
              <p>{nurse.bio}</p>
            </div>
          )}

          <div className="card np-section">
            <h2>Services Offered</h2>
            <div className="services-tags">
              {(nurse.services || []).map((s, i) => <span key={i}>{s}</span>)}
            </div>
          </div>

          <div className="card np-section">
            <h2>Patient Reviews ({reviews.length})</h2>
            {reviews.length === 0 ? (
              <p style={{color:'var(--muted)',fontSize:'14px'}}>No reviews yet. Be the first!</p>
            ) : reviews.map(r => (
              <div key={r._id} className="review-item">
                <div className="review-header">
                  <div className="review-avatar">{r.patient?.firstName?.[0]}</div>
                  <div>
                    <strong>{r.patient?.firstName} {r.patient?.lastName}</strong>
                    <Stars rating={r.rating} size={13}/>
                  </div>
                  <span className="review-date">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                {r.comment && <p className="review-text">{r.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
