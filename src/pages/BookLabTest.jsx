import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './BookLabTest.css';

const LAB_TESTS = [
  { name: 'Complete Blood Count (CBC)',      price: 300,  category: 'Blood' },
  { name: 'Blood Sugar (Fasting)',           price: 150,  category: 'Blood' },
  { name: 'Blood Sugar (Random)',            price: 150,  category: 'Blood' },
  { name: 'HbA1c (Diabetes)',               price: 500,  category: 'Blood' },
  { name: 'Lipid Profile',                  price: 600,  category: 'Blood' },
  { name: 'Liver Function Test (LFT)',       price: 700,  category: 'Blood' },
  { name: 'Kidney Function Test (KFT)',      price: 700,  category: 'Blood' },
  { name: 'Thyroid Profile (T3/T4/TSH)',    price: 800,  category: 'Thyroid' },
  { name: 'Urine Routine Examination',       price: 200,  category: 'Urine' },
  { name: 'Urine Culture & Sensitivity',    price: 500,  category: 'Urine' },
  { name: 'Stool Examination',              price: 200,  category: 'Stool' },
  { name: 'Dengue NS1 Antigen',             price: 800,  category: 'Infection' },
  { name: 'Typhoid (Widal Test)',           price: 300,  category: 'Infection' },
  { name: 'COVID-19 Antigen',              price: 500,  category: 'Infection' },
  { name: 'Vitamin D',                      price: 1200, category: 'Vitamins' },
  { name: 'Vitamin B12',                    price: 900,  category: 'Vitamins' },
  { name: 'Iron Studies',                   price: 600,  category: 'Blood' },
  { name: 'ECG',                            price: 300,  category: 'Heart' },
  { name: 'X-Ray',                          price: 400,  category: 'Imaging' },
  { name: 'Pregnancy Test (Beta HCG)',      price: 600,  category: 'Hormones' },
];

const CATEGORIES = ['All', ...new Set(LAB_TESTS.map(t => t.category))];
const TIME_SLOTS = ['7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM'];

