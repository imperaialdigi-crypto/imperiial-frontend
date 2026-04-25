import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Smartphone, Zap, ArrowUpRight } from 'lucide-react';
import Footer from '../components/Footer';

/* ─────────────────────────────────────────────
   LOGO
───────────────────────────────────────────── */
const Logo = ({ size = 36, white = true, className = '' }) => (
  <img 
    src="/logo.png" 
    alt="Imperiial" 
    width={size} 
    height={size} 
    className={className}
    style={{ filter: white ? 'invert(1)' : 'none', objectFit: 'contain', display: 'block' }} 
  />
);

/* ─────────────────────────────────────────────
   CUSTOM CURSOR (Hidden on Mobile)
───────────────────────────────────────────── */
const Cursor = () => {
  const dot = useRef(null);
  const ring = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const rpos = useRef({ x: -100, y: -100 });
  
  useEffect(() => {
    if (window.innerWidth < 768) return;
    const move = (e) => { pos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', move);
    let raf;
    const loop = () => {
      rpos.current.x += (pos.current.x - rpos.current.x) * 0.11;
      rpos.current.y += (pos.current.y - rpos.current.y) * 0.11;
      if (dot.current) dot.current.style.transform = `translate(${pos.current.x - 3}px,${pos.current.y - 3}px)`;
      if (ring.current) ring.current.style.transform = `translate(${rpos.current.x - 18}px,${rpos.current.y - 18}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf); };
  }, []);
  
  return (
    <div className="hidden md:block">
      <div ref={dot} className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', willChange: 'transform' }} />
      <div ref={ring} className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.5)', willChange: 'transform' }} />
    </div>
  );
};

/* ─────────────────────────────────────────────
   SCROLL REVEAL
───────────────────────────────────────────── */
const useReveal = (threshold = 0.12) => {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, vis];
};

/* ─────────────────────────────────────────────
   SERVICE ROW
───────────────────────────────────────────── */
const ServiceRow = ({ num, title, desc, icon: Icon, index }) => {
  const [ref, vis] = useReveal(0.08);
  const [hov, setHov] = useState(false);
  return (
    <div ref={ref}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      className="relative border-b border-white/[0.07] overflow-hidden group"
      style={{
        opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(48px)',
        transition: `opacity 0.9s ease ${index * 0.1}s, transform 0.9s ease ${index * 0.1}s`,
      }}>
      {/* Fill */}
      <div className="absolute inset-0 bg-white pointer-events-none"
        style={{ transform: hov ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: 'left', transition: 'transform 0.65s cubic-bezier(0.16,1,0.3,1)' }} />
      <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4 md:gap-8 px-4 sm:px-6 md:px-16 py-8 md:py-12">
        
        <div className="flex items-center justify-between w-full md:w-auto">
           <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', letterSpacing: '0.4em', color: hov ? 'rgba(0,0,0,0.3)' : '#fff', minWidth: 48, transition: 'color 0.35s' }}>{num}</span>
           <div className="md:hidden" style={{ color: hov ? 'rgba(0,0,0,0.5)' : '#fff', transition: 'color 0.35s' }}>
             <ArrowUpRight size={20} />
           </div>
        </div>
        
        <h3 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 300, color: hov ? '#000' : '#fff', flex: 1, transition: 'color 0.35s', letterSpacing: '-0.01em', hyphens: 'none' }}>{title}</h3>
        
        <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: hov ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.8)', maxWidth: 420, lineHeight: 1.6, fontWeight: 300, transition: 'color 0.35s', hyphens: 'none' }}>{desc}</p>
        
        <div className="hidden md:block" style={{ color: hov ? 'rgba(0,0,0,0.4)' : '#fff', transition: 'color 0.35s, transform 0.5s', transform: hov ? 'rotate(12deg) scale(1.1)' : 'rotate(0) scale(1)' }}>
          <Icon size={28} strokeWidth={0.9} />
        </div>
        <div className="hidden md:block" style={{ color: hov ? 'rgba(0,0,0,0.5)' : '#fff', transition: 'color 0.35s, transform 0.4s', transform: hov ? 'translate(4px,-4px)' : 'translate(0,0)' }}>
          <ArrowUpRight size={20} />
        </div>

      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
const Landing = () => {
  const navigate = useNavigate();
  const [navScrolled, setNavScrolled] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const heroRef = useRef(null);

  useEffect(() => { const t = setTimeout(() => setLoaded(true), 80); return () => clearTimeout(t); }, []);
  useEffect(() => {
    const fn = () => setNavScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const onHeroMove = useCallback((e) => {
    if (!heroRef.current) return;
    const r = heroRef.current.getBoundingClientRect();
    setMouse({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
  }, []);

  const [servicesRef, servicesVis] = useReveal(0.1);

  const S = (delay, extra = {}) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? 'none' : 'translateY(28px)',
    transition: `opacity 1.1s ease ${delay}s, transform 1.1s ease ${delay}s`,
    ...extra,
  });

  return (
    <div style={{ background: '#050505', color: '#fff', overflowX: 'hidden', minHeight: '100vh', WebkitFontSmoothing: 'antialiased' }}>
      <Cursor />

      {/* Noise Texture */}
      <div className="fixed inset-0 pointer-events-none z-[60]" style={{ opacity: 0.04, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

      {/* ── NAV ───────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navScrolled ? 'py-3 md:py-4 px-4 md:px-12 bg-[#050505]/95 border-b border-white/5 backdrop-blur-md' : 'py-5 md:py-8 px-4 md:px-12 bg-transparent border-transparent'}`}>
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={24} white />
            <span style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '15px', letterSpacing: '0.35em', color: '#fff', textTransform: 'uppercase', fontWeight: 300 }}>Imperiial</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-12">
            {['Work', 'Process', 'Manifesto'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#fff', textDecoration: 'none', transition: 'color 0.3s' }}
                className="hover:opacity-70">{l}</a>
            ))}
          </div>

          <button onClick={() => navigate('/start')} className="group flex items-center gap-2 border border-white/[0.18] px-4 md:px-6 py-2 md:py-3 bg-transparent text-[#fff] font-mono text-[10px] md:text-[11px] tracking-[0.3em] md:tracking-[0.38em] uppercase transition-all duration-300 hover:bg-white hover:text-black hover:border-white">
            <span className="hidden sm:inline">Initialize</span> Project <ArrowUpRight size={12} />
          </button>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────── */}
      <section ref={heroRef} onMouseMove={onHeroMove} className="min-h-[90vh] md:min-h-screen flex flex-col relative overflow-hidden px-4 md:px-12 pt-32 md:pt-48 pb-12">

        {/* Parallax glow */}
        <div className="hidden md:block" style={{
          position: 'absolute', width: 900, height: 900, borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(255,255,255,0.035) 0%, transparent 65%)',
          left: `${mouse.x * 100}%`, top: `${mouse.y * 100}%`,
          transform: 'translate(-50%,-50%)',
          transition: 'left 1.5s cubic-bezier(0.16,1,0.3,1), top 1.5s cubic-bezier(0.16,1,0.3,1)',
        }} />

        {/* Content Container */}
        <div className="mt-auto mb-auto w-full max-w-[1600px] mx-auto relative z-10 flex flex-col">
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, ...S(0.1) }}>
             <div style={{ width: 32, height: 1, background: '#fff' }} />
             <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', letterSpacing: '0.3em', color: '#fff', textTransform: 'uppercase' }}>Digital Architecture</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Reduced minimum clamp size for mobile to prevent overflow */}
            <h1 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(42px, 12vw, 200px)', fontWeight: 300, lineHeight: 0.9, letterSpacing: '-0.02em', margin: 0, ...S(0.2) }}>
               IMPERIIAL
            </h1>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mt-6 md:mt-2">
              <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(28px, 6vw, 60px)', fontWeight: 300, lineHeight: 1.1, margin: 0, ...S(0.3) }}>
                Freelance Studio
              </h2>
              <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 'clamp(11px, 1.5vw, 13px)', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.7)', maxWidth: 380, lineHeight: 1.6, textTransform: 'uppercase', hyphens: 'none', ...S(0.4) }}>
                Minimalist software engineered for brands that refuse to compromise. No bloat. Just dominance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ──────────────────────────────── */}
      <section id="work" ref={servicesRef} className="pt-16 pb-32">
        <div className="max-w-[1600px] mx-auto border-t border-white/[0.07]">
          <ServiceRow 
            index={1} 
            num="01" 
            title="Web Ecosystems" 
            desc="Pristine web applications engineered for pure speed and aesthetic supremacy. We build digital assets that dominate search logic." 
            icon={Globe} 
          />
          <ServiceRow 
            index={2} 
            num="02" 
            title="Mobile Architecture" 
            desc="Native applications designed for seamless execution. We strip away the noise to deliver focused intuitive user experiences." 
            icon={Smartphone} 
          />
          <ServiceRow 
            index={3} 
            num="03" 
            title="Artificial Intelligence" 
            desc="Bespoke intelligence networks and automation workflows mapped to your exact business logic. Pure operational power." 
            icon={Zap} 
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
