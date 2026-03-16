import { useState, useEffect } from 'react';
import axios from 'axios';
import { StatusBadge } from '../components/Shared';
import './Admin.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [nurses, setNurses] = useState([]);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('/api/admin/stats'),
      axios.get('/api/admin/nurses'),
      axios.get('/api/admin/users'),
    ]).then(([s, n, u]) => {
      setStats(s.data); setNurses(n.data); setUsers(u.data); setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const verify = async (nurseId, verify) => {
    await axios.patch(`/api/admin/nurses/${nurseId}/verify`, { verify });
    setNurses(nurses.map(n => n._id === nurseId ? {...n, isVerified: verify} : n));
  };

  if (loading) return <div className="page-loader">Loading admin panel…</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="container">
          <h1>⚙️ Admin Dashboard</h1>
          <p>sehatsehul Platform Management</p>
        </div>
      </div>

      <div className="container admin-body">
        {/* Stats */}
        <div className="admin-stats">
          <div className="a-stat"><div className="a-stat-icon">🙋</div><div className="a-val">{stats?.totalPatients || 0}</div><div>Total Patients</div></div>
          <div className="a-stat"><div className="a-stat-icon">👩‍⚕️</div><div className="a-val">{stats?.totalNurses || 0}</div><div>Total Nurses</div></div>
          <div className="a-stat"><div className="a-stat-icon">📋</div><div className="a-val">{stats?.totalBookings || 0}</div><div>Total Bookings</div></div>
          <div className="a-stat pending"><div className="a-stat-icon">⏳</div><div className="a-val">{stats?.pendingVerifications || 0}</div><div>Pending Verify</div></div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          {['overview','nurses','users'].map(t => (
            <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
              {t === 'overview' ? '📊 Overview' : t === 'nurses' ? '👩‍⚕️ Nurses' : '👥 Users'}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div>
            <h3 className="admin-section-title">Recent Bookings</h3>
            <div className="admin-table">
              <table>
                <thead><tr><th>Patient</th><th>Nurse</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>
                  {(stats?.recentBookings || []).map(b => (
                    <tr key={b._id}>
                      <td>{b.patient?.firstName} {b.patient?.lastName}</td>
                      <td>{b.nurse?.firstName} {b.nurse?.lastName}</td>
                      <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                      <td><StatusBadge status={b.status}/></td>
                    </tr>
                  ))}
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
                <thead><tr><th>Name</th><th>Specialization</th><th>City</th><th>License</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {nurses.map(n => (
                    <tr key={n._id}>
                      <td><strong>{n.user?.firstName} {n.user?.lastName}</strong><br/><small>{n.user?.email}</small></td>
                      <td>{n.specialization}</td>
                      <td>{n.city || '—'}</td>
                      <td><code style={{fontSize:'11px'}}>{n.licenseNumber}</code></td>
                      <td>{n.isVerified ? <span className="badge badge-green">✅ Verified</span> : <span className="badge badge-orange">⏳ Pending</span>}</td>
                      <td>
                        {n.isVerified
                          ? <button className="admin-btn danger" onClick={() => verify(n._id, false)}>Revoke</button>
                          : <button className="admin-btn success" onClick={() => verify(n._id, true)}>✅ Verify</button>}
                      </td>
                    </tr>
                  ))}
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
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>City</th><th>Joined</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td><strong>{u.firstName} {u.lastName}</strong></td>
                      <td>{u.email}</td>
                      <td><span className={`badge ${u.role==='nurse'?'badge-rose':'badge-teal'}`}>{u.role}</span></td>
                      <td>{u.city || '—'}</td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
