import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import SignInPage from "./SignInPage";
import RaceXtreme from "./RaceXtreme";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Modification from "./pages/Modification";
import ColorPalettes from "./pages/ColorPalettes";
import Contact from "./pages/Contact";
import AIAgent from "./components/AIAgent";

function App() {
  return (
    <Router>
      <div className="App">
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;