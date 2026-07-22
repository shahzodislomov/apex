import React, { useState, useEffect } from 'react';
import { useAudio } from './AudioController';
import Portrait3D from './Portrait3D';

const teamMembers = [
  {
    name: "Dara Campbell",
    position: "Managing Partner",
    portrait: "https://picsum.photos/400/400?random=1",
    depthMap: "/images/sanity/9a10c8de53e038349a3b8d27f81d580590adcf28-1024x1024.webp",
    normalMap: "/images/sanity/72d67cec28cba9214e0ca7978bf50bafd4e41966-1024x1024.webp"
  },
  {
    name: "Will Patterson",
    position: "Head of Venture",
    portrait: "https://picsum.photos/400/400?random=2",
    depthMap: "/images/sanity/b67ab460249ef0f17a231d4c339fb1fd08bc9922-1024x1024.webp",
    normalMap: "/images/sanity/d96533ae3f2e0ac61cd49878394d8246a1037494-1024x1024.webp"
  },
  {
    name: "Arjun Chirumamilla",
    position: "Principal",
    portrait: "https://picsum.photos/400/400?random=3",
    depthMap: "/images/sanity/36db9bbcbb12f5894ca01b48f7dd99e37583d6c7-1024x1024.webp",
    normalMap: "/images/sanity/406c3bb1d58aeead1be2bb2091d87ea12a6fd963-1024x1024.webp"
  },
  {
    name: "Jeff Sun",
    position: "Venture Capital Analyst",
    portrait: "https://picsum.photos/400/400?random=4",
    depthMap: "/images/sanity/e9e938305b3cb9af93095e7fba83422f69fcb54e-1024x1024.webp",
    normalMap: "/images/sanity/f47b948f9f89a0e86ae148c5bd814ab1e7e48178-1024x1024.webp"
  },
  {
    name: "Tracie Hutchins",
    position: "Executive Operations Manager",
    portrait: "https://picsum.photos/400/400?random=5",
    depthMap: "/images/sanity/98ea97a34fe729fdc9e2537d0379e1ddaf4b9e34-1024x1024.webp",
    normalMap: "/images/sanity/ca065b099b55b1b3eb70bc3486856e0cc06b3640-1024x1024.webp"
  },
  {
    name: "Stefan Deiss",
    position: "Co-Founder",
    portrait: "https://picsum.photos/400/400?random=6",
    depthMap: "/images/sanity/aba29d88540b0a5181a65236c8a1cfc18f9dd4bd-1024x1024.webp",
    normalMap: "/images/sanity/5595960e2df8246c2f993ae2042373b601fbb6ab-1024x1024.webp"
  },
  {
    name: "Kamal Youssefi",
    position: "Co-Founder & Executive Chairman",
    portrait: "https://picsum.photos/400/400?random=7",
    depthMap: "/images/sanity/e9e2edab7a4bffa7dff8df6ffecaaf4cbe9443bd-1024x1024.webp",
    normalMap: "/images/sanity/88cb6e510410fa4187b5077c3a1d5d85dcd377c3-1024x1024.webp"
  }
];

const SectionTeam = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { playHover, playFaceMorph } = useAudio();

  const handleMouseMove = (e) => {
    // Keep the portrait offset slightly from the cursor
    setMousePos({ x: e.clientX + 30, y: e.clientY + 30 });
  };

  const handleRowMouseEnter = (index) => {
    playHover();
    playFaceMorph();
    setHoveredIndex(index);
  };

  const handleRowMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <section className="section team grid" onMouseMove={handleMouseMove}>
      <div className="section-title">
        <span className="section-title__id">//03</span>
        <span>Team</span>
      </div>

      <div className="home-team__wrapper">
        <h2 className="home-team__title">
          Experience
          <br />
          you can build on
        </h2>
        <p className="body-copy">
          No career investors. No tourists. We've been the founder who couldn't sleep. The operator who scaled through chaos. Every person on this team carries real reps across VC, Blockchain, Web3, Investment Banking, and Enterprise.
        </p>
      </div>

      <div className="home-team__members-container">
        {teamMembers.map((member, index) => (
          <div
            key={member.name}
            className="team-member-row cursor-target"
            onMouseEnter={() => handleRowMouseEnter(index)}
            onMouseLeave={handleRowMouseLeave}
          >
            <div className="team-member-info">
              <span className="team-member-name">{member.name}</span>
              <span className="team-member-position">{member.position}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Floating 3D Portrait Tooltip */}
      {teamMembers.map((member, index) => (
        <div
          key={`portrait-${member.name}`}
          className={`floating-portrait ${hoveredIndex === index ? 'visible' : ''}`}
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
            position: 'fixed',
            transform: hoveredIndex === index ? 'translate(0%, 0%) scale(1)' : 'translate(0%, 0%) scale(0.8)',
          }}
        >
          <Portrait3D
            imageSrc={member.portrait}
            depthMapSrc={member.depthMap}
            normalMapSrc={member.normalMap}
            active={hoveredIndex === index}
          />
        </div>
      ))}
    </section>
  );
};

export default SectionTeam;
