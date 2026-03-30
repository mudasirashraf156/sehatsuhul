import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './StaticPages.css';

export function Services() {
  const [activeCategory, setActiveCategory] = useState('All');

 const services = [
    // Nurse Services
    {
      icon: '💉', category: 'Nursing',
      title: 'IV Therapy',
      desc: 'Professional IV drip administration including fluids, vitamins, antibiotics, and medications at home by certified nurses.',
      price: '₹1,500+',
      link: '/nurses',
      btnText: 'Book Nurse',
      image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&h=300&fit=crop&crop=center'
    },
    {
      icon: '🩹', category: 'Nursing',
      title: 'Wound Care & Dressing',
      desc: 'Expert wound cleaning, dressing changes, post-surgical suture care, and pressure ulcer management.',
      price: '₹800+',
      link: '/nurses',
      btnText: 'Book Nurse',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop&crop=center'
    },
    {
      icon: '💊', category: 'Nursing',
      title: 'Medication Administration',
      desc: 'Supervised oral, IM, and IV medication administration with monitoring for side effects.',
      price: '₹600+',
      link: '/nurses',
      btnText: 'Book Nurse',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop&crop=center'
    },
    {
      icon: '👶', category: 'Nursing',
      title: 'Pediatric Nursing',
      desc: 'Specialized care for children and newborns including vaccination support and pediatric assessments.',
      price: '₹1,000+',
      link: '/nurses',
      btnText: 'Book Nurse',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop&crop=center'
    },
    {
      icon: '🧓', category: 'Nursing',
      title: 'Elderly Care',
      desc: 'Full-time and part-time companion nursing, mobility assistance, and chronic condition management.',
      price: '₹900+',
      link: '/nurses',
      btnText: 'Book Nurse',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center'
    },
    {
      icon: '🏥', category: 'Nursing',
      title: 'Post-Op Recovery',
      desc: 'Professional post-operative monitoring, early mobilization, and recovery support at home.',
      price: '₹1,200+',
      link: '/nurses',
      btnText: 'Book Nurse',
      image: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400&h=300&fit=crop&crop=center'
    },
    {
      icon: '❤️', category: 'Nursing',
      title: 'Vital Signs Monitoring',
      desc: 'Regular blood pressure, oxygen, temperature, and pulse monitoring with detailed reports.',
      price: '₹500+',
      link: '/nurses',
      btnText: 'Book Nurse',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&h=300&fit=crop&crop=center'
    },
    {
      icon: '🧬', category: 'Nursing',
      title: 'ICU Home Care',
      desc: 'Critical care monitoring for high-dependency patients recovering at home with advanced equipment.',
      price: '₹2,500+',
      link: '/nurses',
      btnText: 'Book Nurse',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&crop=center'
    },

    // Lab Tests
    {
      icon: '🩸', category: 'Lab Tests',
      title: 'Complete Blood Count',
      desc: 'Home sample collection for CBC, blood sugar, lipid profile and all standard diagnostic tests.',
      price: '₹300+',
      link: '/book-test',
      btnText: 'Book Test',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop&crop=center'
    },
    {
      icon: '🧪', category: 'Lab Tests',
      title: 'Diabetes Panel',
      desc: 'Blood sugar fasting, random, HbA1c and full diabetes management panel at your doorstep.',
      price: '₹500+',
      link: '/book-test',
      btnText: 'Book Test',
      image: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=400&h=300&fit=crop&crop=center'
    },
    {
      icon: '🫀', category: 'Lab Tests',
      title: 'Heart & Lipid Profile',
      desc: 'Complete cholesterol, triglycerides, HDL, LDL panel to assess cardiovascular health.',
      price: '₹600+',
      link: '/book-test',
      btnText: 'Book Test',
      image: 'https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=400&h=300&fit=crop&crop=center'
    },
    {
      icon: '🦋', category: 'Lab Tests',
      title: 'Thyroid Profile',
      desc: 'T3, T4 and TSH panel for complete thyroid function assessment from home.',
      price: '₹800+',
      link: '/book-test',
      btnText: 'Book Test',
      image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop&crop=center'
    },
    {
      icon: '☀️', category: 'Lab Tests',
      title: 'Vitamin Deficiency Panel',
      desc: 'Vitamin D, B12, iron studies and full nutritional deficiency assessment.',
      price: '₹900+',
      link: '/book-test',
      btnText: 'Book Test',
      image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&h=300&fit=crop&crop=center'
    },
    {
      icon: '🦠', category: 'Lab Tests',
      title: 'Infection Panel',
      desc: 'Dengue NS1, typhoid widal, COVID-19 antigen and full infection screening.',
      price: '₹500+',
      link: '/book-test',
      btnText: 'Book Test',
      image: 'https://images.unsplash.com/photo-1584118624012-df056829fbd0?w=400&h=300&fit=crop&crop=center'
    },

    // Prescription & Help
    {
      icon: '📋', category: 'Free Help',
      title: 'Prescription Scan',
      desc: 'Upload your prescription and get it explained in simple language — medications, dosage and side effects.',
      price: 'FREE',
      link: '/scan',
      btnText: 'Try Free',
      image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=300&fit=crop&crop=center'
    },
    {
      icon: '💬', category: 'Free Help',
      title: 'Health Chat Assistant',
      desc: 'Ask any health question and get instant AI-powered guidance available 24/7 for free.',
      price: 'FREE',
      link: '/scan',
      btnText: 'Chat Now',
      image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&h=300&fit=crop&crop=center'
    },

    // Medical Shops
    {
      icon: '🏪', category: 'Medical Shops',
      title: 'Find Medical Shops',
      desc: 'Browse verified medical stores near you in Srinagar, Budgam and across J&K with phone numbers and location.',
      price: 'FREE',
      link: '/shops',
      btnText: 'Browse Shops',
      image: 'https://images.unsplash.com/photo-1563213126-a4273aed2016?w=400&h=300&fit=crop&crop=center'
    },
    {
      icon: '➕', category: 'Medical Shops',
      title: 'List Your Medical Shop',
      desc: 'Own a medical store? Register on SehatSehul and get discovered by thousands of patients in J&K.',
      price: '₹99/Month',
      link: '/shops/register',
      btnText: 'Register Shop',
      image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop&crop=center'
    },
  ];

  const categories = ['All', 'Nursing', 'Lab Tests', 'Free Help', 'Medical Shops'];
  const filtered = activeCategory === 'All' ? services : services.filter(s => s.category === activeCategory);

  return (
    <div className="services-page">
      {/* Hero */}
      <div className="services-hero">
        <div className="container">
          <div className="srv-tag">🩺 All Services</div>
          <h1>Our Healthcare Services</h1>
          <p>Professional medical care, lab tests, prescription help and verified medical shops — all in one place</p>
        </div>
      </div>

      <div className="container services-body">

        {/* Category Filter */}
        <div className="srv-categories">
          {categories.map(c => (
            <button
              key={c}
              className={`srv-cat-btn ${activeCategory === c ? 'active' : ''}`}
              onClick={() => setActiveCategory(c)}
            >
              {c === 'Nursing'       ? '👩‍⚕️ Nursing' :
               c === 'Lab Tests'    ? '🧪 Lab Tests' :
               c === 'Free Help'    ? '🆓 Free Help' :
               c === 'Medical Shops'? '🏪 Medical Shops' :
               '🏥 All Services'}
            </button>
          ))}
        </div>

        {/* Count */}
        <div className="srv-count">
          Showing <strong>{filtered.length}</strong> service{filtered.length !== 1 ? 's' : ''}
          {activeCategory !== 'All' && ` in ${activeCategory}`}
        </div>

        {/* Services Grid */}
        <div className="srv-grid">
          {filtered.map((s, i) => (
            <div key={i} className="srv-card" style={{backgroundImage:`url(${s.image})`}}>
              <div className={`srv-overlay ${s.price === 'FREE' ? 'free-overlay' : ''}`}/>
              <div className="srv-badge-cat">{s.category}</div>
              {s.price === 'FREE' && <div className="srv-free-badge">FREE</div>}
              <div className="srv-content">
                <div className="srv-icon">{s.icon}</div>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  <div className="srv-footer">
                    <span className="srv-price">
                      {s.price === 'FREE' ? '🆓 Free' : `From ${s.price}`}
                    </span>
                    <Link to={s.link} className="btn btn-teal btn-sm">{s.btnText}</Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div className="srv-cta-strip">
          <div className="srv-cta-item">
            <span>👩‍⚕️</span>
            <div>
              <strong>Need a nurse?</strong>
              <p>Browse 200+ verified nurses in J&K</p>
            </div>
            <Link to="/nurses" className="btn btn-teal btn-sm">Find Nurses</Link>
          </div>
          <div className="srv-cta-divider"/>
          <div className="srv-cta-item">
            <span>🧪</span>
            <div>
              <strong>Book a lab test?</strong>
              <p>Home sample collection available</p>
            </div>
            <Link to="/book-test" className="btn btn-teal btn-sm">Book Test</Link>
          </div>
          <div className="srv-cta-divider"/>
          <div className="srv-cta-item">
            <span>📋</span>
            <div>
              <strong>Have a prescription?</strong>
              <p>Get it explained for free</p>
            </div>
            <Link to="/scan" className="btn btn-teal btn-sm">Scan Free</Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export function About() {
  return (
    <div className="about-page">

      {/* Hero */}
      <div className="about-hero">
        <div className="container about-hero-inner">
          <div className="about-hero-text">
            <div className="about-tag">🩺 Who We Are</div>
            <h1>About <span>sehat sehul</span></h1>
            <p>
              sehat sehul is a modern healthcare platform dedicated to bringing professional
              medical support directly to your doorstep. Our goal is to simplify access to
              healthcare by connecting patients with qualified nurses, trusted pharmacies,
              and essential medical services — all through one seamless digital experience.
            </p>
            <div className="about-hero-btns">
              <a href="/nurses" className="btn btn-teal">Find a Nurse →</a>
              <a href="/contact" className="btn btn-outline">Contact Us</a>
            </div>
          </div>
          <div className="about-hero-card">
            <div className="ahc-item">
              <div className="ahc-icon">👩‍⚕️</div>
              <div><strong>200+</strong><span>Verified Nurses</span></div>
            </div>
            <div className="ahc-item">
              <div className="ahc-icon">🏪</div>
              <div><strong>50+</strong><span>Medical Shops</span></div>
            </div>
            <div className="ahc-item">
              <div className="ahc-icon">📍</div>
              <div><strong>15+</strong><span>Districts Covered</span></div>
            </div>
            <div className="ahc-item">
              <div className="ahc-icon">⭐</div>
              <div><strong>4.8★</strong><span>Average Rating</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className="about-mission">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-card">
              <div className="mc-icon">🎯</div>
              <h3>Our Mission</h3>
              <p>
                To make quality healthcare accessible, affordable, and convenient
                for every household in Jammu & Kashmir  from major cities to
                smaller towns and villages.
              </p>
            </div>
            <div className="mission-card">
              <div className="mc-icon">👁️</div>
              <h3>Our Vision</h3>
              <p>
                A J&K where no patient has to travel far for basic healthcare.
                Where certified professionals reach you — not the other way around.
              </p>
            </div>
            <div className="mission-card">
              <div className="mc-icon">💡</div>
              <h3>Our Approach</h3>
              <p>
                We combine technology with human compassion. Every nurse is verified,
                every shop is trusted, and every interaction is designed to make you
                feel safe and cared for.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Story */}
      <div className="about-story">
        <div className="container about-story-inner">
          <div className="about-story-text">
            <div className="about-tag">📖 Our Story</div>
            <h2>Why We Built sehat sehul</h2>
            <p>
              We understand that healthcare should be timely, reliable, and comfortable.
              With sehat sehul, users can easily book home nursing services, order medicines
              from verified pharmacies, and stay informed about their well-being  all
              within a secure and user-friendly environment.
            </p>
            <p>
              At sehat sehul, we believe that technology should enhance compassion in
              healthcare. By combining innovation with human care, we aim to create a
              trusted space where healthcare becomes more accessible, convenient, and
              supportive for everyone who needs it.
            </p>
            <div className="story-points">
              <div className="story-point">
                <span>✅</span>
                <span>PNC/INC verified nurses only</span>
              </div>
              <div className="story-point">
                <span>✅</span>
                <span>Drug-licensed medical shops</span>
              </div>
              <div className="story-point">
                <span>✅</span>
                <span>Home lab sample collection</span>
              </div>
              <div className="story-point">
                <span>✅</span>
                <span>Free prescription scanning</span>
              </div>
              <div className="story-point">
                <span>✅</span>
                <span>Secure & private data handling</span>
              </div>
              <div className="story-point">
                <span>✅</span>
                <span>24/7 support across J&K</span>
              </div>
            </div>
          </div>
          <div className="about-story-visual">
            <div className="story-visual-card">
              <div className="svc-header">
                <div className="svc-dot green"/>
                <div className="svc-dot yellow"/>
                <div className="svc-dot red"/>
              </div>
              <div className="svc-body">
                <div className="svc-row"><span>🩺</span><div><strong>Nurse Booking</strong><small>Confirmed in minutes</small></div><span className="svc-badge green">Live</span></div>
                <div className="svc-row"><span>🧪</span><div><strong>Lab Tests</strong><small>Home collection</small></div><span className="svc-badge green">Live</span></div>
                <div className="svc-row"><span>💊</span><div><strong>Medical Shops</strong><small>Verified stores</small></div><span className="svc-badge green">Live</span></div>
                <div className="svc-row"><span>📋</span><div><strong>Rx Scan</strong><small>Free & instant</small></div><span className="svc-badge green">Live</span></div>
                <div className="svc-row"><span>📱</span><div><strong>Mobile App</strong><small>iOS & Android</small></div><span className="svc-badge orange">Soon</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quote */}
      <div className="about-quote">
        <div className="container">
          <div className="quote-inner">
            <div className="quote-mark">"</div>
            <blockquote>
              True healing begins not only with medicine, but with care,
              comfort, and the feeling of being safe at home.
            </blockquote>
            <div className="quote-author">· SehatSehul</div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="about-values">
        <div className="container">
          <div className="about-tag" style={{display:'inline-block',marginBottom:14}}>💎 Our Values</div>
          <h2 className="about-section-title">What We Stand For</h2>
          <div className="values-grid">
            {[
              { icon:'🔒', title:'Trust',        desc:'Every nurse, shop and lab on our platform is verified by our team before going live.' },
              { icon:'❤️', title:'Compassion',   desc:'We design every feature with empathy because healthcare is deeply personal.' },
              { icon:'⚡', title:'Speed',        desc:'From booking to arrival, we aim for the fastest possible response times in J&K.' },
              { icon:'🌍', title:'Accessibility',desc:'Quality healthcare for everyone whether in Srinagar or a remote district.' },
              { icon:'🔍', title:'Transparency', desc:'No hidden fees, clear pricing, honest reviews. What you see is what you get.' },
              { icon:'📈', title:'Innovation',   desc:'We continuously improve our platform to serve patients and healthcare workers better.' },
            ].map((v, i) => (
              <div key={i} className="value-card">
                <div className="value-icon">{v.icon}</div>
                <h4>{v.title}</h4>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="about-cta">
        <div className="container about-cta-inner">
          <div>
            <h2>Ready to Experience Better Healthcare?</h2>
            <p>Join thousands of patients across J&K who trust sehat sehul for their care.</p>
          </div>
          <div className="about-cta-btns">
            <a href="/register" className="btn btn-teal">Get Started Free →</a>
            <a href="/nurses" className="btn btn-outline" style={{color:'white',borderColor:'rgba(255,255,255,.4)'}}>Browse Nurses</a>
          </div>
        </div>
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
          <a href="tel:+917006188346" className="contact-card">
            <div className="cc-icon phone">📞</div>
            <div className="cc-label">Call Us</div>
            <div className="cc-val">70061 88346</div>
            <div className="cc-hint">Mon–Sun, 8AM–9PM</div>
          </a>
          <a href="mailto:sehatsehul@gmail.com" className="contact-card">
            <div className="cc-icon email">📧</div>
            <div className="cc-label">Email Us</div>
            <div className="cc-val">sehatsehul@gmail.com</div>
            <div className="cc-hint">Reply within 24 hours</div>
          </a>
          <a href="https://wa.me/919186238841" target="_blank" rel="noreferrer" className="contact-card">
            <div className="cc-icon whatsapp">💬</div>
            <div className="cc-label">WhatsApp</div>
            <div className="cc-val">+91 91862 38841</div>
            <div className="cc-hint">Fastest response</div>
          </a>
          <div className="contact-card no-link">
            <div className="cc-icon hours">🕐</div>
            <div className="cc-label">Working Hours</div>
            <div className="cc-val">Mon – Sun</div>
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
                  <div className="co-row-val">Srinagar<br/>Jammu & Kashmir  191111</div>
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
                <a href="https://www.instagram.com/sehatsehul?igsh=MTF2anhvcjJzc3Zlcw%3D%3D&utm_source=qr" target="_blank" rel="noreferrer" className="social-link-card instagram">
                  <span>📸</span>
                  <div>
                    <strong>Instagram</strong>
                    <small>@sehatsehul</small>
                  </div>
                  <span className="sl-arrow">↗</span>
                </a>
                <a href="https://wa.me/917780906871" target="_blank" rel="noreferrer" className="social-link-card whatsapp">
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

// export function Privacy() {
//   return (
//     <div className="static-page">
//       <h1 className="static-h1">Privacy Policy & Terms of Use – SehatSehul</h1>
//       <p style={{fontSize:16,color:'var(--muted)',lineHeight:1.8,marginBottom:24}}>
//         At SehatSehul, we are committed to protecting the privacy, security, and trust of our users. This platform is designed to provide convenient access to healthcare-related services such as home nursing support, medicine ordering, and basic health service coordination. To ensure a safe and reliable experience, we follow strict standards for the collection, use, and protection of personal information.
//       </p>
//       <h2 className="static-sec">Privacy Policy</h2>
//       <p style={{fontSize:15,color:'var(--muted)',lineHeight:1.8,marginBottom:24}}>
//         SehatSehul may collect basic personal information including name, contact details, location, and health-related information necessary for delivering requested healthcare services. This information is used solely to facilitate service requests, improve user experience, and maintain the functionality of the platform. All user data is handled with strict confidentiality and is stored using secure systems designed to protect against unauthorized access. SehatSehul does not sell, trade, or misuse personal data. Information may only be shared with relevant service providers when necessary to fulfill user requests or when required by applicable laws and regulations.
//       </p>
//       <h2 className="static-sec">Terms and Conditions</h2>
//       <p style={{fontSize:15,color:'var(--muted)',lineHeight:1.8,marginBottom:24}}>
//         By accessing or using the SehatSehul application, users agree to comply with the terms and conditions of the platform. Users are responsible for providing accurate and complete information while requesting services. SehatSehul acts as a digital platform that connects users with healthcare-related services; however, it does not replace professional medical diagnosis, emergency care, or hospital treatment. The platform is not responsible for delays, unavailability of services, or issues arising from third-party providers.
//       </p>
//       <p style={{fontSize:15,color:'var(--muted)',lineHeight:1.8,marginBottom:24}}>
//         Users must use the application responsibly and in accordance with applicable laws. Any misuse, fraudulent activity, or violation of platform policies may result in suspension or termination of access to the application.
//       </p>
//       <h2 className="static-sec">Acceptance of Policy</h2>
//       <p style={{fontSize:15,color:'var(--muted)',lineHeight:1.8,marginBottom:24}}>
//         By continuing to access or use the SehatSehul application, users acknowledge that they have read, understood, and agreed to the Privacy Policy and Terms of Use outlined above.
//       </p>
//       <blockquote style={{fontSize:16,color:'var(--teal)',fontStyle:'italic',textAlign:'center',marginTop:32}}>
//         "Your trust is our responsibility, and your health and privacy remain our highest priority."
//       </blockquote>
//     </div>
//   );
// }
export function TermsAndConditions() {
  return (
    <div className="legal-page">
      <div className="legal-hero">
        <div className="container">
          <div className="legal-tag">📋 Legal</div>
          <h1>Terms & Conditions</h1>
          <p>Last updated: January 2025 · Please read carefully before using SehatSehul</p>
        </div>
      </div>

      <div className="container legal-body">
        <div className="legal-layout">
          <div className="legal-content">

            <div className="legal-intro">
              Welcome to <strong>SehatSehul</strong>  your trusted home healthcare platform in Jammu & Kashmir. By using this application, you agree to the following terms and conditions.
            </div>

            <div className="legal-section">
              <div className="legal-num">01</div>
              <div>
                <h2>Platform Use</h2>
                <p>SehatSehul connects patients with certified nurses, diagnostic laboratories, and verified pharmacies to make healthcare access easier and more convenient across Jammu & Kashmir.</p>
              </div>
            </div>

            <div className="legal-section">
              <div className="legal-num">02</div>
              <div>
                <h2>Our Commitment</h2>
                <p>We aim to onboard registered nurses with valid PNC licenses, trusted pharmacies with drug licenses, and verified diagnostic laboratories to ensure a reliable and safe experience for all users.</p>
              </div>
            </div>

            <div className="legal-section">
              <div className="legal-num">03</div>
              <div>
                <h2>User Responsibility</h2>
                <p>All users are advised to communicate clearly, verify details, and make informed decisions before availing any service through the platform. You are responsible for the accuracy of the information you provide during registration.</p>
              </div>
            </div>

            <div className="legal-section">
              <div className="legal-num">04</div>
              <div>
                <h2>Disputes Between Users & Providers</h2>
                <p>In case of any misunderstanding, issue, or dispute between a patient and a nurse, laboratory, or pharmacy  it will be handled directly between the parties involved.</p>
                <div className="legal-note">
                  ⚠️ SehatSehul will not be liable or involved in disputes arising from services rendered between users and healthcare providers.
                </div>
              </div>
            </div>

            <div className="legal-section">
              <div className="legal-num">05</div>
              <div>
                <h2>Medical Shop Registration</h2>
                <p>Medical shops registering on SehatSehul must hold a valid Drug License issued by the relevant authority. A registration fee of ₹99/Month applies. Approval is subject to admin verification. Fees are non-refundable once the listing is approved.</p>
              </div>
            </div>

            <div className="legal-section">
              <div className="legal-num">06</div>
              <div>
                <h2>Nurse Registration</h2>
                <p>Nurses must hold a valid Pakistan/India Nursing Council (PNC/INC) registration number. All profiles are reviewed and verified by our admin team before going live. SehatSehul reserves the right to revoke verification at any time.</p>
              </div>
            </div>

            <div className="legal-section">
              <div className="legal-num">07</div>
              <div>
                <h2>Emergency Situations</h2>
                <div className="legal-note danger">
                  🚑 SehatSehul should <strong>NOT</strong> be used in emergency situations. Please contact emergency services (108) directly when immediate medical help is required.
                </div>
              </div>
            </div>

            <div className="legal-section">
              <div className="legal-num">08</div>
              <div>
                <h2>Lab Tests & Home Collection</h2>
                <p>Lab test bookings are managed separately from nurse bookings. Payment is collected in cash by the assigned technician at the time of sample collection. Reports are delivered digitally once processed.</p>
              </div>
            </div>

            <div className="legal-section">
              <div className="legal-num">09</div>
              <div>
                <h2>Future Improvements</h2>
                <p>We are continuously working to improve verification, trust, and service quality. New safety features and improvements may be added over time without prior notice.</p>
              </div>
            </div>

            <div className="legal-section">
              <div className="legal-num">10</div>
              <div>
                <h2>Changes to Terms</h2>
                <p>SehatSehul reserves the right to update or modify these Terms and Conditions at any time. Continued use of the platform after changes constitutes your acceptance of the revised terms.</p>
              </div>
            </div>

            <div className="legal-section">
              <div className="legal-num">11</div>
              <div>
                <h2>Acceptance of Terms</h2>
                <p>By creating an account or using this application, you confirm that you have read, understood, and agreed to these Terms and Conditions in full.</p>
              </div>
            </div>

            <div className="legal-contact">
              <h3>Questions about these terms?</h3>
              <p>Contact us at <a href="mailto:sehatsehul@gmail.com">sehatsehul@gmail.com</a> or call <a href="tel:+917006188346">+91 70061 88346</a></p>
            </div>

          </div>

          {/* Sidebar */}
          <div className="legal-sidebar">
            <div className="card legal-sidebar-card">
              <h4>Quick Navigation</h4>
              <div className="legal-nav">
                {['Platform Use','Our Commitment','User Responsibility','Disputes','Medical Shops','Nurse Registration','Emergencies','Lab Tests','Changes to Terms','Acceptance'].map((item, i) => (
                  <div key={i} className="legal-nav-item">
                    <span>{String(i+1).padStart(2,'0')}</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card legal-sidebar-card" style={{marginTop:16}}>
              <h4>Related</h4>
              <a href="/privacy" className="legal-related-link">🔒 Privacy Policy →</a>
              <a href="/contact" className="legal-related-link">📞 Contact Us →</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PrivacyPolicy() {
  return (
    <div className="legal-page">
      <div className="legal-hero">
        <div className="container">
          <div className="legal-tag">🔒 Privacy</div>
          <h1>Privacy Policy</h1>
          <p>Last updated: January 2025 · Your privacy is our priority</p>
        </div>
      </div>

      <div className="container legal-body">
        <div className="legal-layout">
          <div className="legal-content">

            <div className="legal-intro">
              At <strong>SehatSehul</strong>, we are committed to protecting your personal and medical information. This policy explains how we collect, use, and safeguard your data.
            </div>

            <div className="legal-section">
              <div className="legal-num">01</div>
              <div>
                <h2>Information We Collect</h2>
                <p>We collect the following information when you register or use our platform:</p>
                <ul className="legal-list">
                  <li>Full name, email address, phone number and city</li>
                  <li>Role-specific info (nurse license, shop drug license)</li>
                  <li>Booking details including address and service type</li>
                  <li>Prescription images uploaded via the Scan & Help feature</li>
                  <li>Lab test orders and medical history you provide</li>
                </ul>
              </div>
            </div>

            <div className="legal-section">
              <div className="legal-num">02</div>
              <div>
                <h2>How We Use Your Data</h2>
                <p>Your information is used only to:</p>
                <ul className="legal-list">
                  <li>Connect you with relevant nurses, labs and medical shops</li>
                  <li>Process your bookings and lab test orders</li>
                  <li>Verify nurse licenses and shop registrations</li>
                  <li>Provide customer support and respond to queries</li>
                  <li>Improve our platform and services</li>
                </ul>
              </div>
            </div>

            <div className="legal-section">
              <div className="legal-num">03</div>
              <div>
                <h2>Data Protection</h2>
                <p>We implement industry-standard security measures to keep your data secure:</p>
                <ul className="legal-list">
                  <li>All passwords are encrypted using bcrypt hashing</li>
                  <li>Authentication via secure JWT tokens</li>
                  <li>Data stored on secure MongoDB Atlas cloud servers</li>
                  <li>HTTPS encryption for all data transmission</li>
                </ul>
              </div>
            </div>

            <div className="legal-section">
              <div className="legal-num">04</div>
              <div>
                <h2>Prescription & Medical Data</h2>
                <p>Prescriptions and health-related data uploaded through our Scan & Help feature are treated with the highest level of confidentiality. This data is only accessible to our admin team for support purposes and is never shared publicly.</p>
                <div className="legal-note">
                  🔒 Your medical data will never be sold, shared, or used for advertising purposes.
                </div>
              </div>
            </div>

            <div className="legal-section">
              <div className="legal-num">05</div>
              <div>
                <h2>Third-Party Interaction</h2>
                <p>While we connect you with trusted and registered service providers (nurses, labs, medical shops), any information you share directly with them during a service is at your discretion. SehatSehul is not responsible for third-party data handling.</p>
              </div>
            </div>

            <div className="legal-section">
              <div className="legal-num">06</div>
              <div>
                <h2>Data Sharing</h2>
                <p>We do not sell, trade, or share your personal information with third parties except:</p>
                <ul className="legal-list">
                  <li>When required by law or government authorities</li>
                  <li>With your explicit consent</li>
                  <li>To service providers strictly for fulfilling your booking</li>
                </ul>
              </div>
            </div>

            <div className="legal-section">
              <div className="legal-num">07</div>
              <div>
                <h2>Your Rights</h2>
                <p>You have the right to:</p>
                <ul className="legal-list">
                  <li>Access your personal data at any time</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your account and data</li>
                  <li>Opt out of non-essential communications</li>
                </ul>
                <p style={{marginTop:10}}>To exercise these rights, contact us at <a href="mailto:sehatsehul@gmail.com" style={{color:'var(--teal)'}}>sehatsehul@gmail.com</a></p>
              </div>
            </div>

            <div className="legal-section">
              <div className="legal-num">08</div>
              <div>
                <h2>Limitation of Liability</h2>
                <p>SehatSehul provides access to trusted healthcare services, but any actions, services, or outcomes after connecting users with providers are beyond our control. We are not liable for outcomes of medical services rendered.</p>
              </div>
            </div>

            <div className="legal-section">
              <div className="legal-num">09</div>
              <div>
                <h2>Changes to This Policy</h2>
                <p>We may update this Privacy Policy from time to time. Any changes will be reflected on this page with an updated date. Continued use of SehatSehul constitutes acceptance of the revised policy.</p>
              </div>
            </div>

            <div className="legal-contact">
              <h3>Privacy concerns?</h3>
              <p>Contact us at <a href="mailto:sehatsehul@gmail.com">sehatsehul@gmail.com</a> or call <a href="tel:+917006188346">+91 70061 88346</a></p>
            </div>

          </div>

          {/* Sidebar */}
          <div className="legal-sidebar">
            <div className="card legal-sidebar-card">
              <h4>Quick Navigation</h4>
              <div className="legal-nav">
                {['Information We Collect','How We Use Data','Data Protection','Medical Data','Third Parties','Data Sharing','Your Rights','Limitation','Policy Changes'].map((item, i) => (
                  <div key={i} className="legal-nav-item">
                    <span>{String(i+1).padStart(2,'0')}</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card legal-sidebar-card" style={{marginTop:16}}>
              <h4>Related</h4>
              <a href="/terms" className="legal-related-link">📋 Terms & Conditions →</a>
              <a href="/contact" className="legal-related-link">📞 Contact Us →</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}