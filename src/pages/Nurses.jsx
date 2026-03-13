import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Stars } from '../components/Shared';
import './Nurses.css';

const SPECS = ['','General Nursing','ICU / Critical Care','Pediatric Nursing','Midwifery','Wound Care','Phlebotomy','Elderly Care','Post-Op Care'];
const CITIES = ['','Srinagar', 'Budgam', 'Beerwah', 'Baramulla', 'Anantnag', 'Pulwama', 'Ganderbal', 'Kupwara', 'Bandipora'];

export default function Nurses() {
  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [spec, setSpec] = useState('');
  const [sort, setSort] = useState('rating');

  const fetchNurses = async () => {
    setLoading(true);
    try {
      const params = {};
      if (city) params.city = city;
      if (spec) params.specialization = spec;
      if (search) params.search = search;
      const { data } = await axios.get('/api/nurses', { params });
      setNurses(data);
    } catch { setNurses([]); }
    setLoading(false);
  };

  useEffect(() => { fetchNurses(); }, [city, spec]);

  const handleSearch = (e) => { e.preventDefault(); fetchNurses(); };

  const sorted = [...nurses].sort((a, b) => {
    if (sort === 'rating') return b.rating - a.rating;
    if (sort === 'price_low') return a.hourlyRate - b.hourlyRate;
    if (sort === 'price_high') return b.hourlyRate - a.hourlyRate;
    return b.totalReviews - a.totalReviews;
  });

  return (
    <div className="nurses-page">
      <div className="nurses-hero">
        <div className="container">
          <h1>Find a Certified Nurse</h1>
          <p>Browse verified healthcare professionals available in your city</p>
          <form className="search-bar" onSubmit={handleSearch}>
            <input placeholder="Search by name, city, or specialization…" value={search} onChange={e => setSearch(e.target.value)}/>
            <button type="submit" className="btn btn-teal">🔍 Search</button>
          </form>
        </div>
      </div>

      <div className="container nurses-layout">
        {/* Sidebar Filters */}
        <aside className="filters-panel">
          <h3>Filters</h3>
          <div className="filter-group">
            <label>City</label>
            <select value={city} onChange={e => setCity(e.target.value)}>
              {CITIES.map(c => <option key={c} value={c}>{c || 'All Cities'}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label>Specialization</label>
            <select value={spec} onChange={e => setSpec(e.target.value)}>
              {SPECS.map(s => <option key={s} value={s}>{s || 'All Specializations'}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label>Sort By</label>
            <select value={sort} onChange={e => setSort(e.target.value)}>
              <option value="rating">Top Rated</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="reviews">Most Reviewed</option>
            </select>
          </div>
          <button className="btn btn-outline btn-sm" style={{width:'100%'}} onClick={() => { setCity(''); setSpec(''); setSearch(''); }}>
            Clear Filters
          </button>
        </aside>

        {/* Nurse Cards */}
        <div className="nurses-results">
          <div className="results-header">
            <span>{sorted.length} nurses found</span>
          </div>

          {loading ? (
            <div className="page-loader">Loading nurses…</div>
          ) : sorted.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👩‍⚕️</div>
              <h3>No nurses found</h3>
              <p>Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="nurses-grid">
              {sorted.map(nurse => (
                <NurseCard key={nurse._id} nurse={nurse} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NurseCard({ nurse }) {
  const u = nurse.user;
  return (
    <div className="nurse-card">
      <div className="nc-top">
        <div className="nc-avatar">
          {u?.firstName?.[0]}{u?.lastName?.[0]}
          {nurse.isVerified && <div className="nc-verified">✓</div>}
        </div>
        <div className="nc-info">
          <h3>{u?.firstName} {u?.lastName}</h3>
          <span className="nc-spec">{nurse.specialization}</span>
          <div className="nc-meta">
            <Stars rating={nurse.rating} size={13}/>
            <span>{nurse.rating.toFixed(1)} ({nurse.totalReviews} reviews)</span>
          </div>
        </div>
        <div className="nc-rate">
          <strong>₨{nurse.hourlyRate}</strong>
          <span>/hr</span>
        </div>
      </div>
      <div className="nc-tags">
        {nurse.city && <span>📍 {nurse.city}</span>}
        {nurse.experience > 0 && <span>⏱ {nurse.experience} yrs exp</span>}
        {nurse.isVerified && <span className="tag-verified">✅ Verified</span>}
      </div>
      {nurse.bio && <p className="nc-bio">{nurse.bio.slice(0, 100)}{nurse.bio.length > 100 ? '…' : ''}</p>}
      <div className="nc-services">
        {(nurse.services || []).slice(0, 3).map((s, i) => <span key={i}>{s}</span>)}
      </div>
      <div className="nc-actions">
        <Link to={`/nurses/${nurse._id}`} className="btn btn-outline btn-sm">View Profile</Link>
        <Link to={`/book/${nurse._id}`} className="btn btn-teal btn-sm">Book Now</Link>
      </div>
    </div>
  );
}
