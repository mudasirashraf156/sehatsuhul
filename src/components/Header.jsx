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
const dashPath =
  user?.role === 'admin'      ? '/admin' :
  user?.role === 'nurse'      ? '/nurse/dashboard' :
  user?.role === 'shopOwner'  ? '/shop/dashboard' :
  '/patient/dashboard';
  const isActive = (p) => location.pathname === p || location.pathname.startsWith(p + '/');

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          <div className="logo-icon">🩺</div>
          <span>Sehat<span className="c-teal">Sehul</span></span>
        </Link>

        <nav className="nav-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/nurses" className={isActive('/nurses') ? 'active' : ''}>Find Nurses</Link>
          <Link to="/services" className={isActive('/services') ? 'active' : ''}>Services</Link>
          <Link to="/about" className={isActive('/about') ? 'active' : ''}>About</Link>
          <Link to="/shops" className={isActive('/shops') ? 'active' : ''}>💊 Medical Shops</Link>
          <Link to="/contact" className={isActive('/contact') ? 'active' : ''}>Contact</Link>
          <Link to="/scan" className={isActive('/scan') ? 'active' : ''}>
  🆓 Free Help
</Link>
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
          <Link to="/scan"> Scan prescription</Link>
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

//hals

// import { useState, useRef, useEffect } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import './Header.css';

// function ComingSoonOverlay() {
//   const [show, setShow] = useState(false);

//   useEffect(() => {
//     const unlocked = sessionStorage.getItem('ss_unlocked');
//     if (!unlocked) setShow(true);
//   }, []);

//   const unlock = () => {
//     const pass = prompt('Enter access code:');
//     if (pass === 'sehatsehul2025') {
//       sessionStorage.setItem('ss_unlocked', 'true');
//       setShow(false);
//     } else if (pass !== null) {
//       alert('Incorrect access code.');
//     }
//   };

//   if (!show) return null;

//   return (
//     <div className="site-overlay">
//       <div className="overlay-blur"/>
//       <div className="overlay-content">
//         <div className="overlay-logo">
//           <div className="overlay-logo-icon">🩺</div>
//           <span>Sehat<span>Sehul</span></span>
//         </div>
//         <div className="overlay-tag">
//           <span className="overlay-dot"/>
//           Beta Testing Phase
//         </div>
//         <h1>We're Launching Soon<br/>in Jammu & Kashmir</h1>
//         <p>SehatSehul is currently under final testing. We will be officially live very soon across J&K. Stay tuned!</p>
//         <div className="overlay-features">
//           <div>👩‍⚕️ Certified Nurses</div>
//           <div>🧪 Home Lab Tests</div>
//           <div>🏪 Medical Shops</div>
//           <div>📋 Free Rx Scan</div>
//         </div>
//         <div className="overlay-actions">
//           <a href="mailto:sehatsehul@gmail.com" className="overlay-btn-primary">
//             📧 Get Early Access
//           </a>
//           <a href="https://wa.me/917780906971" target="_blank" rel="noreferrer" className="overlay-btn-secondary">
//             💬 WhatsApp Us
//           </a>
//         </div>
//         <div className="overlay-contact">
//           📞 +91 70062 73733 · 📍 Budgam, Srinagar, J&K
//         </div>
//         <p className="overlay-admin-hint">
//           Admin or tester?{' '}
//           <button className="overlay-unlock-btn" onClick={unlock}>
//             Unlock Site →
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default function Header() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [open, setOpen] = useState(false);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const ref = useRef();

//   useEffect(() => {
//     const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
//     document.addEventListener('mousedown', h);
//     return () => document.removeEventListener('mousedown', h);
//   }, []);

//   useEffect(() => { setMobileOpen(false); }, [location.pathname]);

//   const doLogout = () => { logout(); navigate('/'); setOpen(false); };
//   const dashPath = user?.role === 'admin' ? '/admin' : user?.role === 'nurse' ? '/nurse/dashboard' : user?.role === 'shopOwner' ? '/shop/dashboard' : '/patient/dashboard';
//   const isActive = (p) => location.pathname === p || location.pathname.startsWith(p + '/');

//   return (
//     <>
//       <ComingSoonOverlay />
//       <header className="header">
//         <div className="container header-inner">
//           <Link to="/" className="logo">
//             <div className="logo-icon">🩺</div>
//             <span>Sehat<span className="c-teal">Sehul</span></span>
//           </Link>

