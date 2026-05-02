import React, { useState } from 'react';
import { Mail, Send } from 'lucide-react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import GlassPanel from './GlassPanel';
import './Footer.css';

const Footer = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' }); // Clear the form
        setTimeout(() => setStatus('idle'), 5000); // Reset button after 5 seconds
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
    }
  };

  return (
    <footer className="global-footer">
      <GlassPanel className="footer-panel">
        <div className="footer-content">
          
          <div className="footer-info">
            <h2 className="footer-title">Let's build something <span className="brand-accent">great.</span></h2>
            <p className="footer-description">
              Currently open for new opportunities in Software Engineering and System Architecture. 
              Drop me a message if you'd like to collaborate or just say hi.
            </p>
            
            <div className="social-links">
              <a href="mailto:reach.abdelrahman@gmail.com" className="social-icon">
                <Mail size={20} />
              </a>
              <a href="https://www.linkedin.com/in/abdelrahman-osama-254882306/" target="_blank" rel="noreferrer" className="social-icon" title="LinkedIn Profile">
                <FaLinkedin size={20} />
              </a>
              <a href="https://github.com/abdelrahman-osama578" target="_blank" rel="noreferrer" className="social-icon" title="GitHub Profile">
                <FaGithub size={20} />
              </a>
            </div>
          </div>

          <div className="footer-form-container">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name" 
                  className="glass-input" 
                  required 
                />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address" 
                  className="glass-input" 
                  required 
                />
              </div>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message" 
                className="glass-input textarea" 
                rows="4" 
                required
              ></textarea>
              
              <button 
                type="submit" 
                className="btn-primary form-submit"
                disabled={status === 'loading'}
                style={{ 
                  backgroundColor: status === 'success' ? '#00e676' : status === 'error' ? '#ff3333' : 'var(--accent-color)' 
                }}
              >
                {status === 'loading' ? 'Sending...' : 
                 status === 'success' ? 'Message Sent!' : 
                 status === 'error' ? 'Error. Try Again.' : 
                 <><Send size={16} /> Send Message</>}
              </button>
            </form>
          </div>

        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Abdelrahman Ossama. All rights reserved.</p>
        </div>
      </GlassPanel>
    </footer>
  );
};

export default Footer;