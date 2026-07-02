import React from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Hero from "../components/landing/Hero";
import Substrate from "../components/landing/Substrate";
import Architecture from "../components/landing/Architecture";
import Verticals from "../components/landing/Verticals";
import Validation from "../components/landing/Validation";
import HardwareGrid from "../components/landing/HardwareGrid";
import Doctrine from "../components/landing/Doctrine";
import BriefingTerminal from "../components/landing/BriefingTerminal";
import useReveal from "../hooks/useReveal";
import useParallax from "../hooks/useParallax";

const LandingPage = () => {
  useReveal();
  useParallax();

  return (
    <>
      <div className="light-leak l1" />
      <div className="light-leak l2" />
      <div className="light-leak l3" />
      <Nav />
      <Hero />
      <Substrate />
      <Architecture />
      <Verticals />
      <Validation />
      <HardwareGrid />
      <Doctrine />
      <BriefingTerminal />
      <Footer />
    </>
  );
};

export default LandingPage;