//           <nav className="nav-links">
//             <Link to="/"        className={location.pathname === '/' ? 'active' : ''}>Home</Link>
//             <Link to="/nurses"  className={isActive('/nurses')   ? 'active' : ''}>Find Nurses</Link>
//             <Link to="/book-test" className={isActive('/book-test') ? 'active' : ''}>Lab Tests</Link>
//             <Link to="/shops"   className={isActive('/shops')    ? 'active' : ''}>Medical Shops</Link>
//             <Link to="/services" className={isActive('/services') ? 'active' : ''}>Services</Link>
//             <Link to="/about"   className={isActive('/about')    ? 'active' : ''}>About</Link>
//             <Link to="/contact" className={isActive('/contact')  ? 'active' : ''}>Contact</Link>
//           </nav>

//           <div className="header-right">
//             {user ? (
//               <div className="user-menu" ref={ref}>
//                 <button className="avatar-btn" onClick={() => setOpen(!open)}>
//                   <div className="avatar-circle">{user.firstName[0]}{user.lastName[0]}</div>
//                   <span className="avatar-name">{user.firstName}</span>
//                   <span className={`role-pill ${user.role}`}>{user.role}</span>
//                   <span className="chevron">{open ? '▲' : '▼'}</span>
//                 </button>
//                 {open && (
//                   <div className="dropdown">
//                     <div className="dropdown-header">
//                       <div className="dh-name">{user.firstName} {user.lastName}</div>
//                       <div className="dh-email">{user.email}</div>
//                     </div>
//                     <Link to={dashPath} className="dd-item" onClick={() => setOpen(false)}>📊 Dashboard</Link>
//                     <Link to="/profile" className="dd-item" onClick={() => setOpen(false)}>👤 My Profile</Link>
//                     {user.role === 'patient'   && <Link to="/patient/bookings"  className="dd-item" onClick={() => setOpen(false)}>📅 My Bookings</Link>}
//                     {user.role === 'patient'   && <Link to="/patient/labtests"  className="dd-item" onClick={() => setOpen(false)}>🧪 My Lab Tests</Link>}
//                     {user.role === 'nurse'     && <Link to="/nurse/bookings"    className="dd-item" onClick={() => setOpen(false)}>📋 My Bookings</Link>}
//                     {user.role === 'nurse'     && <Link to="/nurse/id-card"     className="dd-item" onClick={() => setOpen(false)}>🪪 My ID Card</Link>}
//                     {user.role === 'shopOwner' && <Link to="/shops/register"    className="dd-item" onClick={() => setOpen(false)}>🏪 My Shop</Link>}
//                     <div className="dd-divider"/>
//                     <button className="dd-item dd-logout" onClick={doLogout}>🚪 Logout</button>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <div className="auth-btns">
//                 <Link to="/login"    className="btn btn-outline btn-sm">Login</Link>
//                 <Link to="/register" className="btn btn-teal btn-sm">Sign Up</Link>
//               </div>
//             )}
//             <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="menu">
//               <span className={mobileOpen ? 'open' : ''}/>
//               <span className={mobileOpen ? 'open' : ''}/>
//               <span className={mobileOpen ? 'open' : ''}/>
//             </button>
//           </div>
//         </div>

//         {mobileOpen && (
//           <nav className="mobile-nav">
//             <Link to="/">🏠 Home</Link>
//             <Link to="/nurses">👩‍⚕️ Find Nurses</Link>
//             <Link to="/book-test">🧪 Lab Tests</Link>
//             <Link to="/shops">🏪 Medical Shops</Link>
//             <Link to="/services">⚕️ Services</Link>
//             <Link to="/about">ℹ️ About</Link>
//             <Link to="/contact">📞 Contact</Link>
//             {user ? (
//               <>
//                 <Link to={dashPath}>📊 Dashboard</Link>
//                 <Link to="/profile">👤 My Profile</Link>
//                 <button onClick={doLogout} style={{color:'var(--rose)'}}>🚪 Logout</button>
//               </>
//             ) : (
//               <>
//                 <Link to="/login">Login</Link>
//                 <Link to="/register" className="mob-signup">Sign Up Free</Link>
//               </>
//             )}
//           </nav>
//         )}
//       </header>
//     </>
//   );
// }
