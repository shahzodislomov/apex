import React, { useState } from 'react';
import { useAudio } from './AudioController';
import BorderGlow from './BorderGlow';
import Carousel from './Carousel';

const SectionManifesto = () => {
  const [expanded, setExpanded] = useState(false);
  const { playClick, playHover, playRockExtend, playRockRetract } = useAudio();

  const handleToggle = () => {
    playClick();
    if (!expanded) {
      playRockExtend();
    } else {
      playRockRetract();
    }
    setExpanded(!expanded);
  };

  return (
    <section className="section manifesto grid">
      <div className="section-title">
        <span className="section-title__id">//01</span>
        <span>Manifesto & Capabilities</span>
      </div>

      <div style={{ gridColumn: '1 / -1', width: '100%' }}>
        <BorderGlow
          edgeSensitivity={35}
          glowColor="210 80 75"
          backgroundColor="rgba(15, 23, 42, 0.85)"
          borderRadius={24}
          glowRadius={35}
          glowIntensity={1.2}
          coneSpread={30}
          animated={true}
          colors={['#9bb8e1', '#4a8fdf', '#06b6d4']}
          className="cursor-target"
        >
          <div style={{ padding: '3rem 3.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 800, color: '#ffffff', margin: 0, lineHeight: 1.1, letterSpacing: '-0.02em', textTransform: 'none' }}>
                Capital with conviction
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#9bb8e1', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginTop: '0.8rem' }}>
                Early-Stage Tech & Venture Studio
              </p>
            </div>
            
            <div className="home-investors__copy-wrapper" style={{ margin: 0 }}>
              <p className="body-copy" style={{ fontSize: '1rem', lineHeight: '1.65', color: '#cbd5e1', margin: 0 }}>
                ApexDevs is a high-conviction tech & engineering studio at the intersection of web development, blockchain infrastructure, and AI — from early concept through scaling. We craft full-stack web applications, decentralized protocols, and AI systems that drive real value across the digital ecosystem.
                {expanded && (
                  <span style={{ display: 'inline', marginLeft: '0.5rem', color: '#e2e8f0' }}>
                    We don't wait for consensus. We move with speed and clarity. By backing foundational technology layers and shipping robust code, we empower team projects and visionary founders to scale through complexity.
                  </span>
                )}
              </p>

              <div style={{ marginTop: '1.8rem' }}>
                <button
                  onClick={handleToggle}
                  onMouseEnter={playHover}
                  className="btn btn--small cursor-target"
                >
                  <span className="btn__wrapper oh">
                    <span className="btn__label">{expanded ? 'Read Less' : 'Read More'}</span>
                  </span>
                  <span className="btn__shimmer">
                    <span className="btn__shimmer-inner" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </BorderGlow>
      </div>

      {/* Services & Capabilities 3D Carousel */}
      <div style={{ gridColumn: '1 / span 12', marginTop: '3.5rem' }}>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.2rem', fontWeight: 700 }}>
          What We Do & Core Capabilities
        </p>
        <Carousel
          baseWidth={380}
          autoplay={true}
          autoplayDelay={3500}
          pauseOnHover={true}
          loop={true}
          round={false}
        />
      </div>
    </section>
  );
};

export default SectionManifesto;
