import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Download, Eye, Copy, Check, Code2, MonitorPlay, ExternalLink } from 'lucide-react'; 
import { FaGithub } from 'react-icons/fa'
import GlassPanel from './GlassPanel';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './ProjectModal.css';
import ReactMarkdown from 'react-markdown';


const ProjectModal = ({ isOpen, onClose, project }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  // NEW: State to manage tabs for Code projects
  const [activeTab, setActiveTab] = useState('preview'); 

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setCurrentIndex(0);
      // Default to preview if they have images/video, otherwise default to code
      setActiveTab((project?.images?.length > 0 || project?.videoUrl) ? 'preview' : 'code');
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, project]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    // Add the listener when the component mounts
    window.addEventListener('keydown', handleKeyDown);  
    // Clean it up when the component unmounts
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  const hasMultipleImages = project.images && project.images.length > 1;
  const currentImage = project.images && project.images.length > 0 ? project.images[currentIndex] : project.imageUrl;

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === project.images.length - 1 ? 0 : prev + 1));
  };

  

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? project.images.length - 1 : prev - 1));
  };

  const handleForceDownload = async (e, imageUrl, filename) => {
    // ... keep your existing handleForceDownload code exactly the same ...
  };

  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-wrapper" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={24} aria-hidden="true" />
        </button>

        <GlassPanel className="modal-content">
          
          {/* NEW: TAB NAVIGATION FOR CODE PROJECTS */}
          {project.type === 'code' && (
            <div className="modal-tabs">
              <button 
                className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`} 
                onClick={() => setActiveTab('preview')}
              >
                <MonitorPlay size={16} /> Visual Preview
              </button>
              <button 
                className={`tab-btn ${activeTab === 'code' ? 'active' : ''}`} 
                onClick={() => setActiveTab('code')}
              >
                <Code2 size={16} /> Source Code
              </button>
            </div>
          )}

          {/* RENDERING LOGIC */}
          {(project.type === 'video' || (project.type === 'code' && activeTab === 'preview' && project.videoUrl)) ? (
            <div className="video-container">
              {/* Pure HTML5 Video Player for Cloudinary Direct Links */}
              <video 
                src={project.videoUrl} 
                autoPlay 
                loop 
                muted 
                playsInline
                className="media-frame"
                style={{ objectFit: 'cover', pointerEvents: 'none' }}
              />
            </div>
          ) : (project.type === 'media' || (project.type === 'code' && activeTab === 'preview')) && currentImage ? (
            <div className="image-container">
              <img src={currentImage} alt={`${project.title} - view ${currentIndex + 1}`} className="media-image" />
              
              <div className="modal-media-buttons">
                {/* 1. The Live App Button (Pops with accent color) */}
                {project.link && (
                  <a href={project.link} target="_blank" rel="noreferrer" className="icon-link-btn launch-btn" onClick={(e) => e.stopPropagation()}>
                    <ExternalLink size={18} /> Launch Live App
                  </a>
                )}

                {/* 2. GitHub Repo Button */}
                {project.github && (
                  <a href={project.github} target="_blank" rel="noreferrer" className="icon-link-btn" onClick={(e) => e.stopPropagation()}>
                    <FaGithub size={18} /> View Repo
                  </a>
                )}

                {/* 3. View Full Image */}
                <a href={currentImage} target="_blank" rel="noreferrer" className="icon-link-btn" onClick={(e) => e.stopPropagation()}>
                  <Eye size={18} /> View Image
                </a>
                
                {/* 4. Download (Only shows for pure visual media/design projects) */}
                {project.type === 'media' && (
                  <button className="icon-link-btn" onClick={(e) => handleForceDownload(e, currentImage, project.title)} style={{ cursor: isDownloading ? 'wait' : 'pointer' }}>
                    <Download size={18} /> {isDownloading ? 'Downloading...' : 'Download'}
                  </button>
                )}
              </div>

              {hasMultipleImages && (
                <>
                  <button className="gallery-nav-btn left" onClick={prevImage}><ChevronLeft size={32} /></button>
                  <button className="gallery-nav-btn right" onClick={nextImage}><ChevronRight size={32} /></button>
                  <div className="gallery-indicators">
                    {project.images.map((_, index) => (
                      <div key={index} className={`dot ${index === currentIndex ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }} />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : project.type === 'code' && activeTab === 'code' ? (
            
            <div className="code-container" style={{ position: 'relative', width: '100%', height: '60vh', background: '#1e1e1e', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', background: '#252526', borderBottom: '1px solid #333' }}>
                <span style={{ color: '#ccc', fontSize: '0.9rem', fontFamily: 'monospace' }}>
                  {project.language ? `${project.language} snippet` : 'source code'}
                </span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(project.codeSnippet);
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                  }}
                  style={{ background: 'transparent', border: 'none', color: '#ccc', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  {isCopied ? <Check size={16} color="#00e676" /> : <Copy size={16} />}
                  <span style={{ fontSize: '0.85rem' }}>{isCopied ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              <div style={{ flex: 1, overflow: 'auto', padding: '0', margin: '0' }} className="custom-scrollbar">
                <SyntaxHighlighter 
                  language={project.language || 'javascript'} 
                  style={vscDarkPlus} 
                  showLineNumbers={true}
                  customStyle={{ margin: 0, padding: '20px', background: 'transparent', fontSize: '0.95rem' }}
                >
                  {project.codeSnippet || "// No code snippet provided."}
                </SyntaxHighlighter>
              </div>
            </div>
            
          ) : (
            <div className="media-placeholder">
              <p>{activeTab === 'preview' ? 'No visual preview available.' : 'No media asset available.'}</p>
            </div>
          )}
          
          <div className="modal-info">
            <h3>{project.title}</h3>
            
            {/* THE FIX: Only show the description if we are on the Visual Preview tab! */}
            {activeTab === 'preview' && (
              <div className="markdown-content">
                <ReactMarkdown>
                  {project.description ? project.description.replace(/\n+/g, '\n\n') : ''}
                </ReactMarkdown>
              </div>
            )}
            
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};

export default ProjectModal;