import React, { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AudioProvider, useAudio } from './components/AudioController';
import Canvas3D from './components/Canvas3D';
import TargetCursor from './components/TargetCursor';
import ClickSpark from './components/ClickSpark';
import Strands from './components/Strands';
import CursorGrid from './components/CursorGrid';
import Header from './components/Header';
import Scrollbar from './components/Scrollbar';
import SectionManifesto from './components/SectionManifesto';
import SectionPortfolio from './components/SectionPortfolio';
import SectionTeam from './components/SectionTeam';

gsap.registerPlugin(ScrollTrigger);

const AppContent = () => {
  const [activeSectionState, setActiveSectionState] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [sectionProgress, setSectionProgress] = useState(0);
  const { setActiveSection, playIntro, playHover } = useAudio();

  const containerRef = useRef(null);

  // Sync active section to both local state and Audio context
  const handleSectionActive = (index) => {
    setActiveSectionState(index);
    setActiveSection(index);
  };

  useEffect(() => {
    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // organic exponential curve
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    const updateLenis = (time) => {
      lenis.raf(time);
      requestAnimationFrame(updateLenis);
    };
    requestAnimationFrame(updateLenis);

    // Play intro sound once scroll/interaction starts
    const startAudioOnInteract = () => {
      playIntro();
      window.removeEventListener('click', startAudioOnInteract);
      window.removeEventListener('wheel', startAudioOnInteract);
      window.removeEventListener('touchstart', startAudioOnInteract);
    };
    window.addEventListener('click', startAudioOnInteract);
    window.addEventListener('wheel', startAudioOnInteract);
    window.addEventListener('touchstart', startAudioOnInteract);

    // 2. Setup GSAP ScrollTrigger for each section to track section progress
    const sections = gsap.utils.toArray('.section-wrapper');
    sections.forEach((section, index) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          if (self.isActive) {
            handleSectionActive(index);
            setSectionProgress(self.progress);
          }
        },
      });

      ScrollTrigger.create({
        trigger: section,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => handleSectionActive(index),
        onEnterBack: () => handleSectionActive(index),
      });
    });

    // Global scroll progress listener
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        setScrollProgress(self.progress);
      },
    });

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      window.removeEventListener('click', startAudioOnInteract);
      window.removeEventListener('wheel', startAudioOnInteract);
      window.removeEventListener('touchstart', startAudioOnInteract);
    };
  }, []);

  return (
    <div ref={containerRef} className="app-container">
      {/* Background Strands Effect */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <Strands
          colors={['#F97316', '#4a8fdf', '#7C3AED', '#06B6D4']}
          count={3}
          speed={0.5}
          amplitude={1.0}
          waviness={1.0}
          thickness={0.7}
          glow={2.6}
          taper={3.0}
          spread={1.0}
          intensity={0.6}
          saturation={2.0}
          opacity={0.5}
          scale={1.5}
        />
      </div>

      {/* Interactive Cursor Grid Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
        <CursorGrid
          color="#9bb8e1"
          cellSize={60}
          radius={160}
          falloff="smooth"
          holdTime={400}
          fadeDuration={800}
          lineWidth={1.2}
          maxOpacity={0.75}
          gridOpacity={0.15}
          clickPulse={true}
          pulseSpeed={600}
        />
      </div>

      {/* TargetCursor from React Bits */}
      <TargetCursor
        targetSelector=".cursor-target"
        spinDuration={2}
        hideDefaultCursor={true}
        parallaxOn={true}
        cursorColor="#ffffff"
        cursorColorOnTarget="#9bb8e1"
      />

      {/* Background WebGL Scene */}
      <Canvas3D activeSection={activeSectionState} sectionProgress={sectionProgress} />

      {/* Global UI Overlays */}
      <Header />
      <Scrollbar progress={scrollProgress} />

      {/* Scrollable Layout Content */}
      <main>
        {/* Section 0: Hero */}
        <div className="section-wrapper">
          <section className="section section-hero grid">
            <h1 className="home-hero__title">
              The next wave
              <br />
              of venture capital
            </h1>

            <button
              onClick={() => {
                const manifestoSec = document.querySelectorAll('.section-wrapper')[1];
                manifestoSec?.scrollIntoView({ behavior: 'smooth' });
              }}
              onMouseEnter={playHover}
              className="home-hero__btn btn-label ttu cursor-target"
            >
              <span className="home-hero__btn-label">Scroll down to discover more</span>
              <span className="home-hero__btn-line" />
            </button>
          </section>
        </div>

        {/* Section 1: Manifesto */}
        <div className="section-wrapper">
          <SectionManifesto />
        </div>

        {/* Section 2: Portfolio */}
        <div className="section-wrapper">
          <SectionPortfolio />
        </div>

        {/* Section 3: Team */}
        <div className="section-wrapper">
          <SectionTeam />
        </div>

        {/* Section 4: Footer */}
        <div className="section-wrapper">
          <section className="section footer grid">
            <h3 className="footer__title">
              We prioritize warm introductions
              <br />
              and ecosystem referrals
            </h3>

            <div className="footer__bottom">
              <div className="footer__copyright">
                © HolyElite 2026
              </div>

              <ul className="footer__links">
                <li>
                  <a
                    href="mailto:info@hashgraphvc.com"
                    onMouseEnter={playHover}
                    onClick={() => handleSectionActive(4)}
                    className="cursor-target"
                  >
                    Email
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/HashgraphVC"
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={playHover}
                    onClick={() => handleSectionActive(4)}
                    className="cursor-target"
                  >
                    X (Twitter)
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/company/hashgraph-ventures/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={playHover}
                    onClick={() => handleSectionActive(4)}
                    className="cursor-target"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy-policy"
                    onMouseEnter={playHover}
                    onClick={() => handleSectionActive(4)}
                    className="cursor-target"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <AudioProvider>
      <ClickSpark
        sparkColor="#9bb8e1"
        sparkSize={12}
        sparkRadius={25}
        sparkCount={10}
        duration={450}
        easing="ease-out"
        extraScale={1.0}
      >
        <AppContent />
      </ClickSpark>
    </AudioProvider>
  );
};

export default App;
