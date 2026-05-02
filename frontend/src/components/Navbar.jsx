import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sun, Moon, FileText } from 'lucide-react'; // Added FileText here
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <nav className="glass-navbar">
      {/* PREMIUM BRAND LOGO */}
      <Link to="/" className="nav-brand-container" style={{ textDecoration: 'none' }}>
        <div className="nav-logo-mark">
          <span className="logo-a">A</span>
          <span className="logo-o">O</span>
        </div>
        <div className="nav-brand-text">
          <span className="brand-first">Abdelrahman</span>
          <span className="brand-last">Ossama</span>
        </div>
      </Link>
      
      <div className="nav-links">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
        <Link to="/projects" className={location.pathname === '/projects' ? 'active' : ''}>Projects</Link>
        <Link to="/experience" className={location.pathname === '/experience' ? 'active' : ''}>Experience</Link>
      </div>

      <div className="nav-contact" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        
        {/* NEW: Clean Resume Link in Navbar */}
        <a 
          href="/Abdelrahman_Ossama_Resume.pdf" 
          target="_blank" 
          rel="noreferrer"
          className="nav-resume-link"
          style={{ 
            display: 'flex', alignItems: 'center', gap: '6px', 
            color: 'var(--text-secondary)', textDecoration: 'none', 
            fontSize: '0.95rem', fontWeight: '500', transition: 'color 0.2s ease' 
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <FileText size={18} />
          <span style={{ display: 'none' }} className="hide-on-mobile">Resume</span> {/* Optional CSS class if you want to hide text on mobile */}
        </a>

        {/* THE THEME TOGGLE BUTTON */}
        <button 
          onClick={() => setIsDark(!isDark)}
          style={{ 
            background: 'none', border: 'none', color: 'var(--text-primary)', 
            cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px',
            transition: 'transform 0.2s ease, color 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          aria-label="Toggle Light/Dark Mode"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button 
          className="btn-primary" 
          onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
        >
          Let's Talk
        </button>
      </div>
    </nav>
  );
};

export default Navbar;