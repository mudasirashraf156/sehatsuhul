import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './ShopDetail.css';

export default function ShopDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [shop, setShop]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/shops/${id}`)
      .then(r => { setShop(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-loader">Loading shop details…</div>;
  if (!shop)   return (
    <div className="page-loader">
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:48,marginBottom:16}}>🏪</div>
        <h3>Shop not found</h3>
        <Link to="/shops" className="btn btn-teal" style={{marginTop:16,display:'inline-flex'}}>← Back to Shops</Link>
      </div>
    </div>
  );

  const mapUrl       = `https://maps.google.com/?q=${encodeURIComponent(shop.address + ', ' + shop.city + ', J&K')}`;
  const waUrl        = shop.whatsapp ? `https://wa.me/91${shop.whatsapp.replace(/\D/g,'')}` : null;
  const phoneUrl     = `tel:${shop.phone}`;
  const directionsUrl= `https://maps.google.com/maps/dir/?api=1&destination=${encodeURIComponent(shop.address + ', ' + shop.city)}`;

  return (
    <div className="sd-page">

      {/* Hero */}
      <div className="sd-hero">
        <div className="container">
          <Link to="/shops" className="sd-back">← Back to Medical Shops</Link>
          <div className="sd-hero-inner">
            <div className="sd-image-wrap">
              {shop.image ? (
                <img
                  src={`${axios.defaults.baseURL}/uploads/${shop.image}`}
                  alt={shop.shopName}
                  className="sd-image"
                />
              ) : (
                <div className="sd-image-placeholder">🏪</div>
              )}
              {shop.isVerified  && <div className="sd-badge verified">✅ Verified</div>}
              {shop.isFeatured  && <div className="sd-badge featured">⭐ Featured</div>}
              {shop.isOpen24x7  && <div className="sd-badge open24">🕐 Open 24×7</div>}
            </div>

            <div className="sd-hero-info">
              <h1>{shop.shopName}</h1>
              <div className="sd-owner">👤 {shop.ownerName}</div>
              <div className="sd-location">📍 {shop.address}, {shop.city}, {shop.district} — {shop.pincode}</div>
              {shop.timing && !shop.isOpen24x7 && (
                <div className="sd-timing">🕐 {shop.timing}</div>
              )}
              {shop.isOpen24x7 && (
                <div className="sd-timing open">🟢 Open 24 Hours · 7 Days a Week</div>
              )}

              {/* Action Buttons */}
              <div className="sd-actions">
                <a href={phoneUrl} className="sd-btn sd-btn-teal">
                  📞 Call Now
                </a>
                {waUrl && (
                  <a href={waUrl} target="_blank" rel="noreferrer" className="sd-btn sd-btn-green">
                    💬 WhatsApp
                  </a>
                )}
                <a href={mapUrl} target="_blank" rel="noreferrer" className="sd-btn sd-btn-outline">
                  🗺️ View on Map
                </a>
                <a href={directionsUrl} target="_blank" rel="noreferrer" className="sd-btn sd-btn-outline">
                  🧭 Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container sd-body">
        <div className="sd-layout">

          {/* Left — Main Info */}
          <div className="sd-main">

            {/* Description */}
            {shop.description && (
              <div className="card sd-section">
                <h2>About This Shop</h2>
                <p>{shop.description}</p>
              </div>
            )}

            {/* Services */}
            {shop.services?.length > 0 && (
              <div className="card sd-section">
                <h2>Products & Services</h2>
                <div className="sd-services">
                  {shop.services.map((s, i) => (
                    <div key={i} className="sd-service-tag">
                      <span>💊</span> {s}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map embed */}
            <div className="card sd-section">
              <h2>Location on Map</h2>
              <p className="sd-address-text">📍 {shop.address}, {shop.city}, {shop.district}, J&K</p>
              <div className="sd-map-wrap">
                <iframe
                  title="Shop Location"
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyD-9tSrke72NouzeaKD8wPFAbxIqd20JuA&q=${encodeURIComponent(shop.address + ', ' + shop.city + ', Jammu and Kashmir')}`}
                  width="100%"
                  height="260"
                  style={{ border:'none', borderRadius:12 }}
                  allowFullScreen=""
                  loading="lazy"
                />
              </div>
              <div className="sd-map-actions">
                <a href={mapUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                  🗺️ Open in Google Maps
                </a>
                <a href={directionsUrl} target="_blank" rel="noreferrer" className="btn btn-teal btn-sm">
                  🧭 Get Directions
                </a>
              </div>
            </div>

          </div>

          {/* Right — Sidebar */}
          <div className="sd-sidebar">

            {/* Contact card */}
            <div className="card sd-contact-card">
              <h3>Contact Information</h3>
              <div className="sd-contact-rows">
                <div className="sd-contact-row">
                  <div className="sd-contact-icon">📞</div>
                  <div>
                    <div className="sd-contact-label">Phone</div>
                    <a href={phoneUrl} className="sd-contact-val">{shop.phone}</a>
                  </div>
                </div>
                {shop.whatsapp && (
                  <div className="sd-contact-row">
                    <div className="sd-contact-icon">💬</div>
                    <div>
                      <div className="sd-contact-label">WhatsApp</div>
                      <a href={waUrl} target="_blank" rel="noreferrer" className="sd-contact-val">{shop.whatsapp}</a>
                    </div>
                  </div>
                )}
                {shop.email && (
                  <div className="sd-contact-row">
                    <div className="sd-contact-icon">✉️</div>
                    <div>
                      <div className="sd-contact-label">Email</div>
                      <a href={`mailto:${shop.email}`} className="sd-contact-val">{shop.email}</a>
                    </div>
                  </div>
                )}
                <div className="sd-contact-row">
                  <div className="sd-contact-icon">📍</div>
                  <div>
                    <div className="sd-contact-label">Address</div>
                    <div className="sd-contact-val">{shop.address}, {shop.city}</div>
                  </div>
                </div>
                <div className="sd-contact-row">
                  <div className="sd-contact-icon">🗺️</div>
                  <div>
                    <div className="sd-contact-label">District</div>
                    <div className="sd-contact-val">{shop.district} — {shop.pincode || 'J&K'}</div>
                  </div>
                </div>
                <div className="sd-contact-row">
                  <div className="sd-contact-icon">🕐</div>
                  <div>
                    <div className="sd-contact-label">Hours</div>
                    <div className="sd-contact-val">{shop.isOpen24x7 ? '🟢 Open 24×7' : shop.timing}</div>
                  </div>
                </div>
                <div className="sd-contact-row">
                  <div className="sd-contact-icon">📋</div>
                  <div>
                    <div className="sd-contact-label">License No.</div>
                    <div className="sd-contact-val">{shop.licenseNo}</div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <a href={phoneUrl} className="sd-cta-btn">
                📞 Call This Shop
              </a>
              {waUrl && (
                <a href={waUrl} target="_blank" rel="noreferrer" className="sd-cta-btn sd-cta-wa">
                  💬 Message on WhatsApp
                </a>
              )}
            </div>

            {/* Quick info */}
            <div className="card sd-quick-card">
              <h3>Quick Info</h3>
              <div className="sd-quick-rows">
                <div className="sd-quick-row">
                  <span>Status</span>
                  {shop.isVerified
                    ? <span className="badge badge-green">✅ Verified</span>
                    : <span className="badge badge-orange">⏳ Unverified</span>}
                </div>
                <div className="sd-quick-row">
                  <span>Hours</span>
                  <strong>{shop.isOpen24x7 ? '24×7' : shop.timing}</strong>
                </div>
                <div className="sd-quick-row">
                  <span>City</span>
                  <strong>{shop.city}</strong>
                </div>
                <div className="sd-quick-row">
                  <span>District</span>
                  <strong>{shop.district}</strong>
                </div>
              </div>
            </div>

            {/* Back to shops */}
            <Link to="/shops" className="btn btn-outline" style={{width:'100%',justifyContent:'center',display:'flex'}}>
              ← Browse More Shops
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
}