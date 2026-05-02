import React, { useState, useEffect } from 'react';
import GlassPanel from '../components/GlassPanel';
import { Edit2, Trash2, ChevronUp, ChevronDown } from 'lucide-react';


const Admin = () => {
  // --- AUTHENTICATION STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('adminToken'));
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // --- FORM & PROJECT STATE ---
  const initialFormState = {
    title: '', description: '', tags: '', type: 'code',
    link: '', github: '', codeSnippet: '', language: '', images: []
  };

  const [formData, setFormData] = useState(initialFormState);
  const [files, setFiles] = useState([]); 
  const [status, setStatus] = useState('idle');
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // --- LOGIN LOGIC ---
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('adminToken', data.token); // Save the VIP pass
        setIsAuthenticated(true);
        setLoginError('');
      } else {
        setLoginError(data.error);
      }
    } catch (err) {
      setLoginError('Server error connecting to login');
    }
  };

  // --- LOGOUT LOGIC ---
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };

  // --- FETCH PROJECTS ---
  const fetchProjects = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects`);
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
    }
  }, [isAuthenticated]);

  // --- FORM HANDLERS ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleEdit = (project) => {
    setEditingId(project._id);
    setFormData({
      title: project.title,
      description: project.description,
      tags: project.tags.join(', '), 
      type: project.type,
      link: project.link || '',
      github: project.github || '',
      codeSnippet: project.codeSnippet || '',
      language: project.language || '',
      images: project.images || [],
      videoUrl: project.videoUrl || ''
    });
    setFiles([]); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${id}`, { 
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}` // Security Token!
        }
      });
      setProjects(projects.filter(p => p._id !== id)); 
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  // --- REORDER LOGIC ---
  const moveProject = async (index, direction) => {
    const newProjects = [...projects];
    
    // Swap the projects in the array based on the direction
    if (direction === 'up' && index > 0) {
      [newProjects[index - 1], newProjects[index]] = [newProjects[index], newProjects[index - 1]];
    } else if (direction === 'down' && index < newProjects.length - 1) {
      [newProjects[index + 1], newProjects[index]] = [newProjects[index], newProjects[index + 1]];
    } else {
      return; // Stops if trying to move the top item up, or bottom item down
    }

    // Instantly update the UI so it feels snappy
    setProjects(newProjects);

    // Send the new ordered list of IDs to the backend
    try {
      const orderedIds = newProjects.map(p => p._id);
      await fetch(`${import.meta.env.VITE_API_URL}/api/projects/reorder`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ orderedIds })
      });
    } catch (error) {
      console.error("Failed to save order to database", error);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setFiles([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('uploading');

    try {
      let mediaUrls = []; 

      if (files.length > 0) {
        const fileData = new FormData(); 
        // THE FIX: Force alphabetical sorting so 1.jpg, 2.jpg, 3.jpg always stay in order!
        const sortedFiles = [...files].sort((a, b) => a.name.localeCompare(b.name));
        sortedFiles.forEach(file => fileData.append('media', file));

        const uploadRes = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
          method: 'POST',
          body: fileData,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}` // Security Token!
          }
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error);
        mediaUrls = uploadData.urls; 
      }

      const projectData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()),
        images: files.length > 0 ? mediaUrls : formData.images, 
        videoUrl: (formData.type === 'video' && mediaUrls.length > 0) ? mediaUrls[0] : formData.videoUrl, 
      };

      const url = editingId 
        ? `${import.meta.env.VITE_API_URL}/api/projects/${editingId}`
        : `${import.meta.env.VITE_API_URL}/api/projects`;
        
      const method = editingId ? 'PUT' : 'POST';

      const projectRes = await fetch(url, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}` // Security Token!
        },
        body: JSON.stringify(projectData),
      });

      if (!projectRes.ok) throw new Error('Database save failed');

      setStatus('success');
      cancelEdit();
      fetchProjects(); 
      setTimeout(() => setStatus('idle'), 3000);

    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  // --- RENDER 1: THE LOGIN SCREEN (If not authenticated) ---
  if (!isAuthenticated) {
    return (
      <div style={{ paddingTop: '140px', minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <GlassPanel style={{ padding: '40px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <h2>Admin Access</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Enter master password to continue.</p>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Password" 
              className="glass-input" 
              required 
            />
            {loginError && <p style={{ color: '#ff3333', margin: 0, fontSize: '0.9rem' }}>{loginError}</p>}
            <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>Unlock Dashboard</button>
          </form>
        </GlassPanel>
      </div>
    );
  }

  // --- RENDER 2: THE SECURE ADMIN DASHBOARD (If authenticated) ---
  return (
    <div style={{ paddingTop: '140px', paddingBottom: '4rem', maxWidth: '800px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '2.5rem', margin: 0 }}>
          {editingId ? 'Edit Project' : 'Add New Project'}
        </h2>
        <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
          Lock & Logout
        </button>
      </div>
      
      <GlassPanel style={{ padding: '32px', marginBottom: '60px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Project Title" className="glass-input" required />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Project Description" className="glass-input" rows="14" required />
          <input type="text" name="tags" value={formData.tags} onChange={handleChange} placeholder="Tags (comma separated)" className="glass-input" required />
          
          <select name="type" value={formData.type} onChange={handleChange} className="glass-input" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <option value="code">Software / Code</option>
            <option value="data">Data / Dashboard</option>
            <option value="media">Visual Media (Images)</option>
            <option value="video">3D Motion / Video</option>
          </select>

          <input type="text" name="link" value={formData.link} onChange={handleChange} placeholder="Live Website URL (Optional)" className="glass-input" />

          {formData.type === 'code' && (
            <>
              <input type="text" name="github" value={formData.github} onChange={handleChange} placeholder="GitHub URL (Optional)" className="glass-input" />
              <input type="text" name="language" value={formData.language} onChange={handleChange} placeholder="Language (e.g. csharp, java)" className="glass-input" />
              <textarea name="codeSnippet" value={formData.codeSnippet} onChange={handleChange} placeholder="Paste raw code snippet here..." className="glass-input" rows="8" style={{ fontFamily: 'monospace' }} />
            </>
          )}

            <div style={{ padding: '16px', border: '1px dashed var(--glass-border)', borderRadius: '12px' }}>
            <p style={{ margin: '0 0 8px 0', color: 'var(--text-secondary)' }}>
              {editingId ? 'Upload NEW Media (Will overwrite existing)' : 'Upload Media (Screenshots or Video Demo)'}
            </p>
            <input type="file" multiple onChange={handleFileChange} style={{ color: 'var(--text-primary)' }} />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={status === 'uploading'}
              style={{ 
                flex: 1, justifyContent: 'center',
                backgroundColor: status === 'success' ? '#00e676' : status === 'error' ? '#ff3333' : 'var(--accent-color)'
              }}
            >
              {status === 'uploading' ? 'Saving...' : status === 'success' ? 'Saved!' : editingId ? 'Update Project' : 'Upload Project'}
            </button>
            
            {editingId && (
              <button type="button" onClick={cancelEdit} className="btn-secondary" style={{ padding: '0 24px' }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </GlassPanel>

      <h2 style={{ fontSize: '2rem', marginBottom: '24px' }}>Manage Portfolio</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {projects.map((project, index) => (
          <GlassPanel key={project._id} style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '1.2rem' }}>{project.title}</h4>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'capitalize' }}>
                {project.type}
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              
              {/* NEW: The Up/Down Order Arrows */}
              <div style={{ display: 'flex', flexDirection: 'column', marginRight: '16px', gap: '4px' }}>
                <button 
                  onClick={() => moveProject(index, 'up')} 
                  disabled={index === 0}
                  style={{ background: 'transparent', border: 'none', color: index === 0 ? 'rgba(255,255,255,0.1)' : 'var(--text-secondary)', cursor: index === 0 ? 'default' : 'pointer' }}
                >
                  <ChevronUp size={20} />
                </button>
                <button 
                  onClick={() => moveProject(index, 'down')} 
                  disabled={index === projects.length - 1}
                  style={{ background: 'transparent', border: 'none', color: index === projects.length - 1 ? 'rgba(255,255,255,0.1)' : 'var(--text-secondary)', cursor: index === projects.length - 1 ? 'default' : 'pointer' }}
                >
                  <ChevronDown size={20} />
                </button>
              </div>

              <button 
                onClick={() => handleEdit(project)} 
                style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
              >
                <Edit2 size={18} />
              </button>
              <button 
                onClick={() => handleDelete(project._id)} 
                style={{ background: 'transparent', border: '1px solid rgba(255,51,51,0.3)', color: '#ff3333', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </GlassPanel>
        ))}
      </div>
      
    </div>
  );
};

export default Admin;