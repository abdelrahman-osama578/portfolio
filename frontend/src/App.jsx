import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Terminal, MonitorPlay } from 'lucide-react';
import GlassPanel from './components/GlassPanel';
import Navbar from './components/Navbar';
import ProjectCard from './components/ProjectCard';
import Experience from './components/Experience';
import Footer from './components/Footer';
import ProjectsPage from './components/ProjectsPage';
import ScrollToTop from './components/ScrollToTop';
import BackToTop from './components/BackToTop';
import Admin from './components/Admin';
import NotFound from './components/NotFound';
import FAQ from './components/FAQ'; // 1. Import the new FAQ component

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Abdelrahman Ossama | Full-Stack & Media Design";
  }, []);
  
  return (
    // 2. Added flexbox to the main container to space out the Hero and FAQ
    <div style={{ paddingTop: '140px', paddingBottom: '4rem', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
      
      <GlassPanel style={{ padding: '4rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        
        <div style={{ 
          background: 'rgba(0, 184, 255, 0.1)', 
          color: 'var(--accent-color)', 
          padding: '6px 16px', 
          borderRadius: '50px',
          fontSize: '0.85rem',
          fontWeight: '600',
          border: '1px solid var(--accent-glow)'
        }}>
          Available for new opportunities
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '-10px', fontWeight: '500' }}>
          Hi, I'm Abdelrahman.
        </p>

        {/* 3. The New Headline with the <span> tag wrapped around "simple." */}
        <h1 style={{ fontSize: '4.5rem', lineHeight: '1.1', margin: 0, fontWeight: '800', letterSpacing: '-1px' }}>
          Making complex systems feel <span style={{ color: 'var(--accent-color)', textShadow: '0 0 30px var(--accent-glow)' }}>simple.</span>
        </h1>
        
        {/* 4. The New Human-Centric Description */}
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '700px', lineHeight: '1.6' }}>
          Behind every seamless application is a mountain of hidden complexity. When a database lags or an interface is frustrating, the user pays the price. I untangle messy backend architecture (C#, ASP.NET) and design thoughtful visual media so the final product actually makes sense—inside and out.
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="btn-primary" onClick={() => navigate('/projects', { state: { filter: 'code' } })}>
            <Terminal size={20} />
            View Code Projects
          </button>
          <button className="btn-secondary" onClick={() => navigate('/projects', { state: { filter: 'video' } })}>
            <MonitorPlay size={20} />
            Watch Media Reel
          </button>
        </div>

      </GlassPanel>

      {/* 5. Place the FAQ component right below the Hero Panel */}
      <FAQ />

    </div>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <main style={{ padding: '0 20px', minHeight: 'calc(100vh - 200px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <BackToTop />
    </Router>
  );
}

export default App;