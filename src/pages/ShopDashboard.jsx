import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const CATEGORIES = ['General','Prescription','OTC','Ayurvedic','Vitamins','Diabetic Care','Baby Products','Surgical','Cosmetics','First Aid'];

export default function ShopDashboard() {
  const { user } = useAuth();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');

  // Medicine state
  const [medicines, setMedicines] = useState([]);
  const [medLoading, setMedLoading] = useState(false);
  const [medForm, setMedForm] = useState({ name:'', brand:'', price:'', category:'General', description:'', inStock:true });
  const [medImage, setMedImage] = useState(null);
  const [editingMed, setEditingMed] = useState(null);
  const [medSaving, setMedSaving] = useState(false);
  const medFormRef = useRef();

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [payUtr, setPayUtr] = useState('');
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState('');

  const submitPayment = async () => {
    setPayError('');
    setPayLoading(true);
    try {
      await axios.patch(`/api/shops/${shop._id}/pay`, { paymentRef: payUtr || 'PENDING_MANUAL' });
      setShop({ ...shop, isPaid: true });
    } catch {
      setPayError('Payment update failed. Please try again.');
    }
    setPayLoading(false);
  };

  useEffect(() => {
    axios.get('/api/shops/my/shop')
      .then(r => { setShop(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (tab === 'medicines' && shop) {
      setMedLoading(true);
      axios.get('/api/medicines/my')
        .then(r => { setMedicines(r.data); setMedLoading(false); })
        .catch(() => setMedLoading(false));
    }
    if (tab === 'orders' && shop) {
      setOrdersLoading(true);
      axios.get('/api/orders/shop')
        .then(r => { setOrders(r.data); setOrdersLoading(false); })
        .catch(() => setOrdersLoading(false));
    }
  }, [tab, shop]);

  const resetMedForm = () => {
    setMedForm({ name:'', brand:'', price:'', category:'General', description:'', inStock:true });
    setMedImage(null);
    setEditingMed(null);
  };

  const handleMedSubmit = async (e) => {
    e.preventDefault();
    setMedSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', medForm.name);
      fd.append('brand', medForm.brand);
      fd.append('price', medForm.price);
      fd.append('category', medForm.category);
      fd.append('description', medForm.description);
      fd.append('inStock', medForm.inStock);
      if (medImage) fd.append('image', medImage);

      if (editingMed) {
        const r = await axios.put(`/api/medicines/${editingMed._id}`, fd);
        setMedicines(medicines.map(m => m._id === editingMed._id ? r.data : m));
      } else {
        const r = await axios.post('/api/medicines', fd);
        setMedicines([r.data, ...medicines]);
      }
      resetMedForm();
    } catch (err) { alert(err.response?.data?.message || 'Failed to save medicine'); }
    setMedSaving(false);
  };

  const deleteMedicine = async (id) => {
    if (!window.confirm('Delete this medicine?')) return;
    try {
      await axios.delete(`/api/medicines/${id}`);
      setMedicines(medicines.filter(m => m._id !== id));
    } catch { alert('Failed to delete'); }
  };

  const startEdit = (med) => {
    setEditingMed(med);
    setMedForm({ name: med.name, brand: med.brand, price: med.price, category: med.category, description: med.description, inStock: med.inStock });
    medFormRef.current?.scrollIntoView({ behavior:'smooth' });
  };

  return (
    <div className="dash-page">
      <div className="dash-hero" style={{background:'linear-gradient(135deg,#0d9488,#14b8a6)'}}>
        <div className="container">
          <div className="dash-hero-inner">
            <div>
              <h1>Welcome, {user?.firstName} 🏪</h1>
              <p>Manage your medical shop & medicines</p>
            </div>
            {!shop && (
              <Link to="/shops/register" className="btn btn-white">+ List Your Shop</Link>
            )}
          </div>
        </div>
      </div>

      <div className="container dash-body">
        {loading ? <div className="page-loader">Loading…</div> : !shop ? (
          <div className="empty-state">
            <div className="empty-icon">🏪</div>
            <h3>No Shop Listed Yet</h3>
            <p>Register your medical shop to start receiving customers</p>
            <Link to="/shops/register" className="btn btn-teal" style={{marginTop:16}}>
              + Register Your Shop
            </Link>
          </div>
        ) : (
          <div>
            {/* Payment pending — full payment section */}
            {!shop.isPaid && (
              <div className="card" style={{marginBottom:24,border:'2px solid #fbbf24',borderRadius:20,overflow:'hidden'}}>
                <div style={{background:'#fffbeb',padding:'20px 24px',borderBottom:'1px solid #fde68a',display:'flex',alignItems:'center',gap:12}}>
                  <span style={{fontSize:28}}>💳</span>
                  <div>
                    <h3 style={{margin:0,fontSize:17,fontWeight:800,color:'#92400e'}}>Payment Pending</h3>
                    <p style={{margin:0,fontSize:13,color:'#b45309'}}>Complete your ₹99 registration fee to submit your shop for approval.</p>
                  </div>
                </div>
                <div style={{padding:'24px'}}>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:20}}>
                    {/* QR Code */}
                    <div style={{textAlign:'center'}}>
                      <div style={{fontSize:13,fontWeight:700,color:'var(--muted)',marginBottom:8}}>📱 Scan QR to Pay</div>
                      <img src="/scanupi.jpeg" alt="UPI QR" style={{width:160,height:160,borderRadius:12,border:'1px solid var(--border)',objectFit:'cover'}} />
                      <div style={{fontSize:11,color:'var(--muted)',marginTop:6}}>PhonePe · GPay · Paytm · Any UPI</div>
                    </div>
                    {/* UPI Details */}
                    <div>
                      <div style={{fontSize:13,fontWeight:700,color:'var(--muted)',marginBottom:10}}>OR Pay Manually</div>
                      {[
                        ['UPI ID','aatirahshowkat@okicici'],
                        ['Amount','₹99'],
                        ['Reference',`SHOP-${shop._id?.slice(-6).toUpperCase()}`],
                      ].map(([label, val]) => (
                        <div key={label} style={{marginBottom:10}}>
                          <div style={{fontSize:11,fontWeight:700,color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.04em'}}>{label}</div>
                          <div style={{display:'flex',alignItems:'center',gap:8,marginTop:3}}>
                            <strong style={{fontSize:14,color:'var(--slate)'}}>{val}</strong>
                            <button onClick={() => { navigator.clipboard.writeText(val); }} style={{fontSize:11,background:'var(--teal-xl)',border:'none',color:'var(--teal)',borderRadius:6,padding:'2px 8px',cursor:'pointer',fontWeight:600}}>Copy</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{borderTop:'1px solid var(--border)',paddingTop:16}}>
                    <div style={{fontSize:13,fontWeight:700,color:'var(--slate)',marginBottom:8}}>Enter your UTR / Transaction ID after paying:</div>
                    <div style={{display:'flex',gap:10}}>
                      <input
                        style={{flex:1,border:'1.5px solid var(--border)',borderRadius:10,padding:'10px 14px',fontSize:14,fontFamily:"'DM Sans',sans-serif",outline:'none'}}
                        placeholder="e.g. 426123456789"
                        value={payUtr}
                        onChange={e => setPayUtr(e.target.value)}
                      />
                      <button
                        className="btn btn-teal"
                        style={{whiteSpace:'nowrap'}}
                        onClick={submitPayment}
                        disabled={payLoading}
                      >
                        {payLoading ? 'Submitting…' : '✅ I Have Paid'}
                      </button>
                    </div>
                    {payError && <div className="alert alert-error" style={{marginTop:10}}>{payError}</div>}
                    <p style={{fontSize:12,color:'var(--muted)',marginTop:8,lineHeight:1.6}}>
                      ℹ️ After submitting, our admin will verify and approve your shop within 24 hours.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Status banner */}
            {shop.status === 'pending' && shop.isPaid && (
              <div className="alert alert-warning" style={{marginBottom:24}}>
                ⏳ Your shop is <strong>pending admin approval</strong>. We'll notify you within 24 hours.
              </div>
            )}
            {shop.status === 'approved' && (
              <div className="alert alert-success" style={{marginBottom:24}}>
                ✅ Your shop is <strong>live</strong> on SehatSehul! Customers can find you now.
              </div>
            )}
            {shop.status === 'rejected' && (
              <div className="alert alert-error" style={{marginBottom:24}}>
                ❌ Your shop was <strong>rejected</strong>. Please contact support at support@sehatsehul.in
              </div>
            )}

            {/* Tabs */}
            <div className="sd-tabs" style={{display:'flex',gap:8,marginBottom:28,flexWrap:'wrap'}}>
              {[
                { key:'overview', label:'📊 Overview' },
                { key:'medicines', label:'💊 Medicines' },
                { key:'orders', label:'📦 Orders' },
              ].map(t => (
                <button key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`btn ${tab === t.key ? 'btn-teal' : 'btn-outline'} btn-sm`}
                  style={{borderRadius:50}}
                >{t.label}</button>
              ))}
            </div>

            {/* OVERVIEW TAB */}
            {tab === 'overview' && (
              <>
                <div className="dash-stats" style={{marginBottom:28}}>
                  <div className="stat-card">
                    <div className="s-icon">🏪</div>
                    <div className="s-val">{shop.shopName}</div>
                    <div className="s-label">Shop Name</div>
                  </div>
                  <div className="stat-card">
                    <div className="s-icon">📍</div>
                    <div className="s-val">{shop.city}</div>
                    <div className="s-label">City</div>
                  </div>
                  <div className="stat-card">
                    <div className="s-icon">💊</div>
                    <div className="s-val">{medicines.length || '—'}</div>
                    <div className="s-label">Medicines</div>
                  </div>
                  <div className="stat-card">
                    <div className="s-icon">
                      {shop.status === 'approved' ? '✅' : shop.status === 'pending' ? '⏳' : '❌'}
                    </div>
                    <div className="s-val" style={{fontSize:16,textTransform:'capitalize'}}>{shop.status}</div>
                    <div className="s-label">Status</div>
                  </div>
                </div>

                <div className="card" style={{marginBottom:20}}>
                  <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:18,marginBottom:16,paddingBottom:12,borderBottom:'1px solid var(--border)'}}>
                    Shop Details
                  </h3>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                    {[
                      ['Shop Name',   shop.shopName],
                      ['Owner',       shop.ownerName],
                      ['Phone',       shop.phone],
                      ['WhatsApp',    shop.whatsapp || '—'],
                      ['Address',     shop.address],
                      ['District',    shop.district],
                      ['License No.', shop.licenseNo],
                      ['Timing',      shop.isOpen24x7 ? 'Open 24×7' : shop.timing],
                    ].map(([label, val]) => (
                      <div key={label} style={{padding:'12px',background:'var(--bg)',borderRadius:10}}>
                        <div style={{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'.05em',color:'var(--muted)',marginBottom:4}}>{label}</div>
                        <div style={{fontSize:14,fontWeight:600,color:'var(--slate)'}}>{val}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card" style={{marginBottom:20}}>
                  <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:18,marginBottom:14,paddingBottom:12,borderBottom:'1px solid var(--border)'}}>
                    Services
                  </h3>
                  <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                    {(shop.services || []).map((s,i) => (
                      <span key={i} className="badge badge-teal">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="quick-actions">
                  <button onClick={() => setTab('medicines')} className="qa-card" style={{border:'1.5px solid var(--border)',cursor:'pointer',background:'var(--white)'}}>
                    <span>💊</span>
                    <strong>Manage Medicines</strong>
                    <p>Add, edit or remove medicines</p>
                  </button>
                  <button onClick={() => setTab('orders')} className="qa-card" style={{border:'1.5px solid var(--border)',cursor:'pointer',background:'var(--white)'}}>
                    <span>📦</span>
                    <strong>View Orders</strong>
                    <p>See customer orders</p>
                  </button>
                  <Link to="/profile" className="qa-card">
                    <span>👤</span>
                    <strong>My Profile</strong>
                    <p>Update your account details</p>
                  </Link>
                </div>
              </>
            )}

            {/* MEDICINES TAB */}
            {tab === 'medicines' && (
              <div>
                {/* Add / Edit Medicine Form */}
                <div className="card" style={{marginBottom:24}} ref={medFormRef}>
                  <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:18,marginBottom:16,paddingBottom:12,borderBottom:'1px solid var(--border)'}}>
                    {editingMed ? '✏️ Edit Medicine' : '➕ Add New Medicine'}
                  </h3>
                  <form onSubmit={handleMedSubmit}>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>
                      <div>
                        <label style={{fontSize:12,fontWeight:600,color:'var(--muted)',display:'block',marginBottom:4}}>Medicine Name *</label>
                        <input className="form-input" required value={medForm.name} onChange={e => setMedForm({...medForm, name:e.target.value})} placeholder="e.g. Paracetamol 500mg" />
                      </div>
                      <div>
                        <label style={{fontSize:12,fontWeight:600,color:'var(--muted)',display:'block',marginBottom:4}}>Brand</label>
                        <input className="form-input" value={medForm.brand} onChange={e => setMedForm({...medForm, brand:e.target.value})} placeholder="e.g. Cipla" />
                      </div>
                      <div>
                        <label style={{fontSize:12,fontWeight:600,color:'var(--muted)',display:'block',marginBottom:4}}>Price (₹) *</label>
                        <input className="form-input" type="number" min="0" step="0.01" required value={medForm.price} onChange={e => setMedForm({...medForm, price:e.target.value})} placeholder="0.00" />
                      </div>
                      <div>
                        <label style={{fontSize:12,fontWeight:600,color:'var(--muted)',display:'block',marginBottom:4}}>Category</label>
                        <select className="form-input" value={medForm.category} onChange={e => setMedForm({...medForm, category:e.target.value})}>
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div style={{marginBottom:14}}>
                      <label style={{fontSize:12,fontWeight:600,color:'var(--muted)',display:'block',marginBottom:4}}>Description</label>
                      <textarea className="form-input" rows={2} value={medForm.description} onChange={e => setMedForm({...medForm, description:e.target.value})} placeholder="Brief description (optional)" />
                    </div>
                    <div style={{marginBottom:14}}>
                      <label style={{fontSize:12,fontWeight:600,color:'var(--muted)',display:'block',marginBottom:4}}>Medicine Image</label>
                      <input type="file" accept="image/*" className="form-input" style={{padding:'8px 12px'}} onChange={e => setMedImage(e.target.files[0])} />
                      {medImage && <div style={{fontSize:11,color:'var(--teal)',marginTop:4}}>✅ {medImage.name}</div>}
                      {editingMed?.image && !medImage && <div style={{marginTop:6}}><img src={editingMed.image} alt="current" style={{height:60,borderRadius:8,objectFit:'cover'}} /></div>}
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
                      <input type="checkbox" checked={medForm.inStock} onChange={e => setMedForm({...medForm, inStock:e.target.checked})} id="instock" />
                      <label htmlFor="instock" style={{fontSize:13,fontWeight:500,color:'var(--slate)',cursor:'pointer'}}>In Stock</label>
                    </div>
                    <div style={{display:'flex',gap:10}}>
                      <button type="submit" className="btn btn-teal btn-sm" disabled={medSaving}>
                        {medSaving ? 'Saving…' : editingMed ? '💾 Update Medicine' : '➕ Add Medicine'}
                      </button>
                      {editingMed && (
                        <button type="button" className="btn btn-outline btn-sm" onClick={resetMedForm}>Cancel</button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Medicine list */}
                <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:18,marginBottom:16}}>
                  Your Medicines ({medicines.length})
                </h3>
                {medLoading ? <div className="page-loader">Loading medicines…</div> : medicines.length === 0 ? (
                  <div className="card" style={{textAlign:'center',padding:40,color:'var(--muted)'}}>
                    <div style={{fontSize:48,marginBottom:12}}>💊</div>
                    <p>No medicines added yet. Use the form above to add your first medicine!</p>
                  </div>
                ) : (
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:16}}>
                    {medicines.map(med => (
                      <div key={med._id} className="card" style={{padding:0,overflow:'hidden'}}>
                        <div style={{height:120,background:'var(--teal-xl)',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',borderRadius:'0'}}>
                          {med.image
                            ? <img src={med.image} alt={med.name} style={{width:'100%',height:'100%',objectFit:'cover'}} />
                            : <span style={{fontSize:32}}>💊</span>}
                        </div>
                        <div style={{padding:16}}>
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:6}}>
                            <h4 style={{fontSize:15,fontWeight:700,color:'var(--slate)',margin:0}}>{med.name}</h4>
                            <span style={{fontSize:15,fontWeight:700,color:'var(--teal)',whiteSpace:'nowrap'}}>₹{med.price}</span>
                          </div>
                          {med.brand && <div style={{fontSize:12,color:'var(--muted)',marginBottom:4}}>by {med.brand}</div>}
                          <div style={{display:'flex',gap:6,marginBottom:8,flexWrap:'wrap'}}>
                            <span className="badge badge-teal" style={{fontSize:10}}>{med.category}</span>
                            <span className={`badge ${med.inStock ? 'badge-green' : 'badge-rose'}`} style={{fontSize:10}}>
                              {med.inStock ? '✅ In Stock' : '❌ Out of Stock'}
                            </span>
                          </div>
                          {med.description && <p style={{fontSize:12,color:'var(--muted)',marginBottom:10,lineHeight:1.5}}>{med.description}</p>}
                          <div style={{display:'flex',gap:8}}>
                            <button className="btn btn-outline btn-sm" style={{flex:1,justifyContent:'center'}} onClick={() => startEdit(med)}>✏️ Edit</button>
                            <button className="btn btn-sm" style={{flex:1,justifyContent:'center',background:'#fee2e2',color:'#dc2626',border:'none'}} onClick={() => deleteMedicine(med._id)}>🗑️ Delete</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ORDERS TAB */}
            {tab === 'orders' && (
              <div>
                <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:18,marginBottom:16}}>
                  Customer Orders ({orders.length})
                </h3>
                {ordersLoading ? <div className="page-loader">Loading orders…</div> : orders.length === 0 ? (
                  <div className="card" style={{textAlign:'center',padding:40,color:'var(--muted)'}}>
                    <div style={{fontSize:48,marginBottom:12}}>📦</div>
                    <p>No orders received yet.</p>
                  </div>
                ) : (
                  <div style={{display:'flex',flexDirection:'column',gap:14}}>
                    {orders.map(order => (
                      <div key={order._id} className="card" style={{padding:20}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12,flexWrap:'wrap',gap:8}}>
                          <div>
                            <strong style={{fontSize:15,color:'var(--slate)'}}>{order.user?.firstName} {order.user?.lastName}</strong>
                            <div style={{fontSize:12,color:'var(--muted)',marginTop:2}}>
                              📞 {order.customerPhone} · ✉️ {order.customerEmail}
                            </div>
                            <div style={{fontSize:12,color:'var(--muted)'}}>📍 {order.customerAddress}</div>
                          </div>
                          <div style={{textAlign:'right'}}>
                            <span className={`badge ${
                              order.status === 'delivered' ? 'badge-green' :
                              order.status === 'cancelled' ? 'badge-rose' :
                              order.status === 'confirmed' || order.status === 'processing' ? 'badge-teal' :
                              'badge-orange'
                            }`} style={{textTransform:'capitalize'}}>
                              {order.status}
                            </span>
                            <div style={{fontSize:12,color:'var(--muted)',marginTop:4}}>
                              {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div style={{background:'var(--bg)',borderRadius:10,padding:12,marginBottom:10}}>
                          {order.items.map((item, i) => (
                            <div key={i} style={{display:'flex',justifyContent:'space-between',fontSize:13,padding:'4px 0',borderBottom: i < order.items.length -1 ? '1px solid var(--border)':'none'}}>
                              <span>{item.name} × {item.quantity}</span>
                              <strong>₹{item.price * item.quantity}</strong>
                            </div>
                          ))}
                        </div>
                        <div style={{textAlign:'right',fontSize:16,fontWeight:700,color:'var(--teal)'}}>
                          Total: ₹{order.totalAmount}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}