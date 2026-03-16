import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import { PrivateRoute } from './components/Shared';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Nurses from './pages/Nurses';
import NurseProfilePage from './pages/NurseProfile';
import NurseIDCard from './pages/NurseIDCard';
import Book from './pages/Book';
import PatientDashboard from './pages/PatientDashboard';
import NurseDashboard from './pages/NurseDashboard';
import { PatientBookings, NurseBookings } from './pages/Bookings';
import { NurseProfileEdit, UserProfile } from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import { Services, About, Contact, Review, Privacy } from './pages/StaticPages';
import AdminLogin from './pages/AdminLogin';
import ScanHelp from './pages/ScanHelp';
import './index.css';

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      {/* Public */}
      <Route path="/"        element={<Home />} />
      <Route path="/scan" element={<ScanHelp />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/nurses"  element={<Nurses />} />
      <Route path="/nurses/:id" element={<NurseProfilePage />} />
      <Route path="/services" element={<Services />} />
      <Route path="/about"   element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/login"   element={user ? <Navigate to={user.role === 'nurse' ? '/nurse/dashboard' : user.role === 'admin' ? '/admin' : '/patient/dashboard'}/> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/"/> : <Register />} />

      {/* Patient routes */}
      <Route path="/patient/dashboard" element={<PrivateRoute role="patient"><PatientDashboard /></PrivateRoute>} />
      <Route path="/patient/bookings"  element={<PrivateRoute role="patient"><PatientBookings /></PrivateRoute>} />
      <Route path="/book/:nurseId"     element={<PrivateRoute role="patient"><Book /></PrivateRoute>} />
      <Route path="/review/:bookingId/:nurseId" element={<PrivateRoute role="patient"><Review /></PrivateRoute>} />

      {/* Nurse routes */}
      <Route path="/nurse/dashboard" element={<PrivateRoute role="nurse"><NurseDashboard /></PrivateRoute>} />
      <Route path="/nurse/bookings"  element={<PrivateRoute role="nurse"><NurseBookings /></PrivateRoute>} />
      <Route path="/nurse/profile"   element={<PrivateRoute role="nurse"><NurseProfileEdit /></PrivateRoute>} />
      <Route path="/nurse/id-card" element={
  <PrivateRoute role="nurse"><NurseIDCard /></PrivateRoute>
} />

      {/* Shared profile */}
      <Route path="/profile" element={<PrivateRoute>{user?.role === 'nurse' ? <NurseProfileEdit /> : <UserProfile />}</PrivateRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />

      {/* 404 */}
      <Route path="*" element={
        <div style={{textAlign:'center',padding:'80px 24px'}}>
          <div style={{fontSize:64,marginBottom:20}}>🔍</div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:32,marginBottom:12}}>Page Not Found</h2>
          <p style={{color:'var(--muted)',marginBottom:24}}>The page you're looking for doesn't exist.</p>
          <a href="/" className="btn btn-teal">Go Home</a>
        </div>
      } />
    </Routes>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Header />
        <main style={{ flex: 1 }}>
          <AppRoutes />
        </main>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}
