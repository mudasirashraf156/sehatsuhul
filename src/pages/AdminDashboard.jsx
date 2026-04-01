import { useState, useEffect } from 'react';
import axios from 'axios';
import { StatusBadge } from '../components/Shared';
import './Admin.css';

export default function AdminDashboard() {
  const [stats, setStats]   = useState(null);
  const [nurses, setNurses] = useState([]);
  const [users, setUsers]   = useState([]);
  const [labOrders, setLabOrders] = useState([]);
  const [shops, setShops]   = useState([]);
  const [orders, setOrders] = useState([]);
  const [tab, setTab]       = useState('overview');
  const [loading, setLoading] = useState(true);

useEffect(() => {
  Promise.all([
    axios.get('/api/admin/stats'),
    axios.get('/api/admin/nurses'),
    axios.get('/api/admin/users'),
    axios.get('/api/labtests/admin/all').catch(() => ({ data: [] })),
    axios.get('/api/shops/admin/all').catch(() => ({ data: [] })),
    axios.get('/api/orders/admin/all').catch(() => ({ data: [] })),
  ]).then(([s, n, u, lo, sh, ord]) => {
    setStats(s.data);
    setNurses(n.data);
    setUsers(u.data);
    setLabOrders(lo.data);
    setShops(sh.data);
    setOrders(ord.data);
    setLoading(false);
  }).catch(() => setLoading(false));
}, []);

  const verifyNurse = async (nurseId, val) => {
    await axios.patch(`/api/admin/nurses/${nurseId}/verify`, { verify: val });
    setNurses(nurses.map(n => n._id === nurseId ? { ...n, isVerified: val, verificationPending: false } : n));
  };

  const updateShopStatus = async (id, status) => {
    await axios.patch(`/api/shops/admin/${id}/status`, { status });
    setShops(shops.map(s => s._id === id ? { ...s, status, isVerified: status === 'approved' } : s));
  };

  const pendingShops = shops.filter(s => s.status === 'pending').length;

  if (loading) return <div className="page-loader">Loading admin panel…</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="container">
          <h1>⚙️ Admin Dashboard</h1>
          <p>SehatSehul Platform Management</p>
        </div>
      </div>

      <div className="container admin-body">

        {/* Stats */}
        <div className="admin-stats">
          <div className="a-stat">
            <div className="a-stat-icon">🙋</div>
            <div className="a-val">{stats?.totalPatients || 0}</div>
            <div>Total Patients</div>
          </div>
          <div className="a-stat">
            <div className="a-stat-icon">👩‍⚕️</div>
            <div className="a-val">{stats?.totalNurses || 0}</div>
            <div>Total Nurses</div>
          </div>
          <div className="a-stat">
            <div className="a-stat-icon">📋</div>
            <div className="a-val">{stats?.totalBookings || 0}</div>
            <div>Total Bookings</div>
          </div>
          <div className="a-stat">
            <div className="a-stat-icon">🏪</div>
            <div className="a-val">{shops.length}</div>
            <div>Medical Shops</div>
          </div>
          <div className="a-stat pending">
            <div className="a-stat-icon">⏳</div>
            <div className="a-val">{stats?.pendingVerifications || 0}</div>
            <div>Pending Nurses</div>
          </div>
          <div className="a-stat pending">
            <div className="a-stat-icon">🏪</div>
            <div className="a-val">{pendingShops}</div>
            <div>Pending Shops</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          {[
            { key: 'overview', label: '📊 Overview' },
            { key: 'nurses',   label: '👩‍⚕️ Nurses' },
            { key: 'users',    label: '👥 Users' },
            { key: 'shops',    label: `🏪 Shops${pendingShops > 0 ? ` (${pendingShops})` : ''}` },
            { key: 'orders',   label: `📦 Orders${orders.filter(o=>o.status==='pending').length > 0 ? ` (${orders.filter(o=>o.status==='pending').length})` : ''}` },
            { key: 'labtests', label: `🧪 Lab Tests${labOrders.filter(o=>o.status==='pending').length > 0 ? ` (${labOrders.filter(o=>o.status==='pending').length})` : ''}` },
          ].map(t => (
            <button key={t.key} className={tab === t.key ? 'active' : ''} onClick={() => setTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div>
            <h3 className="admin-section-title">Recent Bookings</h3>
            <div className="admin-table">
              <table>
                <thead>
                  <tr><th>Patient</th><th>Nurse</th><th>Date</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {(stats?.recentBookings || []).map(b => (
                    <tr key={b._id}>
                      <td>{b.patient?.firstName} {b.patient?.lastName}</td>
                      <td>{b.nurse?.firstName} {b.nurse?.lastName}</td>
                      <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                      <td><StatusBadge status={b.status}/></td>
                    </tr>
                  ))}
                  {(!stats?.recentBookings || stats.recentBookings.length === 0) && (
                    <tr>
                      <td colSpan={4} style={{textAlign:'center',padding:'32px',color:'var(--muted)'}}>
                        No bookings yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Nurses */}
        {tab === 'nurses' && (
          <div>
            <h3 className="admin-section-title">All Nurses ({nurses.length})</h3>
            <div className="admin-table">
              <table>
                <thead>
                  <tr><th>Name</th><th>Specialization</th><th>City</th><th>License</th><th>Status</th><th>UTR / Payment</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {nurses.map(n => (
                    <tr key={n._id}>
                      <td>
                        <strong>{n.user?.firstName} {n.user?.lastName}</strong>
                        <br/><small>{n.user?.email}</small>
                      </td>
                      <td>{n.specialization}</td>
                      <td>{n.city || '—'}</td>
                      <td><code style={{fontSize:'11px'}}>{n.licenseNumber}</code></td>
                      <td>
                        {n.isVerified
                          ? <span className="badge badge-green">✅ Verified</span>
                          : n.verificationPending
                            ? <span className="badge badge-orange">💳 Payment Submitted</span>
                            : <span className="badge badge-orange">⏳ Pending</span>}
                      </td>
                      <td>
                        {n.verificationUTR
                          ? <code style={{fontSize:'12px',background:'var(--teal-xl)',padding:'3px 8px',borderRadius:'6px',color:'var(--teal-d)'}}>{n.verificationUTR}</code>
                          : <span style={{color:'var(--muted)',fontSize:'12px'}}>—</span>}
                      </td>
                      <td>
                        {n.isVerified
                          ? <button className="admin-btn danger" onClick={() => verifyNurse(n._id, false)}>Revoke</button>
                          : <button className="admin-btn success" onClick={() => verifyNurse(n._id, true)}>✅ Verify</button>}
                      </td>
                    </tr>
                  ))}
                  {nurses.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{textAlign:'center',padding:'32px',color:'var(--muted)'}}>
                        No nurses registered yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <div>
            <h3 className="admin-section-title">All Users ({users.length})</h3>
            <div className="admin-table">
              <table>
                <thead>
                  <tr><th>Name</th><th>Email</th><th>Role</th><th>City</th><th>Joined</th></tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td><strong>{u.firstName} {u.lastName}</strong></td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge ${
                          u.role === 'nurse'      ? 'badge-rose' :
                          u.role === 'shopOwner'  ? 'badge-orange' :
                          'badge-teal'
                        }`}>
                          {u.role === 'shopOwner' ? '🏥 Pharmacist' :
                           u.role === 'nurse'     ? '👩‍⚕️ Nurse' : '🙋 Patient'}
                        </span>
                      </td>
                      <td>{u.city || '—'}</td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{textAlign:'center',padding:'32px',color:'var(--muted)'}}>
                        No users yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Shops */}
        {tab === 'shops' && (
          <div>
            <h3 className="admin-section-title">
              Medical Shops ({shops.length})
              {pendingShops > 0 && (
                <span className="badge badge-orange" style={{marginLeft:12}}>
                  {pendingShops} pending
                </span>
              )}
            </h3>
            <div className="admin-table">
              <table>
                <thead>
                  <tr>
                    <th>Shop</th>
                    <th>Owner</th>
                    <th>Location</th>
                    <th>License</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {shops.map(s => (
                    <tr key={s._id} style={{background: s.status === 'pending' ? '#fffbeb' : ''}}>
                      <td>
                        <strong>{s.shopName}</strong>
                        <br/><small>{s.email || '—'}</small>
                      </td>
                      <td>
                        {s.owner?.firstName} {s.owner?.lastName}
                        <br/><small>{s.owner?.phone}</small>
                      </td>
                      <td>
                        {s.city}, {s.district}
                        <br/><small>{s.address}</small>
                      </td>
                      <td>
                        <code style={{fontSize:11}}>{s.licenseNo}</code>
                      </td>
                      <td>
                        {s.isPaid
                          ? <span className="badge badge-green">✅ Paid</span>
                          : <span className="badge badge-orange">⏳ Unpaid</span>}
                      </td>
                      <td>
                        {s.status === 'approved' && <span className="badge badge-green">✅ Approved</span>}
                        {s.status === 'pending'  && <span className="badge badge-orange">⏳ Pending</span>}
                        {s.status === 'rejected' && <span className="badge badge-rose">❌ Rejected</span>}
                      </td>
                      <td>
                        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                          {s.status !== 'approved' && (
                            <button className="admin-btn success" onClick={() => updateShopStatus(s._id, 'approved')}>
                              ✅ Approve
                            </button>
                          )}
                          {s.status !== 'rejected' && (
                            <button className="admin-btn danger" onClick={() => updateShopStatus(s._id, 'rejected')}>
                              Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {shops.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{textAlign:'center',padding:'32px',color:'var(--muted)'}}>
                        No shops registered yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders */}
        {tab === 'orders' && (
          <div>
            <h3 className="admin-section-title">Medicine Orders ({orders.length})</h3>
            <div className="admin-table">
              <table>
                <thead>
                  <tr><th>Customer</th><th>Shop</th><th>Items</th><th>Total</th><th>Contact</th><th>Status</th><th>Manage</th></tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o._id} style={{background: o.status === 'pending' ? '#fffbeb' : ''}}>
                      <td>
                        <strong>{o.user?.firstName} {o.user?.lastName}</strong>
                        <br/><small>{o.user?.email}</small>
                      </td>
                      <td>
                        <strong>{o.shop?.shopName}</strong>
                        <br/><small>{o.shop?.city}</small>
                      </td>
                      <td style={{maxWidth:200,fontSize:12}}>
                        {o.items?.map((item, i) => (
                          <div key={i}>{item.name} × {item.quantity}</div>
                        ))}
                      </td>
                      <td><strong>₹{o.totalAmount}</strong></td>
                      <td style={{fontSize:12}}>
                        📞 {o.customerPhone}<br/>
                        📍 {o.customerAddress}
                      </td>
                      <td>
                        <select
                          value={o.status}
                          onChange={async e => {
                            const status = e.target.value;
                            await axios.patch(`/api/orders/admin/${o._id}`, { status });
                            setOrders(orders.map(x => x._id === o._id ? {...x, status} : x));
                          }}
                          style={{fontSize:12,padding:'4px 8px',borderRadius:8,border:'1px solid var(--border)',fontFamily:'DM Sans,sans-serif'}}
                        >
                          <option value="pending">⏳ Pending</option>
                          <option value="confirmed">✅ Confirmed</option>
                          <option value="processing">📦 Processing</option>
                          <option value="delivered">🚚 Delivered</option>
                          <option value="cancelled">❌ Cancelled</option>
                        </select>
                      </td>
                      <td>
                        <input
                          placeholder="Admin notes"
                          defaultValue={o.adminNotes}
                          style={{fontSize:11,padding:'4px 8px',borderRadius:6,border:'1px solid var(--border)',width:130}}
                          onBlur={async e => {
                            await axios.patch(`/api/orders/admin/${o._id}`, { adminNotes: e.target.value, status: o.status });
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr><td colSpan={7} style={{textAlign:'center',padding:'32px',color:'var(--muted)'}}>No medicine orders yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

{tab === 'labtests' && (
  <div>
    <h3 className="admin-section-title">Lab Test Orders ({labOrders.length})</h3>
    <div className="admin-table">
      <table>
        <thead>
          <tr><th>Patient</th><th>Tests</th><th>Date & Time</th><th>Location</th><th>Amount</th><th>Status</th><th>Manage</th></tr>
        </thead>
        <tbody>
          {labOrders.map(o => (
            <tr key={o._id} style={{background: o.status === 'pending' ? '#fffbeb' : ''}}>
              <td>
                <strong>{o.patient?.firstName} {o.patient?.lastName}</strong>
                <br/><small>{o.patient?.phone}</small>
                <br/><small>{o.patient?.email}</small>
              </td>
              <td style={{maxWidth:200,fontSize:12}}>{o.tests?.join(', ')}</td>
              <td>
                {new Date(o.bookingDate).toLocaleDateString()}<br/>
                <small>{o.timeSlot}</small>
              </td>
              <td>{o.city}<br/><small>{o.address}</small></td>
              <td><strong>₹{o.totalAmount}</strong><br/><small>{o.isPaid ? '✅ Paid' : 'Cash'}</small></td>
              <td>
                <select
                  value={o.status}
                  onChange={async e => {
                    const status = e.target.value;
                    await axios.patch(`/api/labtests/admin/${o._id}`, { status });
                    setLabOrders(labOrders.map(x => x._id === o._id ? {...x, status} : x));
                  }}
                  style={{fontSize:12,padding:'4px 8px',borderRadius:8,border:'1px solid var(--border)',fontFamily:'DM Sans,sans-serif'}}
                >
                  <option value="pending">⏳ Pending</option>
                  <option value="confirmed">✅ Confirmed</option>
                  <option value="sample_collected">🧪 Collected</option>
                  <option value="processing">🔬 Processing</option>
                  <option value="completed">✅ Completed</option>
                  <option value="cancelled">❌ Cancelled</option>
                </select>
              </td>
              <td>
                <div style={{display:'flex',flexDirection:'column',gap:6}}>
                  <input
                    placeholder="Assign lab name"
                    defaultValue={o.assignedLab}
                    style={{fontSize:11,padding:'4px 8px',borderRadius:6,border:'1px solid var(--border)',width:130}}
                    onBlur={async e => {
                      await axios.patch(`/api/labtests/admin/${o._id}`, { assignedLab: e.target.value, status: o.status });
                      setLabOrders(labOrders.map(x => x._id === o._id ? {...x, assignedLab: e.target.value} : x));
                    }}
                  />
                  <input
                    placeholder="Admin notes"
                    defaultValue={o.adminNotes}
                    style={{fontSize:11,padding:'4px 8px',borderRadius:6,border:'1px solid var(--border)',width:130}}
                    onBlur={async e => {
                      await axios.patch(`/api/labtests/admin/${o._id}`, { adminNotes: e.target.value, status: o.status });
                    }}
                  />
                </div>
              </td>
            </tr>
          ))}
          {labOrders.length === 0 && (
            <tr><td colSpan={7} style={{textAlign:'center',padding:'32px',color:'var(--muted)'}}>No lab test orders yet</td></tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
)}
      </div>
    </div>
  );
}