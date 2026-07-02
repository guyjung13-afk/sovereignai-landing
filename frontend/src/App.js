import { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ManifestoPage from "./pages/ManifestoPage";
import ResonantField from "./components/ResonantField";
import useMomentumScroll from "./hooks/useMomentumScroll";

function App() {
  useMomentumScroll();

  useEffect(() => {
    document.title = "SovereignAI — Your AI. Your Data. Your Privacy.";
  }, []);

  return (
    <div className="App">
      <ResonantField />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/manifesto" element={<ManifestoPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
