import React from 'react';
import { ExternalLink, Video, Image as ImageIcon } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import GlassPanel from './GlassPanel';
import './ProjectCard.css';

const ProjectCard = ({ title, description, tags, type, link, github, onOpenModal, projectData }) => {
  
  // 1. Grab the primary asset URL
  const primaryAsset = projectData.images && projectData.images.length > 0 
    ? projectData.images[0] 
    : projectData.videoUrl || projectData.imageUrl;

  // 2. Detect if the asset is a raw video file
  const isVideoAsset = primaryAsset && primaryAsset.match(/\.(mp4|webm|mov)$/i);
  // THE FIX: Strip out Markdown characters (*, #, `) just for the preview card
  const cleanDescription = description ? description.replace(/[*#`_]/g, '') : '';

  return (
    <GlassPanel 
      className="project-card" 
      onClick={() => onOpenModal(projectData)}
      style={{ cursor: 'pointer' }} 
    >
      <div className="project-image-container" style={{ padding: 0, overflow: 'hidden' }}>
        {isVideoAsset ? (
          <video 
            src={primaryAsset} 
            autoPlay 
            loop 
            muted 
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
          />
        ) : primaryAsset ? (
          <img src={primaryAsset} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div className="image-placeholder">
            {type === 'media' ? <ImageIcon size={40} /> : type === 'video' ? <Video size={40} /> : <span className="text-placeholder">{title.charAt(0)}</span>}
          </div>
        )}
      </div>
      
      <div className="project-content">
        <h3 className="project-title">{title}</h3>
        
        {/* THE FIX: Render the cleaned, markdown-free description */}
        <p className="project-description">{cleanDescription}</p>
        
        <div className="project-tags">
          {tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
        
        <div className="project-links">
          {github && (
            <a href={github} target="_blank" rel="noreferrer" className="icon-link" onClick={(e) => e.stopPropagation()}>
              <FaGithub size={18} /> Code
            </a>
          )}
          {link && type !== 'media' && type !== 'video' && (
            <a href={link} target="_blank" rel="noreferrer" className="icon-link" onClick={(e) => e.stopPropagation()}>
              <ExternalLink size={18} /> View Live
            </a>
          )}
          
          {(type === 'media' || type === 'video') && (
            <button 
              className="icon-link" 
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              onClick={(e) => {
                e.stopPropagation(); 
                onOpenModal(projectData);
              }} 
            >
              {type === 'video' ? <Video size={18} /> : <ImageIcon size={18} />} 
              {type === 'video' ? 'Play Reel' : 'View Design'}
            </button>
          )}
        </div>
      </div>
    </GlassPanel>
  );
};

export default ProjectCard;