import { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ManifestoPage from "./pages/ManifestoPage";

function App() {
  useEffect(() => {
    document.title = "SovereignAI — Your AI. Your Data. Your Privacy.";
  }, []);

  return (
    <div className="App">
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
