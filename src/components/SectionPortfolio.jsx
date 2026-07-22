import React from 'react';
import { useAudio } from './AudioController';
import LogoLoop from './LogoLoop';
import CardSwap, { Card } from './CardSwap';
import {
  SiGithub,
  SiReact,
  SiNextdotjs,
  SiPhp,
  SiLaravel,
  SiNodedotjs,
  SiTypescript,
  SiPython,
  SiTailwindcss,
  SiPostgresql,
  SiDocker
} from 'react-icons/si';

const techLogos = [
  { node: <><SiGithub size={26} /> GitHub</>, title: "GitHub", href: "https://github.com" },
  { node: <><SiReact size={26} color="#61DAFB" /> React</>, title: "React", href: "https://react.dev" },
  { node: <><SiNextdotjs size={26} /> Next.js</>, title: "Next.js", href: "https://nextjs.org" },
  { node: <><SiPhp size={26} color="#777BB4" /> PHP</>, title: "PHP", href: "https://www.php.net" },
  { node: <><SiLaravel size={26} color="#FF2D20" /> Laravel</>, title: "Laravel", href: "https://laravel.com" },
  { node: <><SiNodedotjs size={26} color="#5FA04E" /> Node.js</>, title: "Node.js", href: "https://nodejs.org" },
  { node: <><SiTypescript size={26} color="#3178C6" /> TypeScript</>, title: "TypeScript", href: "https://www.typescriptlang.org" },
  { node: <><SiPython size={26} color="#3776AB" /> Python</>, title: "Python", href: "https://www.python.org" },
  { node: <><SiTailwindcss size={26} color="#06B6D4" /> Tailwind CSS</>, title: "Tailwind CSS", href: "https://tailwindcss.com" },
  { node: <><SiPostgresql size={26} color="#4169E1" /> PostgreSQL</>, title: "PostgreSQL", href: "https://www.postgresql.org" },
  { node: <><SiDocker size={26} color="#2496ED" /> Docker</>, title: "Docker", href: "https://www.docker.com" }
];

const caseStudies = [
  {
    name: "Resume Maker",
    logo: "/images/sanity/logo.svg",
    website: "https://resume-maker-lac-nine.vercel.app",
    problem: "Job seekers struggled with complex formatting tools & non-ATS compliant templates.",
    solution: "Built a real-time reactive drag-and-drop resume builder with instant PDF export & ATS validation.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "PDF Engine"],
    results: "99% ATS pass rate, sub-100ms render speeds & instant PDF exports."
  },
  {
    name: "Hire Platform",
    logo: "/images/sanity/logo.svg",
    website: "https://hire-beryl.vercel.app/",
    problem: "Recruitment platforms lacked automated developer skill matching & instant talent screening.",
    solution: "Created an end-to-end recruitment platform matching engineering talent with tech teams.",
    technologies: ["Next.js", "Node.js", "PostgreSQL", "Tailwind CSS"],
    results: "Reduced hiring friction by 60% with instant candidate matching workflows."
  },
  {
    name: "Dele App",
    logo: "/images/sanity/logo.svg",
    website: "https://dele-to.vercel.app/",
    problem: "Teams needed a lightweight, high-speed task management suite without heavy enterprise bloat.",
    solution: "Designed a minimal, real-time collaborative task manager with keyboard shortcuts & reactive UI.",
    technologies: ["React", "State Management", "Framer Motion", "CSS3"],
    results: "3x faster task creation speed & 100% offline-first state sync."
  },
  {
    name: "YouTube Clone",
    logo: "/images/sanity/logo.svg",
    website: "https://youtube-clone-gilt-two.vercel.app/",
    problem: "High-scale video streaming, infinite feed pagination & responsive player state management.",
    solution: "Engineered a video streaming web client integrated with YouTube Data API & custom player.",
    technologies: ["React", "Rapid API", "CSS Grid", "HTML5 Video"],
    results: "Smooth 60fps video playback & zero UI layout shifts."
  },
  {
    name: "Learniverse",
    logo: "/images/sanity/logo.svg",
    website: "https://learniverse-amber.vercel.app/",
    problem: "Traditional online learning systems lack adaptive AI paths & interactive engagement.",
    solution: "Developed an AI-enhanced learning platform with structured progress paths & quizzes.",
    technologies: ["Next.js", "AI Integration", "Tailwind CSS", "REST API"],
    results: "Enhanced student completion rates by 45% with interactive feedback."
  }
];

const SectionPortfolio = () => {
  const { playClick, playHover } = useAudio();

  return (
    <section className="section portfolio grid">
      <div className="section-title">
        <span className="section-title__id">//02</span>
        <span>Case Studies & Projects</span>
      </div>

      <h2 className="home-portfolio__title">
        Featured
        <br />
        Case Studies
        <br />
        & Products
      </h2>

      <div className="home-portfolio__slider-container" style={{ position: 'relative', minHeight: '450px', overflow: 'visible' }}>
        <CardSwap
          width={490}
          height={380}
          cardDistance={50}
          verticalDistance={65}
          delay={5000}
          pauseOnHover={true}
          skewAmount={3}
          easing="elastic"
        >
          {caseStudies.map((comp) => (
            <Card key={comp.name} customClass="cursor-target" onMouseEnter={playHover}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                  {comp.name}
                </span>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#9bb8e1', letterSpacing: '0.12em', fontWeight: 700, background: 'rgba(155, 184, 225, 0.15)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                  Case Study
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.78rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: '#9bb8e1' }}>Problem:</strong> {comp.problem}
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: '#9bb8e1' }}>Solution:</strong> {comp.solution}
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: '#9bb8e1' }}>Technologies:</strong> {comp.technologies.join(' • ')}
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: '#38bdf8' }}>Results:</strong> {comp.results}
                </p>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '0.6rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <a
                  href={comp.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={playClick}
                  className="btn btn--small cursor-target"
                  style={{ minWidth: '10rem' }}
                >
                  <span className="btn__wrapper oh">
                    <span className="btn__label">View Case Study →</span>
                  </span>
                </a>
              </div>
            </Card>
          ))}
        </CardSwap>
      </div>

      {/* Marquee Loop for Tech Stack & Developer Tools */}
      <div style={{ gridColumn: '1 / -1', marginTop: '3.5rem' }}>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.2rem', fontWeight: 700 }}>
          Technologies & Development Stack
        </p>
        <LogoLoop
          logos={techLogos}
          speed={90}
          direction="left"
          logoHeight={30}
          gap={52}
          scaleOnHover
          fadeOut
          fadeOutColor="#000209"
        />
      </div>
    </section>
  );
};

export default SectionPortfolio;
