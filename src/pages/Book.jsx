import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Stars } from '../components/Shared';
import './Book.css';

const TIME_SLOTS = ['08:00 AM','09:00 AM','10:00 AM','11:00 AM','12:00 PM','01:00 PM','02:00 PM','03:00 PM','04:00 PM','05:00 PM','06:00 PM','07:00 PM'];

export default function Book() {
  const { nurseId } = useParams();
  const { user } = useNavigate();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [nurse, setNurse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    service: '', bookingDate: '', timeSlot: '',
    address: '', city: '', notes: '', hours: 1
  });

  useEffect(() => {
    if (!authUser || authUser.role !== 'patient') { navigate('/login?role=patient'); return; }
    axios.get(`/api/nurses/${nurseId}`)
      .then(r => { setNurse(r.data.nurse); setLoading(false); })
      .catch(() => setLoading(false));
  }, [nurseId, authUser]);

  const h = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.service || !form.bookingDate || !form.timeSlot || !form.address || !form.city)
      return setError('Please fill all required fields');
    setError(''); setSubmitting(true);
    try {
      await axios.post('/api/bookings', {
        nurseId: nurse.user._id,
        nurseProfileId: nurse._id,
        ...form,
        hours: parseInt(form.hours)
      });
      setSuccess(true);
    } catch (err) { setError(err.response?.data?.message || 'Booking failed'); }
    setSubmitting(false);
  };

  if (loading) return <div className="page-loader">Loading…</div>;
  if (!nurse) return <div className="page-loader">Nurse not found</div>;

  if (success) return (
    <div className="book-success">
      <div className="success-icon">🎉</div>
      <h2>Booking Confirmed!</h2>
      <p>Your booking with <strong>{nurse.user?.firstName} {nurse.user?.lastName}</strong> has been submitted.</p>
      <p>The nurse will confirm within a few hours.</p>
      <div className="success-actions">
        <button className="btn btn-teal" onClick={() => navigate('/patient/bookings')}>View My Bookings</button>
        <button className="btn btn-outline" onClick={() => navigate('/nurses')}>Find More Nurses</button>
      </div>
    </div>
  );

  const total = nurse.hourlyRate * parseInt(form.hours || 1);

  return (
    <div className="book-page">
      <div className="container book-layout">
        {/* Nurse summary */}
        <div className="book-sidebar">
          <div className="card">
            <h3>You're booking</h3>
            <div className="book-nurse-info">
              <div className="bni-avatar">{nurse.user?.firstName?.[0]}{nurse.user?.lastName?.[0]}</div>
              <div>
                <strong>{nurse.user?.firstName} {nurse.user?.lastName}</strong>
                <span>{nurse.specialization}</span>
                <Stars rating={nurse.rating} size={13}/>
              </div>
            </div>
            <div className="book-rate-info">
              <div><span>Rate</span><strong>₨{nurse.hourlyRate}/hr</strong></div>
              <div><span>Hours</span><strong>{form.hours || 1}</strong></div>
              <div className="book-total"><span>Total</span><strong>₨{total}</strong></div>
            </div>
            {nurse.isVerified && <div className="badge badge-teal" style={{width:'100%',justifyContent:'center',marginTop:'12px'}}>✅ Verified Nurse</div>}
          </div>
        </div>

        {/* Booking form */}
        <div className="book-form-wrap">
          <h1>Book Appointment</h1>
          <p className="book-sub">Fill in the details for your home visit</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={submit}>
            <div className="card form-section">
              <h3>Service Details</h3>
              <div className="field">
                <label>Service Required *</label>
                <select name="service" value={form.service} onChange={h} required>
                  <option value="">Select service</option>
                  {(nurse.services || []).map(s => <option key={s}>{s}</option>)}
                  <option>General Care</option>
                  <option>Post-Op Care</option>
                  <option>Medication Administration</option>
                </select>
              </div>
              <div className="form-row">
                <div className="field">
                  <label>Date *</label>
                  <input type="date" name="bookingDate" value={form.bookingDate} onChange={h}
                    min={new Date().toISOString().split('T')[0]} required/>
                </div>
                <div className="field">
                  <label>Duration (hours) *</label>
                  <select name="hours" value={form.hours} onChange={h}>
                    {[1,2,3,4,6,8].map(h => <option key={h} value={h}>{h} hour{h > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
              </div>
              <div className="field">
                <label>Time Slot *</label>
                <div className="time-slots">
                  {TIME_SLOTS.map(t => (
                    <button type="button" key={t}
                      className={`time-slot ${form.timeSlot === t ? 'selected' : ''}`}
                      onClick={() => setForm({...form, timeSlot: t})}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="card form-section">
              <h3>Visit Location</h3>
              <div className="field">
                <label>Full Address *</label>
                <input name="address" placeholder="House/Flat No., Street, Area" value={form.address} onChange={h} required/>
              </div>
              <div className="field">
                <label>City *</label>
                <select name="city" value={form.city} onChange={h} required>
                  <option value="">Select city</option>
                  {['Srinagar', 'Budgam', 'Beerwah', 'Baramulla', 'Anantnag', 'Pulwama', 'Ganderbal', 'Kupwara', 'Bandipora'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Additional Notes</label>
                <textarea name="notes" placeholder="Any special instructions or medical conditions the nurse should know about…" value={form.notes} onChange={h}/>
              </div>
            </div>

            <div className="book-submit-wrap">
              <div className="book-price">
                <span>Total: </span>
                <strong>₨{total}</strong>
                <small> ({form.hours || 1} hr × ₨{nurse.hourlyRate})</small>
              </div>
              <button type="submit" className="btn btn-teal" disabled={submitting} style={{padding:'14px 36px'}}>
                {submitting ? <span className="spinner"/> : '📅 Confirm Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
