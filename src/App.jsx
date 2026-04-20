import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import ProjectForm from './pages/ProjectForm';

// --- Imperial Atmosphere Component ---
const ImperialBackground = () => (
  <div className="fixed inset-0 -z-50 overflow-hidden bg-imperial-black">
    
    {/* 1. The Grid (Very subtle, barely visible) */}
    <div 
      className="absolute inset-0 opacity-[0.03]"
      style={{ 
        backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', 
        backgroundSize: '60px 60px' 
      }}
    ></div>

    {/* 2. The Golden Fog (Luxury Lighting) */}
    <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-imperial-gold/5 rounded-full blur-[120px] animate-pulse-gold"></div>
    <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-imperial-stone/20 rounded-full blur-[100px]"></div>
    
  </div>
);

const Layout = ({ children }) => (
  <div className="relative min-h-screen font-sans text-imperial-white selection:bg-imperial-gold selection:text-imperial-black">
    <ImperialBackground />
    {/* Noise Texture for Film Grain feel */}
    <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    
    <div className="relative z-10">
      {children}
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/start" element={<ProjectForm />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;