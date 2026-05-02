import React from 'react';
import './GlassPanel.css'; // Or however you import its styles

// 1. Add ...props to the destructured arguments
const GlassPanel = ({ children, className = '', style, ...props }) => {
  return (
    <div 
      className={`glass-panel ${className}`} 
      style={style}
      {...props} /* 2. This passes the onClick down to the actual div! */
    >
      {children}
    </div>
  );
};

export default GlassPanel;