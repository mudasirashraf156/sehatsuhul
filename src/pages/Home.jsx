import { Link } from 'react-router-dom';
import { Stars } from '../components/Shared';
import './Home.css';

const services = [
  { icon:'💉', title:'IV Therapy', desc:'Professional IV drip administration at home', image:'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&crop=center' },
  { icon:'🩹', title:'Wound Care', desc:'Expert dressing, cleaning & post-op care', image:'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop&crop=center' },
  { icon:'💊', title:'Medication', desc:'Supervised medication administration & management', image:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop&crop=center' },
  { icon:'🩸', title:'Blood Tests', desc:'Home sample collection for lab tests', image:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop&crop=center' },
  { icon:'👶', title:'Pediatric Care', desc:'Specialized care for infants & children', image:'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop&crop=center' },
  { icon:'🧓', title:'Elderly Care', desc:'Full-time and part-time elderly care services', image:'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center' },
];

const steps = [
  { n:'01', icon:'🔍', title:'Search', desc:'Browse verified nurses by city, specialization and rating' },
  { n:'02', icon:'📅', title:'Book', desc:'Pick a date, time slot and confirm your booking' },
  { n:'03', icon:'🚗', title:'Nurse Arrives', desc:'Your nurse arrives at your address on time' },
  { n:'04', icon:'⭐', title:'Rate & Review', desc:'Share your experience after the visit' },
];

const testimonials = [
  { name:'Sara Malik', city:'Srinagar', text:'The nurse was professional and caring. Saved me a hospital trip!', rating:5 },
  { name:'Ahmed Raza', city:'Budgam', text:'Booked for my father\'s post-op care. Outstanding service.', rating:5 },
  { name:'Hina Ali', city:'Ganderbal', text:'Quick booking, verified nurse, and affordable price. Highly recommended!', rating:4 },
];

const stats = [
  { val:'100+', label:'Verified Nurses', icon:'👩‍⚕️' },
  { val:'200+', label:'Happy Patients', icon:'😊' },
  { val:'20+', label:'Districts Covered', icon:'🏙️' },
  { val:'4.8★', label:'Average Rating', icon:'⭐' },
];

export default function Home() {
  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg-shape"/>
        <div className="container hero-inner">
          <div className="hero-text fade-up">
            <div className="hero-tag"> 🏆 Kashmir's #1 Home Healthcare Platform</div>
            <h1>Professional <span>Nursing Care</span><br/>At Your Doorstep</h1>
            <p>Connect with certified, verified nurses for home visits, IV therapy, wound care, post-operative support, and specialized medical care — available 24/7 across Kashmir.</p>
            <div className="hero-actions">
              <Link to="/nurses" className="btn btn-teal"><span>🔍  </span>  Find a Nurse Now</Link>
              <Link to="/register?role=nurse" className="btn btn-outline"> <span>💼   </span>  Join as Nurse</Link>
            </div>
            <div className="hero-trust">
              <div className="trust-avatars">
                {['👩','👨','👩','👨','👩'].map((e,i) => <span key={i}>{e}</span>)}
              </div>
              <span>Trusted by <strong>5,000+</strong> families across Kashmir Valley</span>
            </div>
          </div>
          <div className="hero-card fade-up" style={{animationDelay:'.15s'}}>
            <div className="hcard-title">Quick Booking</div>
            <div className="hcard-item">
              <span>📍</span>
              <div><small>Location</small><strong>Srinagar</strong></div>
            </div>
            <div className="hcard-item">
              <span>👩‍⚕️</span>
              <div><small>Service</small><strong>General Nursing</strong></div>
            </div>
            <div className="hcard-item">
              <span>📅</span>
              <div><small>Date</small><strong>Today, ASAP</strong></div>
            </div>
            <Link to="/nurses" className="btn btn-teal" style={{width:'100%',justifyContent:'center'}}>Search Available Nurses</Link>
            <div className="hcard-badges">
              <span>✅ Verified</span>
              <span>🔒 Secure</span>
              <span>⚡ Fast</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-bar">
        <div className="container stats-inner">
          {stats.map((s,i) => (
            <div key={i} className="stat">
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-val">{s.val}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="section-tag">Our Services</span>
            <h2>What We Offer</h2>
            <p>Comprehensive home healthcare services delivered by qualified professionals</p>
          </div>
          <div className="services-grid">
            {services.map((s,i) => (
              <div key={i} className="service-card" style={{backgroundImage: `url(${s.image})`}}>
                <div className="service-overlay"/>
                <div className="service-content">
                  <div className="service-icon">{s.icon}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{textAlign:'center',marginTop:'36px'}}>
            <Link to="/services" className="btn btn-outline">View All Services →</Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section how-section">
        <div className="container">
          <div className="section-head">
            <span className="section-tag">Simple Process</span>
            <h2>How SehatSuhul Works</h2>
            <p>Book professional care in 4 easy steps</p>
          </div>
          <div className="steps-grid">
            {steps.map((s,i) => (
              <div key={i} className="step-card">
                <div className="step-num">{s.n}</div>
                <div className="step-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                {i < steps.length - 1 && <div className="step-arrow">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="section-tag">Testimonials</span>
            <h2>What Patients Say</h2>
          </div>
          <div className="testi-grid">
            {testimonials.map((t,i) => (
              <div key={i} className="testi-card">
                <Stars rating={t.rating}/>
                <p>"{t.text}"</p>
                <div className="testi-author">
                  <div className="testi-avatar">{t.name[0]}</div>
                  <div><strong>{t.name}</strong><span>{t.city}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container cta-inner">
          <div>
            <h2>Ready to Book a Nurse?</h2>
            <p>Hundreds of verified nurses available right now in your city.</p>
          </div>
          <div className="cta-btns">
            <Link to="/nurses" className="btn btn-teal">Find Nurses Now</Link>
            <Link to="/register?role=nurse" className="btn btn-outline" style={{color:'white',borderColor:'rgba(255,255,255,.4)'}}>Join as Nurse</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
