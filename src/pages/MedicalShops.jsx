import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './MedicalShops.css';

const DISTRICTS = ['','Srinagar','Budgam','Anantnag','Baramulla','Pulwama','Kupwara','Ganderbal','Bandipora'];

export default function MedicalShops() {
  const [shops, setShops]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [district, setDistrict] = useState('');

  const fetchShops = async () => {
    setLoading(true);
    try {
      const params = {};
      if (district) params.district = district;
      if (search)   params.search   = search;
      const { data } = await axios.get('/api/shops', { params });
      setShops(data);
    } catch { setShops([]); }
    setLoading(false);
  };

  useEffect(() => { fetchShops(); }, [district]);

  return (
    <div className="shops-page">
      {/* Hero */}
      <div className="shops-hero">
        <div className="container">
          <div className="sh-tag">💊 Verified Medical Shops</div>
          <h1>Medical Shops Near You</h1>
          <p>Find verified, trusted medical stores across Jammu & Kashmir</p>
          <form className="shops-search" onSubmit={e => { e.preventDefault(); fetchShops(); }}>
            <input
              placeholder="Search by shop name or area…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select value={district} onChange={e => setDistrict(e.target.value)}>
              {DISTRICTS.map(d => <option key={d} value={d}>{d || 'All Districts'}</option>)}
            </select>
            <button type="submit" className="btn btn-teal">🔍 Search</button>
          </form>
        </div>
      </div>

      <div className="container shops-body">
        {/* Register CTA */}
        <div className="register-cta">
          <div>
            <strong>Own a Medical Shop?</strong>
            <span>Register your shop and get verified customers from across J&K</span>
          </div>
          <Link to="/shops/register" className="btn btn-teal btn-sm">
            + List Your Shop
          </Link>
        </div>

        {/* Results */}
        <div className="shops-results-header">
          <span>{shops.length} verified shop{shops.length !== 1 ? 's' : ''} found</span>
        </div>

        {loading ? (
          <div className="page-loader">Loading shops…</div>
        ) : shops.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏪</div>
            <h3>No shops found</h3>
            <p>Try a different search or district</p>
          </div>
        ) : (
          <div className="shops-grid">
            {shops.map(shop => <ShopCard key={shop._id} shop={shop} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function ShopCard({ shop }) {
  return (
    <div className="shop-card">
    <Link to={`/shops/${shop._id}`} className="sc-image-link">
        <div className="sc-image">
          {shop.image ? (
            <img
              src={`${axios.defaults.baseURL}/uploads/${shop.image}`}
              alt={shop.shopName}
            />
          ) : (
            <div className="sc-image-placeholder">🏪</div>
          )}
          {shop.isFeatured && <div className="sc-featured">⭐ Featured</div>}
          {shop.isVerified && <div className="sc-verified">✓ Verified</div>}
        </div>
      </Link>

      <div className="sc-body">
        <Link to={`/shops/${shop._id}`} className="sc-name-link">
          <h3>{shop.shopName}</h3>
        </Link>
        <div className="sc-location">📍 {shop.address}, {shop.city}</div>
        {shop.description && <p className="sc-desc">{shop.description.slice(0, 90)}{shop.description.length > 90 ? '…' : ''}</p>}
        <div className="sc-tags">
          {(shop.services || []).slice(0, 3).map((s, i) => <span key={i}>{s}</span>)}
        </div>
        <div className="sc-timing">🕐 {shop.isOpen24x7 ? 'Open 24×7' : shop.timing}</div>
        <div className="sc-actions">
          <a href={`tel:${shop.phone}`} className="btn btn-teal btn-sm">📞 Call</a>
          {shop.whatsapp && (
            <a href={`https://wa.me/91${shop.whatsapp}`} target="_blank" rel="noreferrer" className="btn btn-sm" style={{background:'#dcfce7',color:'#16a34a',borderRadius:'50px',border:'none',padding:'8px 16px',fontWeight:600,fontSize:13}}>
              💬 WhatsApp
            </a>
          )}
          <a href={`https://maps.google.com/?q=${shop.address},${shop.city}`} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
            🗺️ Map
          </a>
        </div>
      </div>
    </div>
  );
}