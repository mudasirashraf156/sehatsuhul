import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './StaticPages.css';

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
    <div className="static-page">
      <h1 className="static-h1">Our Healthcare Services</h1>
      <p style={{color:'var(--muted)',fontSize:16,marginBottom:40}}>Professional medical care delivered to your home by certified nurses</p>
      <div className="services-grid">
        {services.map((s,i) => (
          <div key={i} className="card service-card">
            <div className="service-icon">{s.icon}</div>
            <div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <div className="service-footer">
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
    <div className="static-page">
      <h1 className="static-h1">About SehatSuhul</h1>
      <p style={{fontSize:16,color:'var(--muted)',lineHeight:1.8,marginBottom:24}}>
        SehatSuhul is Kashmir's leading home healthcare platform connecting patients with certified, verified nursing professionals. Our mission is to make quality healthcare accessible, affordable, and convenient for every household.
      </p>
      <h2 className="static-sec">Our Mission</h2>
      <p style={{fontSize:15,color:'var(--muted)',lineHeight:1.8}}>To bridge the gap between patients and healthcare professionals, ensuring world-class nursing care reaches every home in Kashmir — from major cities to smaller towns.</p>
      <h2 className="static-sec">Why Choose SehatSuhul?</h2>
      <div className="about-features">
        {[['✅','Verified Nurses','All nurses are PNC-licensed and background-checked'],['⚡','Quick Booking','Book in under 5 minutes, nurse at your door within hours'],['🔒','Secure & Safe','All transactions and data are 100% secure'],['⭐','Rated Professionals','Read real reviews from verified patients'],['💰','Transparent Pricing','No hidden fees — pay only what you see'],['📞','24/7 Support','We\'re here whenever you need us']].map(([i,t,d]) => (
          <div key={t} className="card feature-card">
            <div className="feature-icon">{i}</div>
            <h3>{t}</h3>
            <p>{d}</p>
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
    <div className="static-page">
      <h1 className="static-h1">Contact Us</h1>
      <div className="contact-grid">
        <div>
          <p className="contact-info">Have questions? We'd love to hear from you. Send us a message and we'll respond within 24 hours.</p>
          <div className="contact-details">
            {[['📞','Phone','+92 300 0000000'],['✉️','Email','support@sehatsuhul.pk'],['📍','Office','budgam, Srinagar'],['⏰','Hours','Mon-Sat, 9AM-6PM']].map(([i,l,v]) => (
              <div key={l} className="contact-item">
                <span className="contact-item-icon">{i}</span>
                <div className="contact-item-content">
                  <small>{l}</small>
                  <div>{v}</div>
                </div>
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
    <div className="static-page review-form">
      <h1 className="static-h1">Leave a Review</h1>
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

export function Privacy() {
  return (
    <div className="static-page">
      <h1 className="static-h1">Privacy Policy & Terms of Use – SehatSuhul</h1>
      <p style={{fontSize:16,color:'var(--muted)',lineHeight:1.8,marginBottom:24}}>
        At SehatSuhul, we are committed to protecting the privacy, security, and trust of our users. This platform is designed to provide convenient access to healthcare-related services such as home nursing support, medicine ordering, and basic health service coordination. To ensure a safe and reliable experience, we follow strict standards for the collection, use, and protection of personal information.
      </p>
      <h2 className="static-sec">Privacy Policy</h2>
      <p style={{fontSize:15,color:'var(--muted)',lineHeight:1.8,marginBottom:24}}>
        SehatSuhul may collect basic personal information including name, contact details, location, and health-related information necessary for delivering requested healthcare services. This information is used solely to facilitate service requests, improve user experience, and maintain the functionality of the platform. All user data is handled with strict confidentiality and is stored using secure systems designed to protect against unauthorized access. SehatSuhul does not sell, trade, or misuse personal data. Information may only be shared with relevant service providers when necessary to fulfill user requests or when required by applicable laws and regulations.
      </p>
      <h2 className="static-sec">Terms and Conditions</h2>
      <p style={{fontSize:15,color:'var(--muted)',lineHeight:1.8,marginBottom:24}}>
        By accessing or using the SehatSuhul application, users agree to comply with the terms and conditions of the platform. Users are responsible for providing accurate and complete information while requesting services. SehatSuhul acts as a digital platform that connects users with healthcare-related services; however, it does not replace professional medical diagnosis, emergency care, or hospital treatment. The platform is not responsible for delays, unavailability of services, or issues arising from third-party providers.
      </p>
      <p style={{fontSize:15,color:'var(--muted)',lineHeight:1.8,marginBottom:24}}>
        Users must use the application responsibly and in accordance with applicable laws. Any misuse, fraudulent activity, or violation of platform policies may result in suspension or termination of access to the application.
      </p>
      <h2 className="static-sec">Acceptance of Policy</h2>
      <p style={{fontSize:15,color:'var(--muted)',lineHeight:1.8,marginBottom:24}}>
        By continuing to access or use the SehatSuhul application, users acknowledge that they have read, understood, and agreed to the Privacy Policy and Terms of Use outlined above.
      </p>
      <blockquote style={{fontSize:16,color:'var(--teal)',fontStyle:'italic',textAlign:'center',marginTop:32}}>
        "Your trust is our responsibility, and your health and privacy remain our highest priority."
      </blockquote>
    </div>
  );
}