export default function BookLabTest() {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [step, setStep]           = useState(1);
  const [category, setCategory]   = useState('All');
  const [selected, setSelected]   = useState([]);
  const [form, setForm]           = useState({ bookingDate:'', timeSlot:'', address:'', city:'', notes:'' });
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [orderId, setOrderId]     = useState('');

  if (!user) return (
    <div style={{textAlign:'center',padding:'80px 24px'}}>
      <div style={{fontSize:48,marginBottom:16}}>🔐</div>
      <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:28,marginBottom:12}}>Login Required</h2>
      <p style={{color:'var(--muted)',marginBottom:24}}>Please login as a patient to book lab tests.</p>
      <a href="/login?role=patient" className="btn btn-teal">Login to Continue</a>
    </div>
  );

  const toggleTest = (test) => {
    setSelected(prev =>
      prev.find(t => t.name === test.name)
        ? prev.filter(t => t.name !== test.name)
        : [...prev, test]
    );
  };

  const isSelected = (test) => selected.find(t => t.name === test.name);
  const total = selected.reduce((s, t) => s + t.price, 0);
  const filtered = category === 'All' ? LAB_TESTS : LAB_TESTS.filter(t => t.category === category);
  const h = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!form.bookingDate || !form.timeSlot || !form.address || !form.city)
      return setError('Please fill all required fields');
    setError(''); setLoading(true);
    try {
      const { data } = await axios.post('/api/labtests', {
        tests: selected.map(t => t.name),
        bookingDate: form.bookingDate,
        timeSlot:    form.timeSlot,
        address:     form.address,
        city:        form.city,
        notes:       form.notes,
        totalAmount: total,
        paymentMethod: 'cash'
      });
      setOrderId(data._id);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    }
    setLoading(false);
  };

  return (
    <div className="labtest-page">
      {/* Hero */}
      <div className="labtest-hero">
        <div className="container">
          <div className="lt-tag">🧪 Home Collection Available</div>
          <h1>Book a Lab Test</h1>
          <p>Select your tests, pick a time slot — our team collects samples from your home</p>
        </div>
      </div>

      <div className="container labtest-body">
        {/* Step indicator */}
        <div className="lt-steps">
          {['Select Tests', 'Your Details', 'Confirmed'].map((s, i) => (
            <div key={s} className={`lt-step ${step > i ? 'done' : step === i+1 ? 'active' : ''}`}>
              <div className="lt-step-num">{step > i+1 ? '✓' : i+1}</div>
              <span>{s}</span>
            </div>
          ))}
        </div>

        {/* STEP 1 — Select Tests */}
        {step === 1 && (
          <div className="lt-layout">
            <div className="lt-tests-panel">
              {/* Category filter */}
              <div className="lt-categories">
                {CATEGORIES.map(c => (
                  <button key={c}
                    className={`lt-cat-btn ${category === c ? 'active' : ''}`}
                    onClick={() => setCategory(c)}>
                    {c}
                  </button>
                ))}
              </div>

              {/* Tests grid */}
              <div className="lt-tests-grid">
                {filtered.map(test => (
                  <div
                    key={test.name}
                    className={`lt-test-card ${isSelected(test) ? 'selected' : ''}`}
                    onClick={() => toggleTest(test)}
                  >
                    <div className="lt-test-check">{isSelected(test) ? '✓' : '+'}</div>
                    <div className="lt-test-name">{test.name}</div>
                    <div className="lt-test-cat">{test.category}</div>
                    <div className="lt-test-price">₹{test.price}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary sidebar */}
            <div className="lt-summary">
              <div className="card">
                <h3>Selected Tests ({selected.length})</h3>
                {selected.length === 0 ? (
                  <p style={{color:'var(--muted)',fontSize:13,margin:'12px 0'}}>
                    No tests selected yet. Click any test to add it.
                  </p>
                ) : (
                  <div className="lt-selected-list">
                    {selected.map(t => (
                      <div key={t.name} className="lt-selected-item">
                        <span>{t.name}</span>
                        <div style={{display:'flex',alignItems:'center',gap:8}}>
                          <strong>₹{t.price}</strong>
                          <button onClick={() => toggleTest(t)} className="lt-remove">✕</button>
                        </div>
                      </div>
                    ))}
                    <div className="lt-total-row">
                      <span>Total</span>
                      <strong>₹{total}</strong>
                    </div>
                  </div>
                )}
                <div className="lt-home-badge">
                  🏠 Free home sample collection
                </div>
                <button
                  className="btn btn-teal"
                  style={{width:'100%',justifyContent:'center',marginTop:12}}
                  disabled={selected.length === 0}
                  onClick={() => setStep(2)}
                >
                  Continue →
                </button>
              </div>

              <div className="card lt-info-card">
                <h4>How it works</h4>
                <div className="lt-how">
                  <div><span>1️⃣</span> Select your tests</div>
                  <div><span>2️⃣</span> Pick date & time</div>
                  <div><span>3️⃣</span> Technician visits home</div>
                  <div><span>4️⃣</span> Results delivered digitally</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 — Details */}
        {step === 2 && (
          <div className="lt-details-wrap">
            <div className="lt-details-layout">
              <div>
                <div className="card lt-form-card">
                  <h3>Collection Details</h3>
                  {error && <div className="alert alert-error">{error}</div>}

                  <div className="field">
                    <label>Collection Date *</label>
                    <input type="date" name="bookingDate" value={form.bookingDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={h} required/>
                  </div>

                  <div className="field">
                    <label>Time Slot *</label>
                    <div className="lt-time-slots">
                      {TIME_SLOTS.map(t => (
                        <button key={t} type="button"
                          className={`lt-time-btn ${form.timeSlot === t ? 'selected' : ''}`}
                          onClick={() => setForm({...form, timeSlot: t})}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="field">
                    <label>Full Address *</label>
                    <input name="address" placeholder="House No., Street, Area" value={form.address} onChange={h} required/>
                  </div>

                  <div className="field">
                    <label>City *</label>
                    <select name="city" value={form.city} onChange={h} required>
                      <option value="">Select city</option>
                      {['Srinagar','Budgam','Baramulla','Anantnag','Pulwama','Ganderbal','Kupwara','Bandipora'].map(c => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="field">
                    <label>Special Instructions</label>
                    <textarea name="notes" rows={3}
                      placeholder="Any fasting requirements or special notes…"
                      value={form.notes} onChange={h}/>
                  </div>

                  <div className="lt-payment-note">
                    💵 Payment: <strong>Cash on Collection</strong>
                  </div>
                </div>
              </div>

              {/* Order summary */}
              <div>
                <div className="card lt-order-summary">
                  <h3>Order Summary</h3>
                  {selected.map(t => (
                    <div key={t.name} className="lt-summary-row">
                      <span>{t.name}</span>
                      <span>₹{t.price}</span>
                    </div>
                  ))}
                  <div className="lt-summary-total">
                    <span>Total Amount</span>
                    <strong>₹{total}</strong>
                  </div>
                  <div className="lt-summary-note">
                    🏠 Home collection included<br/>
                    💵 Pay cash to technician
                  </div>
                  <div style={{display:'flex',gap:10,marginTop:16}}>
                    <button className="btn btn-outline btn-sm" onClick={() => setStep(1)}>← Back</button>
                    <button className="btn btn-teal" style={{flex:1,justifyContent:'center'}}
                      onClick={submit} disabled={loading}>
                      {loading ? <span className="spinner"/> : '✅ Confirm Booking'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 — Confirmed */}
        {step === 3 && (
          <div style={{maxWidth:520,margin:'0 auto',textAlign:'center'}}>
            <div className="card" style={{padding:'52px 40px'}}>
              <div style={{fontSize:64,marginBottom:20}}>🎉</div>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:28,marginBottom:12}}>
                Test Booked!
              </h2>
              <p style={{color:'var(--muted)',lineHeight:1.7,marginBottom:24}}>
                Your lab test order has been placed successfully. Our team will confirm your booking and a technician will visit your home on the selected date.
              </p>
              <div className="alert alert-info" style={{textAlign:'left',marginBottom:24}}>
                📋 Order ID: <strong>{orderId.slice(-8).toUpperCase()}</strong><br/>
                🧪 Tests: <strong>{selected.map(t => t.name).join(', ')}</strong><br/>
                💵 Amount: <strong>₹{total}</strong> (pay to technician)
              </div>
              <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}>
                <button className="btn btn-teal" onClick={() => navigate('/patient/labtests')}>
                  📋 My Lab Orders
                </button>
                <button className="btn btn-outline" onClick={() => navigate('/')}>
                  Go Home
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}