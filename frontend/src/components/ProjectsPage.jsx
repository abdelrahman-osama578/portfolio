import React, { useState, useEffect } from 'react';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import { useLocation } from 'react-router-dom';
import './ProjectsPage.css';

const ProjectsPage = () => {
  const location = useLocation(); // 2. Initialize the hook
  const [filter, setFilter] = useState(location.state?.filter || 'all');
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch projects from the backend when the page loads
  useEffect(() => {
    const fetchProjects = async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects`);
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false); // Stop loading regardless of success/fail
    }
  };

    fetchProjects();
  }, []);

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.type === filter);

  const openModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <div style={{ paddingTop: '140px', paddingBottom: '4rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header & Filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '24px' }}>
        <div>
          <h2 style={{ fontSize: '3rem', margin: 0, fontWeight: 800 }}>Project Archive</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '1.1rem' }}>
            Software engineering, system architecture, and media design.
          </p>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '50px', border: '1px solid var(--glass-border)' }}>
          {['all', 'code', 'data', 'media', 'video'].map(category => (
            <button 
              key={category}
              onClick={() => setFilter(category)}
              style={{
                background: filter === category ? 'var(--accent-color)' : 'transparent',
                color: filter === category ? '#000' : 'var(--text-secondary)',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '50px',
                cursor: 'pointer',
                fontWeight: '600',
                textTransform: 'capitalize',
                transition: 'all 0.3s ease'
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {/* Loading State & Grid */}
      {isLoading ? (
        /* The Skeleton Grid (Using YOUR exact grid properties) */
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '24px' 
        }}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} style={{ height: '380px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '100%', height: '220px', background: 'rgba(255,255,255,0.05)', animation: 'pulse 1.5s infinite' }}></div>
              <div style={{ padding: '24px' }}>
                <div style={{ width: '60%', height: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '12px', animation: 'pulse 1.5s infinite' }}></div>
                <div style={{ width: '90%', height: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* The Real Grid */
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '24px' 
        }}>
          {filteredProjects.map(project => (
            <ProjectCard 
              key={project._id} 
              {...project} 
              projectData={project}
              onOpenModal={openModal}
            />
          ))}
        </div>
      )}
      
      {/* Empty State */}
      {!isLoading && filteredProjects.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '40px' }}>
          No projects found in this category.
        </p>
      )}

      <ProjectModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        project={selectedProject} 
      />
    </div>
  );
};

export default ProjectsPage;