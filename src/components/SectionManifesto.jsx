import React, { useState } from 'react';
import { useAudio } from './AudioController';

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
        <span>Manifesto</span>
      </div>

      <div className="home-investors__wrapper grid">
        <div style={{ gridColumn: '1 / span 12' }}>
          <h2 className="home-investors__title">
            Capital with
            <br />
            conviction
          </h2>
          
          <div className="home-investors__copy-wrapper">
            <p className="body-copy">
              Hashgraph Ventures is an early-stage VC fund at the intersection of blockchain infrastructure and AI — pre-seed through Series A. We believe decentralised infrastructure and AI-native applications will rewire how value, data, and trust move across the world.
              {expanded && (
                <span style={{ display: 'inline', marginLeft: '0.5rem' }}>
                  We don't wait for consensus. We move with speed and clarity. By backing foundational technology layers, we position ourselves ahead of market trends, empowering visionary founders to scale through uncertainty.
                </span>
              )}
            </p>
          </div>

          <div className="home-investors__cta">
            <button
              onClick={handleToggle}
              onMouseEnter={playHover}
              className="btn btn--small"
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
    </section>
  );
};

export default SectionManifesto;
