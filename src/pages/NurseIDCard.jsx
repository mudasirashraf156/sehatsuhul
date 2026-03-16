import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './NurseIDCard.css';

export default function NurseIDCard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const cardRef = useRef();

  useEffect(() => {
    axios.get('/api/nurses/my/profile')
      .then(r => { setProfile(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const downloadCard = () => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    script.onload = () => {
      window.html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = `SehatSehul-ID-${user.firstName}-${user.lastName}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    };
    document.head.appendChild(script);
  };

  if (loading) return <div className="page-loader">Loading ID Card…</div>;

  const joinYear = new Date(user?.createdAt || Date.now()).getFullYear();
  const expYear  = joinYear + 1;

  return (
    <div className="id-page">
      <div className="id-hero">
        <div className="container">
          <h1>My ID Card</h1>
          <p>Your official SehatSehul Nurse Identification Card</p>
        </div>
      </div>

      <div className="container id-body">
        {!profile?.isVerified && (
          <div className="alert alert-warning" style={{ marginBottom: 28 }}>
            ⏳ Your ID card will be fully activated once your license is verified by our admin team.
          </div>
        )}

        <div className="id-layout">
          {/* Card Preview */}
          <div className="card-preview-wrap">
            <p className="preview-label">Card Preview</p>

            {/* THE ACTUAL ID CARD */}
            <div className="id-card" ref={cardRef}>
              {/* Card Top */}
              <div className="ic-top">
                <div className="ic-top-left">
                  <div className="ic-logo-row">
                    <div className="ic-logo-icon">🩺</div>
                    <div className="ic-logo-text">Sehat<span>Sehul</span></div>
                  </div>
                  <div className="ic-tagline">Certified Healthcare Professional</div>
                </div>
                <div className="ic-top-right">
                  {profile?.isVerified
                    ? <div className="ic-verified">✓ VERIFIED</div>
                    : <div className="ic-pending">PENDING</div>}
                </div>
              </div>

              {/* Card Body */}
              <div className="ic-body">
                <div className="ic-avatar-wrap">
                  <div className="ic-avatar">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  <div className="ic-id-num">
                    ID: SS-{String(user?._id || '000').slice(-6).toUpperCase()}
                  </div>
                </div>

                <div className="ic-info">
                  <div className="ic-name">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="ic-spec">{profile?.specialization}</div>

                  <div className="ic-details">
                    <div className="ic-detail-row">
                      <span className="ic-detail-label">License No.</span>
                      <span className="ic-detail-val">{profile?.licenseNumber || '—'}</span>
                    </div>
                    <div className="ic-detail-row">
                      <span className="ic-detail-label">Experience</span>
                      <span className="ic-detail-val">{profile?.experience || 0} Years</span>
                    </div>
                    <div className="ic-detail-row">
                      <span className="ic-detail-label">City</span>
                      <span className="ic-detail-val">{profile?.city || user?.city || '—'}</span>
                    </div>
                    <div className="ic-detail-row">
                      <span className="ic-detail-label">Phone</span>
                      <span className="ic-detail-val">{user?.phone}</span>
                    </div>
                    <div className="ic-detail-row">
                      <span className="ic-detail-label">Valid Until</span>
                      <span className="ic-detail-val">Dec 31, {expYear}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Barcode strip */}
              <div className="ic-bottom">
                <div className="ic-barcode">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <div key={i} className="ic-bar" style={{
                      height: `${Math.random() * 16 + 8}px`,
                      width: i % 3 === 0 ? '3px' : '1.5px',
                      opacity: Math.random() * .5 + .5
                    }}/>
                  ))}
                </div>
                <div className="ic-bottom-text">
                  <span>SehatSehul Healthcare · J&K, India</span>
                  <span>support@sehatsehul.in</span>
                </div>
              </div>
            </div>
            {/* end card */}

            <div className="card-actions">
              <button className="btn btn-teal" onClick={downloadCard}>
                ⬇️ Download ID Card
              </button>
              <button className="btn btn-outline" onClick={() => window.print()}>
                🖨️ Print
              </button>
            </div>
          </div>

          {/* Info Panel */}
          <div className="id-info-panel">
            <div className="card id-info-card">
              <h3>Card Details</h3>
              <div className="info-rows">
                <div className="info-row">
                  <span>Full Name</span>
                  <strong>{user?.firstName} {user?.lastName}</strong>
                </div>
                <div className="info-row">
                  <span>Specialization</span>
                  <strong>{profile?.specialization}</strong>
                </div>
                <div className="info-row">
                  <span>License Number</span>
                  <strong>{profile?.licenseNumber || '—'}</strong>
                </div>
                <div className="info-row">
                  <span>Card ID</span>
                  <strong>SS-{String(user?._id || '000').slice(-6).toUpperCase()}</strong>
                </div>
                <div className="info-row">
                  <span>Status</span>
                  <strong>
                    {profile?.isVerified
                      ? <span className="badge badge-green">✅ Verified</span>
                      : <span className="badge badge-orange">⏳ Pending</span>}
                  </strong>
                </div>
                <div className="info-row">
                  <span>Valid Until</span>
                  <strong>Dec 31, {expYear}</strong>
                </div>
              </div>
            </div>

            <div className="card id-info-card" style={{ marginTop: 16 }}>
              <h3>How to Use</h3>
              <ul className="how-list">
                <li>📥 Download your ID card as a PNG image</li>
                <li>🖨️ Print it on a card-size paper</li>
                <li>📱 Show it digitally to patients</li>
                <li>🔄 Card renews automatically each year</li>
                <li>✅ Only verified nurses get active cards</li>
              </ul>
            </div>

            <div className="card id-info-card" style={{ marginTop: 16 }}>
              <h3>Services Listed</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                {(profile?.services || []).map((s, i) => (
                  <span key={i} className="badge badge-teal">{s}</span>
                ))}
                {(!profile?.services || profile.services.length === 0) && (
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>
                    No services added yet —
                    <a href="/nurse/profile" style={{ color: 'var(--teal)', marginLeft: 4 }}>
                      add from profile
                    </a>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}