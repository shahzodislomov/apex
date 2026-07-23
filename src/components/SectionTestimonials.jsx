import React from 'react';
import { useAudio } from './AudioController';
import LogoLoop from './LogoLoop';

const testimonials = [
  {
    quote: "They understood exactly what we wanted from day one. High-speed execution, rock-solid security, and an unforgettable user interface."
  },
  {
    quote: "The team at ApexDevs shipped our full-stack web and mobile application weeks ahead of schedule. Truly elite engineering capabilities."
  },
  {
    quote: "Exceptional attention to detail, WebGL animations, and seamless DevOps automation. Working with them was an absolute pleasure."
  },
  {
    quote: "ApexDevs transformed our raw prototype into a scalable enterprise application. Highly recommended for any serious tech venture."
  }
];

const testimonialNodes = testimonials.map((t, idx) => ({
  node: (
    <div
      key={idx}
      style={{
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        border: '1px solid rgba(155, 184, 225, 0.2)',
        borderRadius: '16px',
        padding: '1.2rem 1.4rem',
        width: 'clamp(270px, 80vw, 380px)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between',
        gap: '1rem',
        boxSizing: 'border-box'
      }}
    >
      <p style={{ fontSize: '0.92rem', color: '#cbd5e1', fontStyle: 'italic', lineHeight: 1.5, margin: 0 }}>
        "{t.quote}"
      </p>
      <div>
      </div>
    </div>
  ),
  title: t.author,
  href: '#'
}));

const SectionTestimonials = () => {
  return (
    <section className="section testimonials grid" style={{ marginTop: '4rem' }}>
      <div className="section-title">
        <span className="section-title__id">//04</span>
        <span>Testimonials & Endorsements</span>
      </div>

      <div style={{ gridColumn: '1 / -1', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 800, color: '#ffffff', margin: 0 }}>
          What collaborators say
        </h2>
      </div>

      <div style={{ gridColumn: '1 / -1', width: '100%', overflow: 'hidden' }}>
        <LogoLoop
          logos={testimonialNodes}
          speed={60}
          direction="left"
          gap={30}
          scaleOnHover
          fadeOut
          fadeOutColor="#000209"
        />
      </div>
    </section>
  );
};

export default SectionTestimonials;
