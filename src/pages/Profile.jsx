import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const SERVICES_LIST = ['Medication Administration','Vital Signs Monitoring','IV Therapy','Wound Dressing','Patient Assessment','Catheter Care','Post-Op Care','Physiotherapy Assistance','Blood Glucose Monitoring','Injection Administration'];

export function NurseProfileEdit() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ bio:'', hourlyRate:800, city:'', experience:0, services:[], availability:[] });

  useEffect(() => {
    axios.get('/api/nurses/my/profile')
      .then(r => {
        setProfile(r.data);
        setForm({ bio: r.data.bio||'', hourlyRate: r.data.hourlyRate, city: r.data.city||'', experience: r.data.experience||0, services: r.data.services||[], availability: r.data.availability||[] });
        setLoading(false);
      }).catch(() => setLoading(false));
  }, []);

  const h = e => setForm({...form, [e.target.name]: e.target.value});

  const toggleService = (s) => {
    setForm(f => ({...f, services: f.services.includes(s) ? f.services.filter(x=>x!==s) : [...f.services, s]}));
  };

  const updateAvailability = (day, field, value) => {
    const avail = form.availability.map(a => a.day === day ? {...a, [field]: value} : a);
    if (!avail.find(a => a.day === day)) avail.push({ day, startTime:'08:00', endTime:'18:00', available: true, [field]: value });
    setForm(f => ({...f, availability: avail}));
  };

  const getDay = (day) => form.availability.find(a => a.day === day) || { available: false, startTime:'08:00', endTime:'18:00' };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess('');
    try {
      await axios.put('/api/nurses/my/profile', form);
      setSuccess('Profile updated successfully!');
    } catch (err) { setError(err.response?.data?.message || 'Save failed'); }
    setSaving(false);
  };

  if (loading) return <div className="page-loader">Loading…</div>;

  return (
    <div className="profile-page">
      <div className="profile-hero rose-hero-sm">
        <div className="container"><h1>Edit Nurse Profile</h1><p>Update your profile to attract more patients</p></div>
      </div>
      <div className="container profile-body">
        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={save}>
          <div className="profile-grid">
            <div>
              {/* Info card */}
              <div className="card profile-section">
                <h3>Basic Info</h3>
                <div className="profile-badge-wrap">
                  <div className="profile-big-av">{user?.firstName?.[0]}{user?.lastName?.[0]}</div>
                  <div>
                    <h2>{user?.firstName} {user?.lastName}</h2>
                    <span>{profile?.specialization}</span>
                    {profile?.isVerified ? <div className="badge badge-teal" style={{marginTop:'6px'}}>✅ Verified</div> : <div className="badge badge-orange" style={{marginTop:'6px'}}>⏳ Pending</div>}
                  </div>
                </div>
                <div className="field"><label>City</label>
                  <select name="city" value={form.city} onChange={h}>
                    <option value="">Select city</option>
                    {['Srinagar', 'Budgam', 'Beerwah', 'Baramulla', 'Anantnag', 'Pulwama', 'Ganderbal', 'Kupwara', 'Bandipora'].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="field"><label>Years of Experience</label><input type="number" name="experience" min="0" max="50" value={form.experience} onChange={h}/></div>
                <div className="field"><label>Hourly Rate (PKR)</label><input type="number" name="hourlyRate" min="300" value={form.hourlyRate} onChange={h}/></div>
                <div className="field"><label>Bio</label><textarea name="bio" placeholder="Tell patients about yourself, your experience, and approach to care…" value={form.bio} onChange={h} rows={4}/></div>
              </div>

              {/* Services */}
              <div className="card profile-section">
                <h3>Services Offered</h3>
                <div className="services-check">
                  {SERVICES_LIST.map(s => (
                    <label key={s} className={`service-check ${form.services.includes(s) ? 'checked' : ''}`}>
                      <input type="checkbox" checked={form.services.includes(s)} onChange={() => toggleService(s)}/> {s}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="card profile-section">
              <h3>Weekly Availability</h3>
              <p style={{fontSize:'13px',color:'var(--muted)',marginBottom:'20px'}}>Set your working hours for each day</p>
              {DAYS.map(day => {
                const d = getDay(day);
                return (
                  <div key={day} className="avail-edit-row">
                    <label className="avail-check">
                      <input type="checkbox" checked={!!d.available} onChange={e => updateAvailability(day, 'available', e.target.checked)}/> {day}
                    </label>
                    {d.available && (
                      <div className="avail-times">
                        <input type="time" value={d.startTime||'08:00'} onChange={e => updateAvailability(day, 'startTime', e.target.value)}/>
                        <span>to</span>
                        <input type="time" value={d.endTime||'18:00'} onChange={e => updateAvailability(day, 'endTime', e.target.value)}/>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="profile-save">
            <button type="submit" className="btn btn-rose" disabled={saving}>
              {saving ? <span className="spinner"/> : '💾 Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function UserProfile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ firstName:'', lastName:'', phone:'', city:'', address:'' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) setForm({ firstName: user.firstName, lastName: user.lastName, phone: user.phone||'', city: user.city||'', address: user.address||'' });
  }, [user]);

  const save = async (e) => {
    e.preventDefault(); setSaving(true); setSuccess('');
    try {
      const { data } = await axios.put('/api/auth/profile', form);
      updateUser(data);
      setSuccess('Profile updated!');
    } catch {}
    setSaving(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-hero teal-hero-sm">
        <div className="container"><h1>My Profile</h1><p>Update your personal information</p></div>
      </div>
      <div className="container" style={{maxWidth:'600px',padding:'32px 24px'}}>
        {success && <div className="alert alert-success">{success}</div>}
        <div className="card">
          <div className="profile-badge-wrap" style={{marginBottom:'24px'}}>
            <div className="profile-big-av teal-av">{user?.firstName?.[0]}{user?.lastName?.[0]}</div>
            <div>
              <h2>{user?.firstName} {user?.lastName}</h2>
              <span className={`badge ${user?.role==='nurse'?'badge-rose':'badge-teal'}`}>{user?.role}</span>
            </div>
          </div>
          <form onSubmit={save}>
            <div className="form-row">
              <div className="field"><label>First Name</label><input value={form.firstName} onChange={e => setForm({...form, firstName:e.target.value})}/></div>
              <div className="field"><label>Last Name</label><input value={form.lastName} onChange={e => setForm({...form, lastName:e.target.value})}/></div>
            </div>
            <div className="field"><label>Phone</label><input value={form.phone} onChange={e => setForm({...form, phone:e.target.value})}/></div>
            <div className="field"><label>City</label>
              <select value={form.city} onChange={e => setForm({...form, city:e.target.value})}>
                <option value="">Select city</option>
                {['Srinagar', 'Budgam', 'Beerwah', 'Baramulla', 'Anantnag', 'Pulwama', 'Ganderbal', 'Kupwara', 'Bandipora'].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="field"><label>Address</label><input value={form.address} placeholder="Your home address" onChange={e => setForm({...form, address:e.target.value})}/></div>
            <button type="submit" className="btn btn-teal" disabled={saving}>
              {saving ? <span className="spinner"/> : '💾 Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
