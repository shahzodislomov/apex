import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const AudioContext = createContext(null);

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [activeSection, setActiveSection] = useState(0);

  // References to audio elements
  const ambientMusicRef = useRef(null);
  const particlesLoopRef = useRef(null);
  const sectionLoopsRef = useRef([]);
  const activeLoopIndexRef = useRef(0);

  // Audio files mapping
  const loopFiles = [
    '/sounds/webm/sfx_Hero_Loop.webm',       // Section 0
    '/sounds/webm/sfx_Investors_Loop.webm',  // Section 1
    '/sounds/webm/sfx_Portfolio_Loop.webm',  // Section 2
    '/sounds/webm/sfx_TeamFooter_Loop.webm', // Section 3
    '/sounds/webm/sfx_TeamFooter_Loop.webm', // Section 4 (Footer)
  ];

  // Click & Hover SFX
  const playClick = () => {
    if (isMuted) return;
    const audio = new Audio('/sounds/webm/sfx_UI_click.webm');
    audio.volume = 0.5;
    audio.play().catch(() => {});
  };

  const playHover = () => {
    if (isMuted) return;
    const audio = new Audio('/sounds/webm/sfx_UI_hover.webm');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  const playIntro = () => {
    if (isMuted) return;
    const audio = new Audio('/sounds/webm/sfx_intro.webm');
    audio.volume = 0.6;
    audio.play().catch(() => {});
  };

  // Face Morph sound effects
  const playFaceMorph = () => {
    if (isMuted) return;
    const id = Math.floor(Math.random() * 3) + 1;
    const audio = new Audio(`/sounds/webm/sfx_UI_faceMorph${id}.webm`);
    audio.volume = 0.4;
    audio.play().catch(() => {});
  };

  // Rock sounds
  const playRockExtend = () => {
    if (isMuted) return;
    const id = Math.floor(Math.random() * 5) + 1;
    const audio = new Audio(`/sounds/webm/sfx_rock_extend${id}.webm`);
    audio.volume = 0.6;
    audio.play().catch(() => {});
  };

  const playRockRetract = () => {
    if (isMuted) return;
    const id = Math.floor(Math.random() * 5) + 1;
    const audio = new Audio(`/sounds/webm/sfx_rock_retract${id}.webm`);
    audio.volume = 0.6;
    audio.play().catch(() => {});
  };

  // Initialize background loops
  useEffect(() => {
    // 1. Ambient Music
    ambientMusicRef.current = new Audio('/sounds/webm/Music_Ambient_Loop.webm');
    ambientMusicRef.current.loop = true;
    ambientMusicRef.current.volume = 0.0; // Start at 0, fade in when unmuted

    // 2. Particles Loop
    particlesLoopRef.current = new Audio('/sounds/webm/sfx_particles_loop.webm');
    particlesLoopRef.current.loop = true;
    particlesLoopRef.current.volume = 0.0;

    // 3. Section Loops
    sectionLoopsRef.current = loopFiles.map((file) => {
      const audio = new Audio(file);
      audio.loop = true;
      audio.volume = 0.0;
      return audio;
    });

    return () => {
      // Cleanup
      ambientMusicRef.current?.pause();
      particlesLoopRef.current?.pause();
      sectionLoopsRef.current.forEach((audio) => audio.pause());
    };
  }, []);

  // Handle Mute/Unmute state
  useEffect(() => {
    const ambient = ambientMusicRef.current;
    const particles = particlesLoopRef.current;
    const sections = sectionLoopsRef.current;

    if (!ambient || !particles || sections.length === 0) return;

    if (isMuted) {
      // Fade out and pause
      fadeVolume(ambient, 0, 300, () => ambient.pause());
      fadeVolume(particles, 0, 300, () => particles.pause());
      sections.forEach((s) => fadeVolume(s, 0, 300, () => s.pause()));
    } else {
      // Unmute: play loops and fade in
      ambient.play().then(() => fadeVolume(ambient, 0.4, 1000)).catch(() => {});
      particles.play().then(() => fadeVolume(particles, 0.25, 1000)).catch(() => {});
      
      const activeS = sections[activeSection];
      if (activeS) {
        activeS.play().then(() => fadeVolume(activeS, 0.5, 1000)).catch(() => {});
      }
    }
  }, [isMuted]);

  // Handle Section Transitions
  useEffect(() => {
    if (isMuted) {
      activeLoopIndexRef.current = activeSection;
      return;
    }

    const sections = sectionLoopsRef.current;
    if (sections.length === 0) return;

    const prevIndex = activeLoopIndexRef.current;
    const nextIndex = activeSection;

    if (prevIndex === nextIndex) return;

    const prevAudio = sections[prevIndex];
    const nextAudio = sections[nextIndex];

    // Fade out previous section loop
    if (prevAudio) {
      fadeVolume(prevAudio, 0.0, 800, () => {
        prevAudio.pause();
      });
    }

    // Play and fade in next section loop
    if (nextAudio) {
      nextAudio.play().then(() => {
        fadeVolume(nextAudio, 0.5, 800);
      }).catch(() => {});
    }

    activeLoopIndexRef.current = nextIndex;
  }, [activeSection, isMuted]);

  // Helper function to fade volume smoothly
  const fadeVolume = (audioEl, targetVol, duration, onComplete) => {
    if (!audioEl) return;
    const startVol = audioEl.volume;
    const diff = targetVol - startVol;
    const step = 0.05;
    const intervalTime = 30; // ms
    const stepsCount = duration / intervalTime;
    const volStep = diff / stepsCount;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      let nextVol = startVol + volStep * currentStep;
      if (nextVol < 0) nextVol = 0;
      if (nextVol > 1) nextVol = 1;
      audioEl.volume = nextVol;

      if (currentStep >= stepsCount) {
        audioEl.volume = targetVol;
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, intervalTime);
  };

  return (
    <AudioContext.Provider
      value={{
        isMuted,
        setIsMuted,
        activeSection,
        setActiveSection,
        playClick,
        playHover,
        playIntro,
        playFaceMorph,
        playRockExtend,
        playRockRetract,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
