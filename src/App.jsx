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
import CardNav from './components/CardNav';
import StaggeredMenu from './components/StaggeredMenu';
import Dock from './components/Dock';
import Scrollbar from './components/Scrollbar';
import SectionManifesto from './components/SectionManifesto';
import SectionPortfolio from './components/SectionPortfolio';
import SectionTeam from './components/SectionTeam';
import SectionTestimonials from './components/SectionTestimonials';
import MagicBento from './components/MagicBento';
import { FiHome, FiFileText, FiFolder, FiUsers, FiMail, FiGithub } from 'react-icons/fi';

gsap.registerPlugin(ScrollTrigger);

const staggeredNavItems = [
  { label: 'Home', ariaLabel: 'Go to Home', onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
  { label: 'Manifesto', ariaLabel: 'Go to Manifesto', onClick: () => document.querySelectorAll('.section-wrapper')[1]?.scrollIntoView({ behavior: 'smooth' }) },
  { label: 'Projects', ariaLabel: 'Go to Projects', onClick: () => document.querySelectorAll('.section-wrapper')[2]?.scrollIntoView({ behavior: 'smooth' }) },
  { label: 'Team', ariaLabel: 'Go to Team', onClick: () => document.querySelectorAll('.section-wrapper')[3]?.scrollIntoView({ behavior: 'smooth' }) },
  { label: 'Testimonials', ariaLabel: 'Go to Testimonials', onClick: () => document.querySelectorAll('.section-wrapper')[4]?.scrollIntoView({ behavior: 'smooth' }) },
  { label: 'Contact', ariaLabel: 'Go to Contact', onClick: () => document.querySelectorAll('.section-wrapper')[5]?.scrollIntoView({ behavior: 'smooth' }) }
];

const staggeredSocialItems = [
  { label: 'Telegram: @cs_clay', link: 'https://t.me/cs_clay' },
  { label: 'Telegram: @baxa_devops', link: 'https://t.me/baxa_devops' },
  { label: 'Telegram: @shawn_isl', link: 'https://t.me/shawn_isl' },
  { label: 'GitHub (Shahzod)', link: 'https://github.com/shahzodislomov/' },
  { label: 'GitHub (Abdulloh)', link: 'https://github.com/abdullohqurbon0v' },
  { label: 'LinkedIn (Shahzod)', link: 'https://www.linkedin.com/in/shahzodislomov/' },
  { label: 'LinkedIn (Abdulloh)', link: 'https://www.linkedin.com/in/abdulloh-qurbonov-030bb7357/' }
];

const dockItems = [
  { icon: <FiHome size={20} />, label: 'Home', onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
  { icon: <FiFileText size={20} />, label: 'Manifesto', onClick: () => document.querySelectorAll('.section-wrapper')[1]?.scrollIntoView({ behavior: 'smooth' }) },
  { icon: <FiFolder size={20} />, label: 'Projects', onClick: () => document.querySelectorAll('.section-wrapper')[2]?.scrollIntoView({ behavior: 'smooth' }) },
  { icon: <FiUsers size={20} />, label: 'Team', onClick: () => document.querySelectorAll('.section-wrapper')[3]?.scrollIntoView({ behavior: 'smooth' }) },
  { icon: <FiMail size={20} />, label: 'Contact', onClick: () => document.querySelectorAll('.section-wrapper')[4]?.scrollIntoView({ behavior: 'smooth' }) },
  { icon: <FiGithub size={20} />, label: 'GitHub', onClick: () => window.open('https://github.com/shahzodislomov/', '_blank') }
];

// const cardNavItems = [
//   {
//     label: "About",
//     bgColor: "#0f172a",
//     textColor: "#ffffff",
//     links: [
//       { label: "Manifesto", ariaLabel: "Our Manifesto", onClick: () => document.querySelectorAll('.section-wrapper')[1]?.scrollIntoView({ behavior: 'smooth' }) },
//       { label: "Team", ariaLabel: "Team Members", onClick: () => document.querySelectorAll('.section-wrapper')[3]?.scrollIntoView({ behavior: 'smooth' }) }
//     ]
//   },
//   {
//     label: "Projects", 
//     bgColor: "#1e293b",
//     textColor: "#ffffff",
//     links: [
//       { label: "Portfolio", ariaLabel: "Portfolio Companies", onClick: () => document.querySelectorAll('.section-wrapper')[2]?.scrollIntoView({ behavior: 'smooth' }) },
//       { label: "Ecosystem", ariaLabel: "Ecosystem Partners", onClick: () => document.querySelectorAll('.section-wrapper')[2]?.scrollIntoView({ behavior: 'smooth' }) }
//     ]
//   },
//   {
//     label: "Contact",
//     bgColor: "#1e293b", 
//     textColor: "#ffffff",
//     links: [
//       { label: "Email", ariaLabel: "Email us", href: "mailto:info@hashgraphvc.com" },
//       { label: "Twitter", ariaLabel: "Twitter", href: "https://x.com/HashgraphVC" },
//       { label: "LinkedIn", ariaLabel: "LinkedIn", href: "https://www.linkedin.com/company/hashgraph-ventures/" }
//     ]
//   }
// ];

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
          maxOpacity={0.25}
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
      <StaggeredMenu
        position="right"
        items={staggeredNavItems}
        socialItems={staggeredSocialItems}
        displaySocials={true}
        displayItemNumbering={true}
        colors={['#0f172a', '#1e293b', '#334155']}
        accentColor="#9bb8e1"
        isFixed={true}
      />
      {/* <CardNav
        items={cardNavItems}
        baseColor="rgba(15, 23, 42, 0.85)"
        menuColor="#ffffff"
        buttonBgColor="#9bb8e1"
        buttonTextColor="#000209"
        ease="power3.out"
      /> */}
      <Dock items={dockItems} panelHeight={58} baseItemSize={44} magnification={64} />
      <Scrollbar progress={scrollProgress} />

      {/* Scrollable Layout Content */}
      <main>
        {/* Section 0: Hero */}
        <div className="section-wrapper">
          <section className="section section-hero grid">
            <div style={{ gridColumn: '1 / -1', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#9bb8e1', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, background: 'rgba(155, 184, 225, 0.1)', padding: '0.3rem 0.8rem', borderRadius: '99px', display: 'inline-block', marginBottom: '0.8rem' }}>
                🟢 ApexDevs Engineering Studio
              </span>
              <h1 className="home-hero__title" style={{ fontSize: 'clamp(2.4rem, 4.5vw, 4.2rem)', margin: 0, lineHeight: 1.1, textTransform: 'none' }}>
                Full-Stack, Mobile Apps
                <br />
                & AI Engineering
              </h1>
              <p style={{ marginTop: '0.8rem', color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.5, maxWidth: '750px' }}>
                We build high-performance web platforms, cross-platform mobile apps (iOS & Android), interactive 3D UI, and scalable cloud systems.
              </p>
            </div>

            {/* Compact MagicBento Grid inside Hero */}
            <div style={{ gridColumn: '1 / -1', width: '100%', marginBottom: '2rem' }}>
              <MagicBento
                textAutoHide={true}
                enableStars={true}
                enableSpotlight={true}
                enableBorderGlow={true}
                enableTilt={true}
                enableMagnetism={true}
                clickEffect={true}
                spotlightRadius={260}
                particleCount={10}
                glowColor="155, 184, 225"
              />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
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
            </div>
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

        {/* Section 4: Testimonials */}
        <div className="section-wrapper">
          <SectionTestimonials />
        </div>

        {/* Section 5: Footer */}
        <div className="section-wrapper">
          <section className="section footer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '2rem', padding: '4rem 2rem 6rem' }}>
            <h3 className="footer__title" style={{ margin: 0, fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, color: '#ffffff' }}>
              We prioritize warm introductions
              <br />
              and ecosystem referrals
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', width: '100%' }}>
              <ul style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', listStyle: 'none', margin: 0, padding: 0 }}>
                <li>
                  <a href="https://t.me/cs_clay" target="_blank" rel="noopener noreferrer" onMouseEnter={playHover} className="cursor-target" style={{ color: '#9bb8e1', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>
                    Telegram (@cs_clay)
                  </a>
                </li>
                <li>
                  <a href="https://t.me/baxa_devops" target="_blank" rel="noopener noreferrer" onMouseEnter={playHover} className="cursor-target" style={{ color: '#9bb8e1', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>
                    Telegram (@baxa_devops)
                  </a>
                </li>
                <li>
                  <a href="https://t.me/shawn_isl" target="_blank" rel="noopener noreferrer" onMouseEnter={playHover} className="cursor-target" style={{ color: '#9bb8e1', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>
                    Telegram (@shawn_isl)
                  </a>
                </li>
                <li>
                  <a href="https://github.com/shahzodislomov/" target="_blank" rel="noopener noreferrer" onMouseEnter={playHover} className="cursor-target" style={{ color: '#9bb8e1', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>
                    GitHub (Shahzod)
                  </a>
                </li>
                <li>
                  <a href="https://github.com/abdullohqurbon0v" target="_blank" rel="noopener noreferrer" onMouseEnter={playHover} className="cursor-target" style={{ color: '#9bb8e1', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>
                    GitHub (Abdulloh)
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/in/shahzodislomov/" target="_blank" rel="noopener noreferrer" onMouseEnter={playHover} className="cursor-target" style={{ color: '#9bb8e1', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>
                    LinkedIn (Shahzod)
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/in/abdulloh-qurbonov-030bb7357/" target="_blank" rel="noopener noreferrer" onMouseEnter={playHover} className="cursor-target" style={{ color: '#9bb8e1', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>
                    LinkedIn (Abdulloh)
                  </a>
                </li>
              </ul>

              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, letterSpacing: '0.05em' }}>
                © ApexDevs 2026
              </div>
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
