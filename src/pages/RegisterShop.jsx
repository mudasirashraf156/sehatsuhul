import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './RegisterShop.css';

const SERVICES_LIST = [
  'Prescription Medicines','OTC Medicines','Medical Devices',
  'Surgical Items','Baby Products','Vitamins & Supplements',
  'Diabetic Care','First Aid','Ayurvedic Products','Cosmetics'
];

export default function RegisterShop() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [step, setStep]       = useState(1);
  const [shopId, setShopId]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [image, setImage]     = useState(null);
  const [preview, setPreview] = useState(null);
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    shopName:'', ownerName:'', phone:'', whatsapp:'',
    email:'', address:'', city:'', district:'',
    pincode:'', description:'', licenseNo:'',
    timing:'9:00 AM – 9:00 PM', isOpen24x7: false
  });

  const h = e => setForm({ ...form, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const toggleService = s =>
    setServices(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const handleImage = e => {
    const f = e.target.files[0];
    if (!f) return;
    setImage(f);
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target.result);
    reader.readAsDataURL(f);
  };

  const submitDetails = async e => {
    e.preventDefault();
    if (!user) return navigate('/login');
    setError(''); setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('services', services.join(','));
      if (image) fd.append('shopImage', image);
      const { data } = await axios.post('/api/shops/register', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShopId(data._id);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  const confirmPayment = async () => {
    setLoading(true);
    try {
      await axios.patch(`/api/shops/${shopId}/pay`, { paymentRef: 'PENDING_MANUAL' });
      setStep(3);
    } catch (err) {
      setError('Payment update failed');
    }
    setLoading(false);
  };

  // Not logged in
  if (!user) return (
    <div className="rshop-page">
      <div className="container" style={{textAlign:'center',padding:'80px 24px'}}>
        <div style={{fontSize:48,marginBottom:16}}>🔐</div>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:28,marginBottom:12}}>Login Required</h2>
        <p style={{color:'var(--muted)',marginBottom:24}}>You need to be logged in to register your medical shop.</p>
        <a href="/login?role=shopOwner" className="btn btn-teal">Login to Continue</a>
      </div>
    </div>
  );

  // Wrong role
  if (user.role !== 'shopOwner' && user.role !== 'admin') return (
    <div className="rshop-page">
      <div className="container" style={{textAlign:'center',padding:'80px 24px'}}>
        <div style={{fontSize:48,marginBottom:16}}>🚫</div>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:28,marginBottom:12}}>Access Denied</h2>
        <p style={{color:'var(--muted)',marginBottom:8}}>Only registered shop owners can list a medical shop.</p>
        <p style={{color:'var(--muted)',fontSize:14,marginBottom:28}}>
          You are currently logged in as a <strong>{user.role}</strong>.
        </p>
        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
          <a href="/register?role=shopOwner" className="btn btn-teal">Register as Shop Owner</a>
          <a href="/login?role=shopOwner" className="btn btn-outline">Login as Shop Owner</a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="rshop-page">
      <div className="rshop-hero">
        <div className="container">
          <h1>Register Your Medical Shop</h1>
          <p>List your shop on SehatSehul and reach thousands of patients in J&K</p>
        </div>
      </div>

      <div className="container rshop-body">
        {/* Steps indicator */}
        <div className="rshop-steps">
          {['Shop Details','Payment','Done'].map((s, i) => (
            <div key={s} className={`rshop-step ${step > i ? 'done' : step === i+1 ? 'active' : ''}`}>
              <div className="rshop-step-num">{step > i+1 ? '✓' : i+1}</div>
              <span>{s}</span>
            </div>
          ))}
        </div>

        {/* STEP 1 — Details */}
        {step === 1 && (
          <div className="rshop-form-wrap">
            <div className="rshop-fee-banner">
              <div>
                <strong>Registration Fee: ₹99/month</strong>
                <span>One-time listing fee. Admin approval within 24 hours.</span>
              </div>
              <div className="fee-badge">₹99</div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={submitDetails}>
              <div className="rshop-section">
                <h3>Shop Information</h3>
                <div className="form-row">
                  <div className="field"><label>Shop Name *</label><input name="shopName" placeholder="Al-Shifa Medical Store" value={form.shopName} onChange={h} required/></div>
                  <div className="field"><label>Owner Name *</label><input name="ownerName" placeholder="Mohammad Arif" value={form.ownerName} onChange={h} required/></div>
                </div>
                <div className="form-row">
                  <div className="field"><label>Phone *</label><input name="phone" placeholder="+91 70062 73733" value={form.phone} onChange={h} required/></div>
                  <div className="field"><label>WhatsApp</label><input name="whatsapp" placeholder="WhatsApp number" value={form.whatsapp} onChange={h}/></div>
                </div>
                <div className="field"><label>Email</label><input name="email" type="email" placeholder="shop@email.com" value={form.email} onChange={h}/></div>
                <div className="field"><label>Drug License No. *</label><input name="licenseNo" placeholder="DL-JK-XXXX-XXXX" value={form.licenseNo} onChange={h} required/></div>
              </div>

              <div className="rshop-section">
                <h3>Location</h3>
                <div className="field"><label>Full Address *</label><input name="address" placeholder="Shop No., Street, Area" value={form.address} onChange={h} required/></div>
                <div className="form-row">
                  <div className="field"><label>City *</label><input name="city" placeholder="Srinagar" value={form.city} onChange={h} required/></div>
                  <div className="field"><label>District *</label>
                    <select name="district" value={form.district} onChange={h} required>
                      <option value="">Select district</option>
                      {['Srinagar','Budgam','Anantnag','Baramulla','Pulwama','Kupwara','Ganderbal','Bandipora','Kulgam','Shopian'].map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div className="field"><label>PIN Code</label><input name="pincode" placeholder="190001" value={form.pincode} onChange={h}/></div>
              </div>

              <div className="rshop-section">
                <h3>Shop Details</h3>
                <div className="field"><label>Description</label><textarea name="description" placeholder="Tell customers what makes your shop special…" value={form.description} onChange={h} rows={3}/></div>
                <div className="field"><label>Timing</label><input name="timing" placeholder="9:00 AM – 9:00 PM" value={form.timing} onChange={h}/></div>
                <label className="check-label">
                  <input type="checkbox" name="isOpen24x7" checked={form.isOpen24x7} onChange={h}/>
                  Open 24×7
                </label>
              </div>

              <div className="rshop-section">
                <h3>Services / Products</h3>
                <div className="services-check-grid">
                  {SERVICES_LIST.map(s => (
                    <label key={s} className={`service-check-item ${services.includes(s) ? 'checked' : ''}`}>
                      <input type="checkbox" checked={services.includes(s)} onChange={() => toggleService(s)}/> {s}
                    </label>
                  ))}
                </div>
              </div>

              <div className="rshop-section">
                <h3>Shop Photo</h3>
                <div className="image-upload-zone" onClick={() => document.getElementById('shop-img').click()}>
                  <input id="shop-img" type="file" accept="image/*" style={{display:'none'}} onChange={handleImage}/>
                  {preview ? (
                    <img src={preview} alt="preview" style={{width:'100%',maxHeight:200,objectFit:'cover',borderRadius:10}}/>
                  ) : (
                    <div className="iuz-content">
                      <div>📷</div>
                      <strong>Click to upload shop photo</strong>
                      <span>JPG or PNG, max 5MB</span>
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" className="btn btn-teal" style={{width:'100%',justifyContent:'center',padding:'14px'}} disabled={loading}>
                {loading ? <span className="spinner"/> : 'Continue to Payment →'}
              </button>
            </form>
          </div>
        )}

       
      {/* STEP 2 — Payment */}
{step === 2 && (
  <div className="rshop-payment">
    <div className="card payment-card">
      <div className="payment-icon">💳</div>
      <h2>Complete Your Payment</h2>
      <p>Pay the one-time registration fee to submit your shop for admin review</p>

      <div className="payment-amount">
        <span>Registration Fee</span>
        <strong>₹99</strong>
      </div>

      <div className="payment-methods">
        <h4>Pay via UPI / Bank Transfer</h4>
        
        {/* Option 1: UPI QR Code */}
        <div className="qr-section">
          <div className="qr-label">📱 Scan QR Code to Pay</div>
          <div className="qr-code-container">
            <img 
              src="scanupi.jpeg"
              alt="UPI QR Code"
              className="upi-qr-code"
              style={{ width: '200px', height: '200px', margin: '10px auto' }}
            />
          </div>
          <p className="qr-note">
            <small>Scan with PhonePe, Google Pay, Paytm, or any UPI app</small>
          </p>
        </div>

        {/* Option 2: Manual UPI Details */}
        <div className="upi-details-section">
          <div className="section-divider">
            <span>OR Pay Manually</span>
          </div>
          <div className="upi-box">
            <div className="upi-row">
              <span>UPI ID</span>
              <div className="copy-row">
                <strong>aatirahshowkat@okicici</strong>
                <button 
                  className="copy-btn"
                  onClick={() => {
                    navigator.clipboard.writeText('aatirahshowkat@okicici');
                    alert('UPI ID copied!');
                  }}
                >
                  📋 Copy
                </button>
              </div>
            </div>
            <div className="upi-row">
              <span>Account Name</span>
              <strong>SehatSehul Healthcare</strong>
            </div>
            <div className="upi-row">
              <span>Amount</span>
              <strong>₹99</strong>
            </div>
            <div className="upi-row">
              <span>Reference</span>
              <div className="copy-row">
                <strong>SHOP-{shopId?.slice(-6).toUpperCase()}</strong>
                <button 
                  className="copy-btn"
                  onClick={() => {
                    navigator.clipboard.writeText(`SHOP-${shopId?.slice(-6).toUpperCase()}`);
                    alert('Reference copied!');
                  }}
                >
                  📋 Copy
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="alert alert-info" style={{ marginTop: 16 }}>
          ℹ️ After paying, click the button below. Our admin will verify your payment and approve your shop within 24 hours.
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <button 
        className="btn btn-teal" 
        style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: 8 }} 
        onClick={confirmPayment} 
        disabled={loading}
      >
        {loading ? <span className="spinner" /> : '✅ I Have Paid — Submit for Approval'}
      </button>
      <button 
        className="btn-ghost" 
        style={{ width: '100%', textAlign: 'center', marginTop: 8 }} 
        onClick={() => setStep(1)}
      >
        ← Back to Details
      </button>
    </div>
  </div>
)}

        {/* STEP 3 — Done */}
        {step === 3 && (
          <div className="rshop-done">
            <div className="card" style={{textAlign:'center',padding:'56px 40px',maxWidth:480,margin:'0 auto'}}>
              <div style={{fontSize:64,marginBottom:20}}>🎉</div>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:28,marginBottom:12}}>Shop Submitted!</h2>
              <p style={{color:'var(--muted)',lineHeight:1.7,marginBottom:28}}>
                Your shop has been submitted for review. Our admin team will verify your details and payment within <strong>24 hours</strong>. You'll be notified once approved.
              </p>
              <div className="alert alert-info" style={{textAlign:'left',marginBottom:24}}>
                📋 Shop ID: <strong>SHOP-{shopId?.slice(-6).toUpperCase()}</strong><br/>
                Keep this for payment reference.
              </div>
              <a href="/shop/dashboard" className="btn btn-teal" style={{justifyContent:'center',width:'100%',marginBottom:10,display:'flex'}}>
                Go to My Dashboard
              </a>
              <a href="/shops" className="btn btn-outline" style={{justifyContent:'center',width:'100%',display:'flex'}}>
                Browse Medical Shops
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}