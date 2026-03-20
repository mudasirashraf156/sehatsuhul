import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Bookings.css';

const STATUS_STEPS = {
  pending:          { step: 1, label: 'Order Placed',      color: 'badge-orange' },
  confirmed:        { step: 2, label: 'Confirmed',         color: 'badge-blue'   },
  sample_collected: { step: 3, label: 'Sample Collected',  color: 'badge-teal'   },
  processing:       { step: 4, label: 'Processing',        color: 'badge-teal'   },
  completed:        { step: 5, label: 'Report Ready ✅',   color: 'badge-green'  },
  cancelled:        { step: 0, label: 'Cancelled',         color: 'badge-rose'   },
};

export default function PatientLabTests() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/labtests/my')
      .then(r => { setOrders(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const cancel = async (id) => {
    if (!window.confirm('Cancel this lab test order?')) return;
    await axios.patch(`/api/labtests/${id}/cancel`);
    setOrders(orders.map(o => o._id === id ? { ...o, status: 'cancelled' } : o));
  };

  return (
    <div className="bookings-page">
      <div className="bk-header">
        <div className="container">
          <h1>🧪 My Lab Tests</h1>
          <p>Track your lab test orders and results</p>
        </div>
      </div>
      <div className="container bk-body">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
          <span style={{color:'var(--muted)',fontSize:14}}>{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
          <Link to="/book-test" className="btn btn-teal btn-sm">+ Book New Test</Link>
        </div>

        {loading ? <div className="page-loader">Loading orders…</div>
        : orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🧪</div>
            <h3>No lab test orders yet</h3>
            <p>Book your first home lab test</p>
            <Link to="/book-test" className="btn btn-teal" style={{marginTop:16}}>Book a Test</Link>
          </div>
        ) : (
          <div className="bk-list">
            {orders.map(o => {
              const s = STATUS_STEPS[o.status] || STATUS_STEPS.pending;
              return (
                <div key={o._id} className="bk-card">
                  <div className="bk-card-top">
                    <div className="bk-nurse-info">
                      <div className="bk-avatar" style={{background:'linear-gradient(135deg,#0d9488,#14b8a6)',fontSize:20}}>🧪</div>
                      <div>
                        <h3>Lab Test Order</h3>
                        <span>{o.tests?.join(', ')}</span>
                      </div>
                    </div>
                    <span className={`badge ${s.color}`}>{s.label}</span>
                  </div>

                  {/* Progress bar */}
                  {o.status !== 'cancelled' && (
                    <div style={{padding:'12px 24px',background:'var(--bg)',borderBottom:'1px solid var(--border)'}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                        {['Placed','Confirmed','Collected','Processing','Done'].map((l, i) => (
                          <span key={l} style={{fontSize:10,color: s.step > i ? 'var(--teal)' : 'var(--muted)',fontWeight: s.step > i ? 700 : 400}}>
                            {l}
                          </span>
                        ))}
                      </div>
                      <div style={{height:4,background:'var(--border)',borderRadius:4,overflow:'hidden'}}>
                        <div style={{height:'100%',background:'var(--teal)',borderRadius:4,width:`${(s.step/5)*100}%`,transition:'width .5s'}}/>
                      </div>
                    </div>
                  )}

                  <div className="bk-details">
                    <div><span>📅</span> {new Date(o.bookingDate).toLocaleDateString('en-IN', {weekday:'long',year:'numeric',month:'long',day:'numeric'})}</div>
                    <div><span>⏰</span> {o.timeSlot}</div>
                    <div><span>📍</span> {o.address}, {o.city}</div>
                    <div><span>💵</span> ₹{o.totalAmount} — {o.isPaid ? 'Paid' : 'Cash on Collection'}</div>
                    {o.assignedLab   && <div><span>🏥</span> Lab: {o.assignedLab}</div>}
                    {o.adminNotes    && <div><span>📝</span> {o.adminNotes}</div>}
                  </div>

                  <div className="bk-footer">
                    <div className="bk-total">
                      Order: <strong>{o._id.slice(-8).toUpperCase()}</strong>
                    </div>
                    <div className="bk-actions">
                      {o.status === 'completed' && o.reportUrl && (
                        <a href={o.reportUrl} target="_blank" rel="noreferrer" className="btn btn-teal btn-sm">
                          📄 View Report
                        </a>
                      )}
                      {o.status === 'pending' && (
                        <button onClick={() => cancel(o._id)}
                          style={{background:'var(--rose-l)',color:'var(--rose)',border:'none',borderRadius:'50px',padding:'8px 18px',fontWeight:600,fontSize:13,cursor:'pointer'}}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}