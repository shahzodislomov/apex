import React, { useState } from 'react';
import { useAudio } from './AudioController';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const companies = [
  {
    name: "Debyt",
    logo: "/images/sanity/8f409b899eda0a6598e1f59042a10bb28ffc3a6f.svg",
    website: "https://www.debyt.xyz/",
    description: "Debyt is building the infrastructure for the next generation of debit card accounts, unlocking stablecoin-powered banking globally. They are developing the stablecoin orchestration layer and card-issuing rails required for broad consumer adoption by retrofitting stablecoins directly into today’s card processors, sponsor banks and large-scale card issuing programs."
  },
  {
    name: "Rava",
    logo: "/images/sanity/bbe762805f8a8f30923897ce054a1805b19f72ae.svg",
    website: "https://www.rava.money",
    description: "Rava aims to be the clearing house and settlement engine for tokenized assets and RWAs by solving a critical market gap: the $30B+ in tokenized assets that sit idle due to a lack of guaranteed pricing and settlement infrastructure. Rava offers institutional-grade custody, asset pricing models, and instant atomic settlement networks."
  },
  {
    name: "100s",
    logo: "/images/sanity/4bfda0b43330ee9caf21baa5dbb67c0a2116a383.svg",
    website: "",
    description: "100s is an AI-native consumer discovery protocol deconstructing search algorithms into cooperative incentivized graph networks. It enables users to browse, search, and catalog digital goods and content with absolute data ownership and AI-orchestrated micro-rewards."
  },
  {
    name: "Bloxtel",
    logo: "/images/sanity/8cabc54021e8a76831d69a208c8b50042ba3b37c.svg",
    website: "https://bloxtel.com/",
    description: "Bloxtel is a decentralized telecom network infrastructure scaling secure, high-density cellular and IoT bandwidth. They are building peer-to-peer 5G cells, eSIM orchestration protocols, and automated resource settlement ledgers that allow property owners and businesses to act as localized cellular operators."
  }
];

const SectionPortfolio = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { playClick, playHover } = useAudio();

  const handlePrev = () => {
    playClick();
    setActiveIndex((prev) => (prev === 0 ? companies.length - 1 : prev - 1));
  };

  const handleNext = () => {
    playClick();
    setActiveIndex((prev) => (prev === companies.length - 1 ? 0 : prev + 1));
  };

  const currentComp = companies[activeIndex];

  return (
    <section className="section portfolio grid">
      <div className="section-title">
        <span className="section-title__id">//02</span>
        <span>Portfolio</span>
      </div>

      <h2 className="home-portfolio__title">
        Early access
        <br />
        permanent
        <br />
        advantage
      </h2>

      <div className="home-portfolio__slider-container">
        <div className="portfolio-company" key={currentComp.name}>
          <img
            src={currentComp.logo}
            alt={`${currentComp.name} Logo`}
            className="portfolio-company__logo"
          />
          <p className="body-copy">
            {currentComp.description}
          </p>
          
          <div className="portfolio-company__nav">
            <button
              onClick={handlePrev}
              onMouseEnter={playHover}
              className="nav-btn cursor-target"
              aria-label="Previous company"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={handleNext}
              onMouseEnter={playHover}
              className="nav-btn cursor-target"
              aria-label="Next company"
            >
              <ArrowRight size={16} />
            </button>

            {currentComp.website && (
              <a
                href={currentComp.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={playClick}
                onMouseEnter={playHover}
                className="btn btn--small cursor-target"
                style={{ marginLeft: 'auto', minWidth: '12rem' }}
              >
                <span className="btn__wrapper oh">
                  <span className="btn__label">Visit Website</span>
                </span>
                <span className="btn__shimmer">
                  <span className="btn__shimmer-inner" />
                </span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionPortfolio;
