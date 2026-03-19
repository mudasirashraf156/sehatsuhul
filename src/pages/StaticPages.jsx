import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './StaticPages.css';

export function Services() {
  const services = [
    {
  icon:'💉',
  title:'IV Therapy',
  desc:'Professional IV drip administration including fluids, vitamins, antibiotics, and medications at home by certified nurses.',
  price:'₨1,500+',
  image:'https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&h=300&fit=crop&crop=center'
},
     { icon:'🩹', title:'Wound Care & Dressing', desc:'Expert wound cleaning, dressing changes, post-surgical suture care, and pressure ulcer management.', price:'₨800+', image:'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop&crop=center' },
    { icon:'💊', title:'Medication Administration', desc:'Supervised oral, IM, and IV medication administration with monitoring for side effects.', price:'₨600+', image:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop&crop=center' },
    { icon:'🩸', title:'Home Blood Tests', desc:'Professional sample collection for complete blood count, sugar, lipids, and all standard lab tests.', price:'₨500+', image:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop&crop=center' },
    { icon:'👶', title:'Pediatric Nursing', desc:'Specialized care for children and newborns including vaccination support and pediatric assessments.', price:'₨1,000+', image:'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop&crop=center' },
    { icon:'🧓', title:'Elderly Care', desc:'Full-time and part-time companion nursing, mobility assistance, and chronic condition management.', price:'₨900+', image:'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center' },
    { icon:'🏥', title:'Post-Op Recovery', desc:'Professional post-operative monitoring, early mobilization, and recovery support at home.', price:'₨1,200+', image:'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400&h=300&fit=crop&crop=center' },
    { icon:'❤️', title:'Vital Signs Monitoring', desc:'Regular blood pressure, oxygen, temperature, and pulse monitoring with detailed reports.', price:'₨500+', image:'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&h=300&fit=crop&crop=center' },
  ];
  return (
    <div className="static-page">
      <h1 className="static-h1">Our Healthcare Services</h1>
      <p style={{color:'var(--muted)',fontSize:16,marginBottom:40}}>Professional medical care delivered to your home by certified nurses</p>
      <div className="services-grid">
        {services.map((s,i) => (
          <div key={i} className="card service-card" style={{backgroundImage: `url(${s.image})`}}>
            <div className="service-overlay"/>
            <div className="service-content">
              <div className="service-icon">{s.icon}</div>
              <div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <div className="service-footer">
                  <span style={{fontSize:13,fontWeight:700,color:'white', textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'}}>From {s.price}</span>
                  <Link to="/nurses" className="btn btn-teal btn-sm">Book Now</Link>
                </div>
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
      <h1 className="static-h1">About SehatSehul</h1>
      <p style={{fontSize:16,color:'var(--muted)',lineHeight:1.8,marginBottom:24}}>
        SehatSehul is Kashmir's leading home healthcare platform connecting patients with certified, verified nursing professionals. Our mission is to make quality healthcare accessible, affordable, and convenient for every household.
      </p>
      <h2 className="static-sec">Our Mission</h2>
      <p style={{fontSize:15,color:'var(--muted)',lineHeight:1.8}}>To bridge the gap between patients and healthcare professionals, ensuring world-class nursing care reaches every home in Kashmir — from major cities to smaller towns.</p>
      <h2 className="static-sec">Why Choose SehatSehul?</h2>
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
  return (
    <div className="contact-page">

      {/* Hero */}
      <div className="contact-hero">
        <div className="contact-hero-inner">
          <div className="contact-tag">📍 Based in Kashmir</div>
          <h1>Get in Touch</h1>
          <p>We're here to help 24/7. Reach us through any channel below.</p>
        </div>
      </div>

      <div className="contact-body">

        {/* Top Cards */}
        <div className="contact-cards">
          <a href="tel:+917006273733" className="contact-card">
            <div className="cc-icon phone">📞</div>
            <div className="cc-label">Call Us</div>
            <div className="cc-val">70062 73733</div>
            <div className="cc-val">70066 59980</div>
            <div className="cc-hint">Mon–Sat, 9AM–8PM</div>
          </a>
          <a href="mailto:sehatsehul@gmail.com" className="contact-card">
            <div className="cc-icon email">📧</div>
            <div className="cc-label">Email Us</div>
            <div className="cc-val">sehatsehul@gmail.com</div>
            <div className="cc-hint">Reply within 24 hours</div>
          </a>
          <a href="https://wa.me/917780906971" target="_blank" rel="noreferrer" className="contact-card">
            <div className="cc-icon whatsapp">💬</div>
            <div className="cc-label">WhatsApp</div>
            <div className="cc-val">+91 77809 06971</div>
            <div className="cc-hint">Fastest response</div>
          </a>
          <div className="contact-card no-link">
            <div className="cc-icon hours">🕐</div>
            <div className="cc-label">Working Hours</div>
            <div className="cc-val">Mon – Sat</div>
            <div className="cc-val">9:00 AM – 8:00 PM</div>
            <div className="cc-hint">Emergency: 24/7</div>
          </div>
        </div>

        {/* Bottom: Office + Social + Map */}
        <div className="contact-bottom">

          {/* Office Info */}
          <div className="card contact-office">
            <div className="co-header">
              <div className="co-icon">🏢</div>
              <div>
                <h3>Our Office</h3>
                <p>Visit us or send mail to our registered address</p>
              </div>
            </div>
            <div className="co-divider"/>
            <div className="co-rows">
              <div className="co-row">
                <span className="co-row-icon">📍</span>
                <div>
                  <div className="co-row-label">Address</div>
                  <div className="co-row-val">Srinagar<br/>Jammu & Kashmir — 191111</div>
                </div>
              </div>
              <div className="co-row">
                <span className="co-row-icon">🇮🇳</span>
                <div>
                  <div className="co-row-label">Region</div>
                  <div className="co-row-val">Jammu & Kashmir, India</div>
                </div>
              </div>
              <div className="co-row">
                <span className="co-row-icon">🏥</span>
                <div>
                  <div className="co-row-label">Service Area</div>
               <div className="co-row-val">
  Srinagar · Budgam · Anantnag · Baramulla · Pulwama · Kupwara · Bandipora · Ganderbal · Kulgam · Shopian<br/>
   · Samba · Kathua · Udhampur · Reasi · Doda · Kishtwar · Ramban · Rajouri · Poonch
</div>
                </div>
              </div>
              <div className="co-row">
                <span className="co-row-icon">📋</span>
                <div>
                  <div className="co-row-label">Registration</div>
                  <div className="co-row-val">Registered Healthcare Platform<br/>J&K, India — 2024</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="contact-right">

            {/* Social */}
            <div className="card contact-social">
              <h3>Follow Us</h3>
              <p>Stay updated with health tips, nurse stories & platform news</p>
              <div className="social-links-grid">
                <a href="https://www.facebook.com/sehatsehul" target="_blank" rel="noreferrer" className="social-link-card facebook">
                  <span>📘</span>
                  <div>
                    <strong>Facebook</strong>
                    <small>@sehatsehul</small>
                  </div>
                  <span className="sl-arrow">↗</span>
                </a>
                <a href="https://www.instagram.com/sehatsehul" target="_blank" rel="noreferrer" className="social-link-card instagram">
                  <span>📸</span>
                  <div>
                    <strong>Instagram</strong>
                    <small>@sehatsehul</small>
                  </div>
                  <span className="sl-arrow">↗</span>
                </a>
                <a href="https://wa.me/917780906971" target="_blank" rel="noreferrer" className="social-link-card whatsapp">
                  <span>💬</span>
                  <div>
                    <strong>WhatsApp</strong>
                    <small>Chat with us</small>
                  </div>
                  <span className="sl-arrow">↗</span>
                </a>
              </div>
            </div>

            {/* Map Embed */}
            <div className="card contact-map-card">
              <h3>Our Location</h3>
              <p>Srinagar — Jammu & Kashmir</p>
              <div className="map-wrap">
                <iframe
                  title="SehatSehul Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d105688.1!2d74.6!3d34.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38e18fda00000001%3A0x1!2sBudgam%2C+Jammu+and+Kashmir!5e0!3m2!1sen!2sin!4v1"
                  width="100%"
                  height="200"
                  style={{ border: 'none', borderRadius: 12 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <a
                href="https://maps.google.com/?q=Srinagar,Jammu+and+Kashmir"
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-sm"
                style={{ marginTop: 14, display: 'inline-flex' }}
              >
                📍 Open in Google Maps
              </a>
            </div>

          </div>
        </div>

        {/* Bottom strip */}
        <div className="contact-strip">
          <div className="cs-item">
            <span>🚑</span>
            <div>
              <strong>Medical Emergency?</strong>
              <p>Call 108 or visit your nearest hospital immediately</p>
            </div>
          </div>
          <div className="cs-divider"/>
          <div className="cs-item">
            <span>👩‍⚕️</span>
            <div>
              <strong>Want to join as a Nurse?</strong>
              <p>Register on our platform and start receiving bookings</p>
            </div>
          </div>
          <div className="cs-divider"/>
          <div className="cs-item">
            <span>🩺</span>
            <div>
              <strong>Need care at home?</strong>
              <p>Book a certified nurse in under 5 minutes</p>
            </div>
          </div>
        </div>

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
      <h1 className="static-h1">Privacy Policy & Terms of Use – SehatSehul</h1>
      <p style={{fontSize:16,color:'var(--muted)',lineHeight:1.8,marginBottom:24}}>
        At SehatSehul, we are committed to protecting the privacy, security, and trust of our users. This platform is designed to provide convenient access to healthcare-related services such as home nursing support, medicine ordering, and basic health service coordination. To ensure a safe and reliable experience, we follow strict standards for the collection, use, and protection of personal information.
      </p>
      <h2 className="static-sec">Privacy Policy</h2>
      <p style={{fontSize:15,color:'var(--muted)',lineHeight:1.8,marginBottom:24}}>
        SehatSehul may collect basic personal information including name, contact details, location, and health-related information necessary for delivering requested healthcare services. This information is used solely to facilitate service requests, improve user experience, and maintain the functionality of the platform. All user data is handled with strict confidentiality and is stored using secure systems designed to protect against unauthorized access. SehatSehul does not sell, trade, or misuse personal data. Information may only be shared with relevant service providers when necessary to fulfill user requests or when required by applicable laws and regulations.
      </p>
      <h2 className="static-sec">Terms and Conditions</h2>
      <p style={{fontSize:15,color:'var(--muted)',lineHeight:1.8,marginBottom:24}}>
        By accessing or using the SehatSehul application, users agree to comply with the terms and conditions of the platform. Users are responsible for providing accurate and complete information while requesting services. SehatSehul acts as a digital platform that connects users with healthcare-related services; however, it does not replace professional medical diagnosis, emergency care, or hospital treatment. The platform is not responsible for delays, unavailability of services, or issues arising from third-party providers.
      </p>
      <p style={{fontSize:15,color:'var(--muted)',lineHeight:1.8,marginBottom:24}}>
        Users must use the application responsibly and in accordance with applicable laws. Any misuse, fraudulent activity, or violation of platform policies may result in suspension or termination of access to the application.
      </p>
      <h2 className="static-sec">Acceptance of Policy</h2>
      <p style={{fontSize:15,color:'var(--muted)',lineHeight:1.8,marginBottom:24}}>
        By continuing to access or use the SehatSehul application, users acknowledge that they have read, understood, and agreed to the Privacy Policy and Terms of Use outlined above.
      </p>
      <blockquote style={{fontSize:16,color:'var(--teal)',fontStyle:'italic',textAlign:'center',marginTop:32}}>
        "Your trust is our responsibility, and your health and privacy remain our highest priority."
      </blockquote>
    </div>
  );
}
