import React, { useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import SignInPage from "./SignInPage";
import RaceXtreme from "./RaceXtreme";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Modification from "./pages/Modification";
import ColorPalettes from "./pages/ColorPalettes";
import Contact from "./pages/Contact";
import DragRace from "./pages/DragRace";
import Compare from "./pages/Compare";
import Leaderboard from "./pages/Leaderboard";
import Garage from "./pages/Garage";
import AIAgent from "./components/AIAgent";
import CinematicLoader from "./components/CinematicLoader";
import { ToastProvider } from "./components/ToastSystem";

function App() {
  const [showLoader, setShowLoader] = useState(true);

  const handleLoaderComplete = useCallback(() => {
    setShowLoader(false);
  }, []);

  return (
    <Router>
      <ToastProvider>
        <div className="App">
          {showLoader && <CinematicLoader onComplete={handleLoaderComplete} />}
          <AIAgent />
          <Routes>
            <Route path="/" element={<SignInPage />} />
            <Route path="/signup" element={<LoginPage />} />
            <Route path="/home" element={<RaceXtreme />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/modification" element={<Modification />} />
            <Route path="/colors" element={<ColorPalettes />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/race" element={<DragRace />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/garage" element={<Garage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </ToastProvider>
    </Router>
  );
}

export default App;