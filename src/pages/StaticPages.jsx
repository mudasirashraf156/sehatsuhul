import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const pageStyle = { padding: '60px 0', maxWidth: 900, margin: '0 auto', paddingLeft: 24, paddingRight: 24 };
const h1Style = { fontFamily: "'Playfair Display',serif", fontSize: 36, color: 'var(--slate)', marginBottom: 12 };
const secStyle = { fontFamily: "'Playfair Display',serif", fontSize: 24, color: 'var(--slate)', margin: '32px 0 16px' };

export function Services() {
  const services = [
    { icon:'💉', title:'IV Therapy', desc:'Professional IV drip administration including fluids, vitamins, antibiotics, and medications at home by certified nurses.', price:'₨1,500+' },
    { icon:'🩹', title:'Wound Care & Dressing', desc:'Expert wound cleaning, dressing changes, post-surgical suture care, and pressure ulcer management.', price:'₨800+' },
    { icon:'💊', title:'Medication Administration', desc:'Supervised oral, IM, and IV medication administration with monitoring for side effects.', price:'₨600+' },
    { icon:'🩸', title:'Home Blood Tests', desc:'Professional sample collection for complete blood count, sugar, lipids, and all standard lab tests.', price:'₨500+' },
    { icon:'👶', title:'Pediatric Nursing', desc:'Specialized care for children and newborns including vaccination support and pediatric assessments.', price:'₨1,000+' },
    { icon:'🧓', title:'Elderly Care', desc:'Full-time and part-time companion nursing, mobility assistance, and chronic condition management.', price:'₨900+' },
    { icon:'🏥', title:'Post-Op Recovery', desc:'Professional post-operative monitoring, early mobilization, and recovery support at home.', price:'₨1,200+' },
    { icon:'❤️', title:'Vital Signs Monitoring', desc:'Regular blood pressure, oxygen, temperature, and pulse monitoring with detailed reports.', price:'₨500+' },
  ];
  return (
    <div style={pageStyle}>
      <h1 style={h1Style}>Our Healthcare Services</h1>
      <p style={{color:'var(--muted)',fontSize:16,marginBottom:40}}>Professional medical care delivered to your home by certified nurses</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:20}}>
        {services.map((s,i) => (
          <div key={i} className="card" style={{display:'flex',gap:16,alignItems:'flex-start'}}>
            <div style={{fontSize:36,flexShrink:0}}>{s.icon}</div>
            <div>
              <h3 style={{fontSize:16,fontWeight:700,marginBottom:6}}>{s.title}</h3>
              <p style={{fontSize:13,color:'var(--muted)',lineHeight:1.6,marginBottom:10}}>{s.desc}</p>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <span style={{fontSize:13,fontWeight:700,color:'var(--teal)'}}>From {s.price}</span>
                <Link to="/nurses" className="btn btn-teal btn-sm">Book Now</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function About() {
  return (
    <div style={pageStyle}>
      <h1 style={h1Style}>About SehatSuhul</h1>
      <p style={{fontSize:16,color:'var(--muted)',lineHeight:1.8,marginBottom:24}}>
        SehatSuhul is Srinagar's leading home healthcare platform connecting patients with certified, verified nursing professionals. Our mission is to make quality healthcare accessible, affordable, and convenient for every household.
      </p>
      <h2 style={secStyle}>Our Mission</h2>
      <p style={{fontSize:15,color:'var(--muted)',lineHeight:1.8}}>To bridge the gap between patients and healthcare professionals, ensuring world-class nursing care reaches every home in Srinagar — from major cities to smaller towns.</p>
      <h2 style={secStyle}>Why Choose SehatSuhul?</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:32}}>
        {[['✅','Verified Nurses','All nurses are PNC-licensed and background-checked'],['⚡','Quick Booking','Book in under 5 minutes, nurse at your door within hours'],['🔒','Secure & Safe','All transactions and data are 100% secure'],['⭐','Rated Professionals','Read real reviews from verified patients'],['💰','Transparent Pricing','No hidden fees — pay only what you see'],['📞','24/7 Support','We\'re here whenever you need us']].map(([i,t,d]) => (
          <div key={t} className="card" style={{textAlign:'center'}}>
            <div style={{fontSize:32,marginBottom:10}}>{i}</div>
            <h3 style={{fontSize:15,fontWeight:700,marginBottom:6}}>{t}</h3>
            <p style={{fontSize:12,color:'var(--muted)'}}>{d}</p>
          </div>
        ))}
      </div>
      <div style={{textAlign:'center'}}>
        <Link to="/nurses" className="btn btn-teal">Find a Nurse →</Link>
      </div>
    </div>
  );
}

export function Contact() {
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' });
  const [sent, setSent] = useState(false);
  const h = e => setForm({...form,[e.target.name]:e.target.value});
  const submit = e => { e.preventDefault(); setSent(true); };
  return (
    <div style={pageStyle}>
      <h1 style={h1Style}>Contact Us</h1>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:32}}>
        <div>
          <p style={{fontSize:15,color:'var(--muted)',lineHeight:1.7,marginBottom:24}}>Have questions? We'd love to hear from you. Send us a message and we'll respond within 24 hours.</p>
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            {[['📞','Phone','+92 300 0000000'],['✉️','Email','support@sehatsuhul.pk'],['📍','Office','budgam, Srinagar'],['⏰','Hours','Mon-Sat, 9AM-6PM']].map(([i,l,v]) => (
              <div key={l} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',background:'var(--white)',borderRadius:12,border:'1px solid var(--border)'}}>
                <span style={{fontSize:24}}>{i}</span><div><small style={{color:'var(--muted)',fontSize:11,textTransform:'uppercase',letterSpacing:'.04em'}}>{l}</small><div style={{fontWeight:600,fontSize:14}}>{v}</div></div>
              </div>
            ))}
          </div>
        </div>
        {sent ? (
          <div className="card" style={{textAlign:'center',padding:48}}>
            <div style={{fontSize:48,marginBottom:16}}>✅</div>
            <h3 style={{fontSize:20,fontFamily:"'Playfair Display',serif",marginBottom:8}}>Message Sent!</h3>
            <p style={{color:'var(--muted)'}}>We'll get back to you within 24 hours.</p>
          </div>
        ) : (
          <div className="card">
            <form onSubmit={submit}>
              <div className="field"><label>Full Name</label><input name="name" value={form.name} onChange={h} required/></div>
              <div className="field"><label>Email</label><input name="email" type="email" value={form.email} onChange={h} required/></div>
              <div className="field"><label>Subject</label><input name="subject" value={form.subject} onChange={h} required/></div>
              <div className="field"><label>Message</label><textarea name="message" rows={5} value={form.message} onChange={h} required/></div>
              <button type="submit" className="btn btn-teal" style={{width:'100%',justifyContent:'center'}}>📤 Send Message</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export function Review() {
  const { bookingId, nurseId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      await axios.post('/api/reviews', { bookingId, nurseId, rating, comment });
      navigate('/patient/bookings');
    } catch (err) { setError(err.response?.data?.message || 'Failed to submit review'); }
    setSubmitting(false);
  };

  return (
    <div style={{...pageStyle, maxWidth:500}}>
      <h1 style={h1Style}>Leave a Review</h1>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="card">
        <form onSubmit={submit}>
          <div className="field">
            <label>Your Rating</label>
            <div style={{display:'flex',gap:8,marginTop:8}}>
              {[1,2,3,4,5].map(r => (
                <button type="button" key={r} onClick={() => setRating(r)}
                  style={{fontSize:32,background:'none',border:'none',cursor:'pointer',opacity:r<=rating?1:.3}}>★</button>
              ))}
            </div>
          </div>
          <div className="field">
            <label>Comments (optional)</label>
            <textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Share your experience with this nurse…" rows={4}/>
          </div>
          <button type="submit" className="btn btn-teal" disabled={submitting}>
            {submitting ? <span className="spinner"/> : '⭐ Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
}
