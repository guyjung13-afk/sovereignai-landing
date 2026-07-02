import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import ScrambleText from "../components/ScrambleText";
import useReveal from "../hooks/useReveal";

const ManifestoPage = () => {
  useReveal();

  return (
    <>
      <div className="light-leak l1" />
      <div className="light-leak l2" />
      <div className="light-leak l3" />

      <Nav />

      <div className="manifesto-page">
        <div className="eyebrow-block section-eyebrow">
          <span className="eyebrow">Establishing Substrate v2.0</span>
        </div>
        <h1>
          <ScrambleText text="The Sovereign " />
          <span className="gold"><ScrambleText text="Manifesto" /></span>
        </h1>

        <section>
          <p className="noise-resolve">
            The prevailing architecture of artificial intelligence rests on a single,
            consequential error: the assumption that the engine of reasoning can be safely
            decoupled from the data it consumes and from the institutions that bear
            responsibility for both.
          </p>
          <p className="noise-resolve">
            This separation is not neutral. It is an architecture of extraction. Every
            inference routed through a remote endpoint, every context window transmitted
            to a vendor-controlled runtime, and every embedding persisted in an external
            vector store represents a surrender of authority. Exposure, dependency, and
            gradual dispossession are the operating logic of the cloud-native model.
          </p>
          <p className="noise-resolve" style={{ color: "#D4AF37", fontWeight: 600, letterSpacing: "0.02em" }}>
            SovereignAI rejects this logic outright.
          </p>
        </section>

        <section>
          <h3><ScrambleText text="Why We Exist" /></h3>
          <p className="noise-resolve">
            Critical decisions inside regulated, asset-heavy organizations are still made
            using fragile tools — not because people are careless, but because trust,
            authority, and accountability matter more than novelty. In these environments,
            decisions are irreversible. Mistakes are expensive. Software is not permitted
            to replace judgment.
          </p>
          <p className="noise-resolve">
            Legacy tools persist because they encode years of professional intuition and
            operational experience. SovereignAI was created to preserve these decision
            systems, not replace them — to make them durable, governable, replayable, and
            safer under modern operational complexity.
          </p>
        </section>

        <section>
          <h3><ScrambleText text="The Definition of Sovereignty" /></h3>
          <p className="noise-resolve">
            We are building the technical substrate for Department-Native Intelligence.
            This is intelligence whose models, retrieval indices, memory systems, and
            execution runtimes operate wholly inside the physical and jurisdictional
            perimeter of the organization.
          </p>
        </section>

        <section>
          <h3><ScrambleText text="What SovereignAI Is Not" /></h3>
          <p className="noise-resolve">
            We are deliberately not a general-purpose chatbot, an optimization engine, or
            a replacement for operators. We do not chase “alpha,” we do not bypass
            governance, and we never touch control systems. SovereignAI converts
            underutilized operational data into confidence-bounded truths that
            professionals can safely act upon.
          </p>
        </section>

        <section>
          <h3><ScrambleText text="The Stakes of Autonomy" /></h3>
          <p className="noise-resolve">
            For the energy operator, the manufacturer, or the professional services firm,
            the question is no longer whether advanced reasoning is available. It is
            whether that reasoning can be obtained without simultaneously surrendering
            the informational foundation upon which organizational autonomy rests.
          </p>
          <p className="noise-resolve">
            We are building a company that values trust over speed, depth over breadth,
            and longevity over valuation optics.
          </p>
        </section>

        <section style={{ textAlign: "center", paddingTop: 80 }}>
          <div className="noise-resolve" style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(24px, 3vw, 40px)", letterSpacing: "0.1em", fontWeight: 800, color: "#D4AF37", marginBottom: 40 }}>
            YOUR AI. YOUR DATA. YOUR PRIVACY.
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
            <Link to="/" className="btn btn-ghost" data-testid="manifesto-return-btn">
              <ArrowLeft size={14} />
              Return to Substrate
            </Link>
            <Link to="/#inquiry" className="btn" data-testid="manifesto-discovery-btn">
              Request Technical Discovery
              <ArrowRight size={14} className="arrow" />
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default ManifestoPage;
