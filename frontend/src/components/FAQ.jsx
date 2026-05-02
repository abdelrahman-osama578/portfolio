import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import GlassPanel from './GlassPanel';
import './FAQ.css';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is your core focus as an engineer?",
      answer: "I focus on eliminating technical debt before it starts. My primary expertise is in architecting scalable, robust backends using C# and ASP.NET Core, ensuring data routes securely and servers don't panic under load."
    },
    {
      question: "Why combine system architecture with 3D motion?",
      answer: "Because a flawless backend is useless if the presentation is confusing. My background in Blender and DaVinci Resolve allows me to bridge the gap, ensuring the frontend visuals are as polished and logical as the database schema."
    },
    {
      question: "What is your approach to a new project?",
      answer: "I spend 80% of my time understanding the exact problem and the constraints, and 20% executing the code. Rushing to write code without a strict MVC blueprint or DevOps pipeline is how projects fail."
    }
  ];

  return (
    <GlassPanel className="faq-container">
      <h3 className="faq-title">Frequently Asked</h3>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className={`faq-item ${openIndex === index ? 'open' : ''}`}
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <div className="faq-question">
              <span style={{ fontWeight: 500 }}>{faq.question}</span>
              {openIndex === index ? (
                <Minus size={18} className="faq-icon" />
              ) : (
                <Plus size={18} className="faq-icon" />
              )}
            </div>
            <div className="faq-answer-wrapper">
              <p className="faq-answer">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
};

export default FAQ;