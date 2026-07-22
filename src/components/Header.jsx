import React from 'react';
import { useAudio } from './AudioController';

const Header = () => {
  const { isMuted, setIsMuted, playClick, playHover } = useAudio();

  const handleLogoClick = (e) => {
    e.preventDefault();
    playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSoundToggle = () => {
    playClick();
    setIsMuted(!isMuted);
  };

  return (
    <header className="header">
      <a href="/" onClick={handleLogoClick} className="header-logo cursor-target" aria-label="ApexDevs Homepage">
        {/* Logo Mark */}
        <span className="header-logo__mark" style={{ background: '#9bb8e1', color: '#000209', borderRadius: '4px', padding: '0.2rem 0.5rem', fontWeight: '900', fontSize: '1.2rem', marginRight: '0.6rem' }}>A</span>
        {/* Text Logo: ApexDevs */}
        <span className="header-logo__type" style={{ fontSize: '1.25rem', fontWeight: '800', display: 'flex', alignItems: 'center', letterSpacing: '0.05em', textTransform: 'uppercase' }}>ApexDevs</span>
      </a>

      {/* Sound toggle button */}
      <button
        onClick={handleSoundToggle}
        onMouseEnter={playHover}
        className={`sound-toggle ttu cursor-target ${!isMuted ? 'sound-toggle--active' : ''}`}
        aria-label={isMuted ? "Enable sounds" : "Disable sounds"}
      >
        <span className="sound-toggle__label-wrapper oh">
          <span className="sound-toggle__label-inner">
            <span className="sound-toggle__label-status">SOUND OFF</span>
            <span className="sound-toggle__label-status">SOUND ON</span>
          </span>
        </span>
        <svg className="sound-toggle__svg" viewBox="0 0 24 7" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 3.5L0.8 3.5L1.6 3.5L2.4 3.5L3.2 3.5L4.0 3.5L4.8 3.5L5.6 3.5L6.4 3.5L7.2 3.5L8.0 3.5L8.8 3.5L9.6 3.5L10.4 3.5L11.2 3.5L12.0 3.5L12.8 3.5L13.6 3.5L14.4 3.5L15.2 3.5L16.0 3.5L16.8 3.5L17.6 3.5L18.4 3.5L19.2 3.5L20.0 3.5L20.8 3.5L21.6 3.5L22.4 3.5L23.2 3.5L24.0 3.5" stroke="currentColor" strokeWidth="1" strokeMiterlimit="10" fill="none" />
        </svg>
      </button>
    </header>
  );
};

export default Header;
