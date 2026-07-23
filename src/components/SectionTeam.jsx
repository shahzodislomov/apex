import React, { useState } from 'react';
import { useAudio } from './AudioController';
import { FaGithub, FaLinkedin, FaTelegram } from 'react-icons/fa6';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const teamMembers = [
  {
    name: "Abdulloh Qurbonov",
    position: "Full-Stack & Mobile App Developer",
    description: "Specializes in building high-performance full-stack web applications and cross-platform mobile apps (iOS & Android). Expert in modern frontend frameworks, scalable backends, database orchestration, and seamless user experiences.",
    telegram: "https://t.me/cs_clay",
    linkedin: "https://www.linkedin.com/in/abdulloh-qurbonov-030bb7357/",
    github: "https://github.com/abdullohqurbon0v"
  },
  {
    name: "Shahzod Islomov",
    position: "Full-Stack & Mobile App Developer",
    description: "Expert in end-to-end full-stack web development, mobile applications, interactive 3D/WebGL user interfaces, and Web3 protocol integrations. Crafts production-ready digital products with clean, maintainable architecture.",
    telegram: "https://t.me/shawn_isl",
    linkedin: "https://www.linkedin.com/in/shahzodislomov/",
    github: "https://github.com/shahzodislomov/"
  },
  {
    name: "Baxa",
    position: "PHP Developer & DevOps Specialist",
    description: "Backend PHP & Laravel specialist focused on high-performance API engineering, serverless & containerized cloud infrastructure, automated CI/CD pipelines, and high-density database optimization.",
    telegram: "https://t.me/baxa_devops",
    linkedin: "",
    github: ""
  }
];

const SectionTeam = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const { playClick, playHover } = useAudio();

  const handleToggleRow = (index) => {
    playClick();
    setExpandedIndex(prev => (prev === index ? null : index));
  };

  return (
    <section className="section team grid">
      <div className="section-title">
        <span className="section-title__id">//03</span>
        <span>Team</span>
      </div>

      <div className="home-team__wrapper">
        <h2 className="home-team__title">
          Engineering
          <br />
          Excellence
        </h2>
        <p className="body-copy">
          We are a focused team of full-stack engineers, mobile app developers, and DevOps specialists. Click on any team member below to view their detailed focus areas and direct channels.
        </p>
      </div>

      <div className="home-team__members-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
        {teamMembers.map((member, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <motion.div
              key={member.name}
              className="team-member-card cursor-target"
              onClick={() => handleToggleRow(index)}
              onMouseEnter={playHover}
              layout
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                border: isExpanded ? '1px solid rgba(155, 184, 225, 0.4)' : '1px solid rgba(155, 184, 225, 0.15)',
                borderRadius: '16px',
                padding: '1.5rem 1.8rem',
                backdropFilter: 'blur(12px)',
                cursor: 'pointer',
                overflow: 'hidden',
                boxShadow: isExpanded ? '0 10px 30px rgba(0, 0, 0, 0.4)' : 'none'
              }}
            >
              <div className="team-card-header">
                <div className="team-member-info" style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <span className="team-member-name" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
                    {member.name}
                  </span>
                  <span className="team-member-position" style={{ fontSize: '0.9rem', color: '#9bb8e1', fontWeight: 600 }}>
                    {member.position}
                  </span>
                </div>

                <div className="team-card-actions" onClick={e => e.stopPropagation()}>
                  {member.telegram && (
                    <a
                      href={member.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-target"
                      style={{ color: '#9bb8e1', transition: 'color 0.2s ease', padding: '0.4rem' }}
                      title="Telegram"
                    >
                      <FaTelegram size={20} />
                    </a>
                  )}
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-target"
                      style={{ color: '#9bb8e1', transition: 'color 0.2s ease', padding: '0.4rem' }}
                      title="GitHub"
                    >
                      <FaGithub size={20} />
                    </a>
                  )}
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-target"
                      style={{ color: '#9bb8e1', transition: 'color 0.2s ease', padding: '0.4rem' }}
                      title="LinkedIn"
                    >
                      <FaLinkedin size={20} />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => handleToggleRow(index)}
                    style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.2rem' }}
                    aria-label="Toggle bio"
                  >
                    <motion.span animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
                      <ChevronDown size={22} color={isExpanded ? '#9bb8e1' : '#cbd5e1'} />
                    </motion.span>
                  </button>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ marginTop: '1.2rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <p style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: '1.65', margin: 0 }}>
                        {member.description}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default SectionTeam;
