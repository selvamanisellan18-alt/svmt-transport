import React, { useState, useEffect } from 'react';
import { Truck, Lock } from 'lucide-react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('svat_is_logged_in') === 'true';
  });
  const [page, setPage] = useState(() => {
    const loggedIn = localStorage.getItem('svat_is_logged_in') === 'true';
    return loggedIn ? 'dashboard' : 'home';
  });

  // Simple scroll helper
  const handleScrollTo = (id) => {
    setPage('home');
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem('svat_is_logged_in', 'true');
    setPage('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('svat_is_logged_in');
    setPage('home');
  };

  return (
    <>
      {/* Main Top Header Navbar (Hidden in printable/dashboard states to maximize screen room) */}
      {page !== 'dashboard' && (
        <header className="navbar">
          <div className="logo-container" onClick={() => setPage('home')} style={{ cursor: 'pointer' }}>
            <Truck className="logo-icon" />
            <span className="logo-text">SVAT</span>
          </div>
          
          <ul className="nav-links">
            <li>
              <button 
                onClick={() => setPage('home')} 
                className={`sidebar-link ${page === 'home' ? 'active' : ''}`}
                style={{ background: 'none', border: 'none', padding: 0, fontWeight: 500, fontSize: '0.95rem' }}
              >
                Home
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleScrollTo('track-widget')} 
                className="sidebar-link"
                style={{ background: 'none', border: 'none', padding: 0, fontWeight: 500, fontSize: '0.95rem' }}
              >
                Track Shipment
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleScrollTo('track-widget')} 
                className="sidebar-link"
                style={{ background: 'none', border: 'none', padding: 0, fontWeight: 500, fontSize: '0.95rem' }}
              >
                Services
              </button>
            </li>
          </ul>

          <div className="nav-actions">
            {isLoggedIn ? (
              <button className="btn-primary" onClick={() => setPage('dashboard')}>
                Dashboard
              </button>
            ) : (
              <button className="btn-outline" onClick={() => setPage('login')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lock size={14} />
                Client Login
              </button>
            )}
          </div>
        </header>
      )}

      {/* Pages Container */}
      {page === 'home' && <LandingPage onNavigate={setPage} />}
      {page === 'login' && <LoginPage onLoginSuccess={handleLoginSuccess} />}
      {page === 'dashboard' && <Dashboard onLogout={handleLogout} />}

      {/* Footer (Hidden in Dashboard View for application-style layout) */}
      {page !== 'dashboard' && (
        <footer className="footer">
          <div>
            <div className="logo-container" style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
              <Truck className="logo-icon" style={{ width: '24px', height: '24px' }} />
              <span className="logo-text">SVAT</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              © 2026 Sree Vaarahi Amman Transports. All rights reserved.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
            <a href="#" className="sidebar-link" style={{ background: 'none', border: 'none', padding: 0 }}>Privacy Policy</a>
            <a href="#" className="sidebar-link" style={{ background: 'none', border: 'none', padding: 0 }}>Terms of Service</a>
          </div>
        </footer>
      )}
    </>
  );
}

export default App;
