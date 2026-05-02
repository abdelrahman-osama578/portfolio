import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import GlassPanel from '../components/GlassPanel';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{ paddingTop: '140px', minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 20px' }}>
      <GlassPanel style={{ padding: '60px 40px', textAlign: 'center', maxWidth: '500px', width: '100%' }}>
        <h1 style={{ fontSize: '6rem', margin: '0', color: 'var(--accent-color)', lineHeight: '1' }}>404</h1>
        <h2 style={{ fontSize: '2rem', marginBottom: '16px', color: '#fff' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: '1.6' }}>
          The architecture you are looking for doesn't exist in this system. It might have been moved or deleted.
        </p>
        
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button onClick={() => navigate(-1)} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowLeft size={18} /> Go Back
          </button>
          <button onClick={() => navigate('/')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Home size={18} /> Return Home
          </button>
        </div>
      </GlassPanel>
    </div>
  );
};

export default NotFound;