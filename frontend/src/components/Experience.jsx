import React from 'react';
import { Briefcase, GraduationCap, Calendar } from 'lucide-react';
import GlassPanel from './GlassPanel';
import './Experience.css';
import { useEffect } from 'react';

const Experience = () => {
  const experiences = [
    {
      id: 1,
      type: 'work',
      role: "Computer Science Jr. Teaching Assistant",
      entity: "German University in Cairo (GUC)",
      date: "March 2025 - Present",
      description: "Guiding undergraduate students in CS lab sessions, simplifying complex programming concepts, and providing targeted feedback on algorithms and data structures."
    },
    {
      id: 2,
      type: 'work',
      role: "IT Solutions Marketing",
      entity: "SoftTrend",
      date: "July 2025 - Aug 2025",
      description: "Facilitated B2B sales for enterprise cloud solutions. Consulted with clients to analyze infrastructure needs and proposed tailored hardware and network security packages."
    },
    {
      id: 3,
      type: 'education',
      role: "Bachelor of Computer Engineering",
      entity: "German University in Cairo (GUC)",
      date: "Expected Sep 2028",
      description: "Focusing on robust system architecture, object-oriented programming, and advanced data structures."
    },
    {
      id: 4,
      type: 'education',
      role: "American Diploma",
      entity: "Dar Jana International Schools (DJIS)",
      date: "Graduated Jun 2023",
      description: "Standardized Testing: SAT Score 1480/1600 (Math: 800)."
    }
  ];

  useEffect(() => {
    document.title = "Experience | Abdelrahman";
  }, []);

  return (
    <div className="experience-container">
      <div className="experience-header">
        <h2 className="section-title">Background</h2>
        <p className="section-subtitle">Professional experience and academic foundation.</p>
      </div>

      <div className="timeline">
        {experiences.map((item) => (
          <div key={item.id} className="timeline-item">
            <div className="timeline-icon-container">
              <div className="timeline-line"></div>
              <div className={`timeline-icon ${item.type}`}>
                {item.type === 'work' ? <Briefcase size={20} /> : <GraduationCap size={20} />}
              </div>
            </div>
            
            <GlassPanel className="timeline-content">
              <div className="timeline-meta">
                <span className="entity">{item.entity}</span>
                <span className="date">
                  <Calendar size={14} /> {item.date}
                </span>
              </div>
              <h3 className="role">{item.role}</h3>
              <p className="description">{item.description}</p>
            </GlassPanel>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experience;