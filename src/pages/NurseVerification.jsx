import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NurseVerification.css';

export default function NurseVerification() {
  const navigate = useNavigate();
  const [utr, setUtr] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!utr.trim()) return setError('Please enter your UTR / Transaction ID.');
    setSubmitting(true);
    setError('');
    try {
      await axios.post('/api/nurses/apply-verification', { utr: utr.trim() });
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    }
    setSubmitting(false);
  };

  if (done) return (
    <div className="nv-page">
      <div className="nv-card">
        <div className="nv-success-icon">✅</div>
        <h2>Application Submitted!</h2>
        <p>We have received your verification request. Our team will review your payment and approve your profile within <strong>24–48 hours</strong>.</p>
        <button className="btn btn-teal" onClick={() => navigate('/nurse/dashboard')}>Back to Dashboard</button>
      </div>
    </div>
  );

  return (
    <div className="nv-page">
      <div className="nv-card">
        <div className="nv-badge">🏅 Nurse Verification</div>
        <h1>Get Verified on SehatSehul</h1>
        <p className="nv-sub">Verified nurses get a <strong>✅ Verified</strong> badge, appear at the top of search results, and receive more patient bookings.</p>

        <div className="nv-benefits">
          <div className="nv-benefit">✅ Verified badge on your profile</div>
          <div className="nv-benefit">🔝 Priority in search results</div>
          <div className="nv-benefit">📈 More bookings & trust</div>
          <div className="nv-benefit">🎖️ Official SehatSehul ID Card</div>
        </div>

        <div className="nv-fee-box">
          <div className="nv-fee-label">One-time Verification Fee</div>
          <div className="nv-fee-amount">₹99 <span>only</span></div>
        </div>

        <div className="nv-payment-box">
          <h3>Pay via UPI</h3>
          <div className="nv-upi-id">
            <span>UPI ID:</span>
            <strong>7006188346@ybl</strong>
            <button onClick={() => navigator.clipboard.writeText('7006188346@ybl')} className="nv-copy-btn">Copy</button>
          </div>
          <p className="nv-pay-note">Send exactly <strong>₹99</strong> to the above UPI ID, then enter your Transaction / UTR ID below.</p>
        </div>

        <form onSubmit={submit} className="nv-form">
          <label>Transaction / UTR ID <span>*</span></label>
          <input
            type="text"
            placeholder="e.g. 421234567890"
            value={utr}
            onChange={e => setUtr(e.target.value)}
          />
          {error && <div className="nv-error">{error}</div>}
          <button type="submit" className="btn btn-teal nv-submit-btn" disabled={submitting}>
            {submitting ? 'Submitting…' : '🚀 Submit Verification Request'}
          </button>
        </form>

        <p className="nv-footer-note">After submitting, admin will verify your payment and approve your profile. For help, contact us on WhatsApp: <strong>+91 9186238841</strong></p>
      </div>
    </div>
  );
}
