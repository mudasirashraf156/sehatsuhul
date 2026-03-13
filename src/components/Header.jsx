import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const doLogout = () => { logout(); navigate('/'); setOpen(false); };
  const dashPath = user?.role === 'admin' ? '/admin' : user?.role === 'nurse' ? '/nurse/dashboard' : '/patient/dashboard';
  const isActive = (p) => location.pathname === p || location.pathname.startsWith(p + '/');

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          <div className="logo-icon">🩺</div>
          <span>Sehat<span className="c-teal">Suhul</span></span>
        </Link>

        <nav className="nav-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/nurses" className={isActive('/nurses') ? 'active' : ''}>Find Nurses</Link>
          <Link to="/services" className={isActive('/services') ? 'active' : ''}>Services</Link>
          <Link to="/about" className={isActive('/about') ? 'active' : ''}>About</Link>
          <Link to="/contact" className={isActive('/contact') ? 'active' : ''}>Contact</Link>
        </nav>

        <div className="header-right">
          {user ? (
            <div className="user-menu" ref={ref}>
              <button className="avatar-btn" onClick={() => setOpen(!open)}>
                <div className="avatar-circle">{user.firstName[0]}{user.lastName[0]}</div>
                <span className="avatar-name">{user.firstName}</span>
                <span className={`role-pill ${user.role}`}>{user.role}</span>
                <span className="chevron">{open ? '▲' : '▼'}</span>
              </button>
              {open && (
                <div className="dropdown">
                  <div className="dropdown-header">
                    <div className="dh-name">{user.firstName} {user.lastName}</div>
                    <div className="dh-email">{user.email}</div>
                  </div>
                  <Link to={dashPath} className="dd-item" onClick={() => setOpen(false)}>📊 Dashboard</Link>
                  <Link to="/profile" className="dd-item" onClick={() => setOpen(false)}>👤 My Profile</Link>
                  {user.role === 'patient' && <Link to="/patient/bookings" className="dd-item" onClick={() => setOpen(false)}>📅 My Bookings</Link>}
                  {user.role === 'nurse'   && <Link to="/nurse/bookings"   className="dd-item" onClick={() => setOpen(false)}>📋 My Bookings</Link>}
                  <div className="dd-divider"/>
                  <button className="dd-item dd-logout" onClick={doLogout}>🚪 Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-teal btn-sm">Sign Up</Link>
            </div>
          )}
          <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="menu">
            <span className={mobileOpen ? 'open' : ''}/>
            <span className={mobileOpen ? 'open' : ''}/>
            <span className={mobileOpen ? 'open' : ''}/>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="mobile-nav">
          <Link to="/">🏠 Home</Link>
          <Link to="/nurses">👩‍⚕️ Find Nurses</Link>
          <Link to="/services">🧪 Services</Link>
          <Link to="/about">ℹ️ About</Link>
          <Link to="/contact">📞 Contact</Link>
          {user ? (
            <>
              <Link to={dashPath}>📊 Dashboard</Link>
              <Link to="/profile">👤 My Profile</Link>
              <button onClick={doLogout} style={{color:'var(--rose)'}}>🚪 Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="mob-signup">Sign Up Free</Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
