import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Smartphone, Zap, Layout, Layers, ArrowUpRight } from 'lucide-react';
import Footer from '../components/Footer';

/* ─────────────────────────────────────────────
   LOGO
───────────────────────────────────────────── */
const Logo = ({ size = 36, white = true, className = '' }) => (
  <img src="/logo.png" alt="Imperiial" width={size} height={size} className={className}
    style={{ filter: white ? 'invert(1)' : 'none', objectFit: 'contain', display: 'block' }} />
);

/* ─────────────────────────────────────────────
   DECRYPT TEXT EFFECT
───────────────────────────────────────────── */
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$';
const DecryptText = ({ text, delay = 0, className = '' }) => {
  const [display, setDisplay] = useState(() =>
    text.split('').map(() => CHARS[Math.floor(Math.random() * CHARS.length)]).join('')
  );
  const [started, setStarted] = useState(false);
  
  useEffect(() => { 
    const t = setTimeout(() => setStarted(true), delay); 
    return () => clearTimeout(t); 
  }, [delay]);
  
  useEffect(() => {
    if (!started) return;
    let i = 0;
    const iv = setInterval(() => {
      setDisplay(text.split('').map((ch, idx) =>
        idx < i ? ch : CHARS[Math.floor(Math.random() * CHARS.length)]
      ).join(''));
      if (i >= text.length) clearInterval(iv);
      i += 0.4;
    }, 38);
    return () => clearInterval(iv);
  }, [started, text]);
  
  return <span className={className}>{display}</span>;
};

/* ─────────────────────────────────────────────
   CUSTOM CURSOR (Hidden on Mobile)
───────────────────────────────────────────── */
const Cursor = () => {
  const dot = useRef(null);
  const ring = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const rpos = useRef({ x: -100, y: -100 });
  
  useEffect(() => {
    if (window.innerWidth < 768) return; // Disable on mobile
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
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8 px-6 lg:px-16 py-10 lg:py-12">
        <div className="flex items-center justify-between w-full lg:w-auto">
           <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', letterSpacing: '0.4em', color: hov ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.18)', minWidth: 48, transition: 'color 0.35s' }}>{num}</span>
           <div className="lg:hidden" style={{ color: hov ? 'rgba(0,0,0,0.5)' : '#fff', transition: 'color 0.35s, transform 0.4s', transform: hov ? 'translate(4px,-4px)' : 'translate(0,0)' }}>
             <ArrowUpRight size={20} />
           </div>
        </div>
        <h3 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 300, color: hov ? '#000' : '#fff', flex: 1, transition: 'color 0.35s', letterSpacing: '-0.01em' }}>{title}</h3>
        
        <p style={{ fontSize: 'clamp(18px, 2vw, 22px)', color: hov ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.9)', maxWidth: 420, lineHeight: 1.7, fontWeight: 300, transition: 'color 0.35s' }}>{desc}</p>
        
        <div className="hidden lg:block" style={{ color: hov ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.15)', transition: 'color 0.35s, transform 0.5s', transform: hov ? 'rotate(12deg) scale(1.1)' : 'rotate(0) scale(1)' }}>
          <Icon size={28} strokeWidth={0.9} />
        </div>
        <div className="hidden lg:block" style={{ color: hov ? 'rgba(0,0,0,0.5)' : '#fff', transition: 'color 0.35s, transform 0.4s', transform: hov ? 'translate(4px,-4px)' : 'translate(0,0)' }}>
          <ArrowUpRight size={20} />
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   REVIEW CARD
───────────────────────────────────────────── */
const ReviewCard = ({ text, author, role, index }) => {
  const [ref, vis] = useReveal(0.1);
  return (
    <div ref={ref} className="border border-white/[0.07] p-8 md:p-10 flex flex-col justify-between group hover:border-white/20 transition-colors duration-500"
      style={{ background: 'rgba(255,255,255,0.018)', minHeight: 280, opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(50px)', transition: `all 0.8s ease ${index * 0.15}s` }}>
      <p style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(24px, 3vw, 28px)', fontWeight: 300, color: 'rgba(255,255,255,0.95)', lineHeight: 1.65, fontStyle: 'italic' }}
        className="group-hover:text-white transition-colors duration-500 mb-8">"{text}"</p>
      <div className="flex items-center gap-4 pt-6 border-t border-white/[0.06]">
        <div style={{ width: 34, height: 34, border: '1px solid rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"IBM Plex Mono", monospace', fontSize: '13px', color: '#fff' }}>{author[0]}</div>
        <div>
          <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#fff' }}>{author}</p>
          <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>{role}</p>
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

  const [mRef, mVis] = useReveal(0.18);
  const [pRef, pVis] = useReveal(0.12);

  const S = (delay, extra = {}) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? 'none' : 'translateY(28px)',
    transition: `opacity 1.1s ease ${delay}s, transform 1.1s ease ${delay}s`,
    ...extra,
  });

  return (
    <div style={{ background: '#050505', color: '#fff', overflowX: 'hidden', minHeight: '100vh' }}>
      <Cursor />

      {/* Noise */}
      <div className="fixed inset-0 pointer-events-none z-[60]" style={{ opacity: 0.04, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

      {/* ── NAV ───────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navScrolled ? 'py-3 md:py-4 px-6 md:px-12 bg-[#050505]/95 border-b border-white/5 backdrop-blur-md' : 'py-6 md:py-8 px-6 md:px-12 bg-transparent border-transparent'}`}>
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={28} white />
            <span style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '16px', letterSpacing: '0.35em', color: '#fff', textTransform: 'uppercase', fontWeight: 300 }}>Imperiial</span>
          </div>
          <div className="hidden md:flex items-center gap-12">
            {['Work', 'Process', 'Manifesto'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.3s' }}
                onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.4)'}>{l}</a>
            ))}
          </div>
          <button onClick={() => navigate('/start')} className="group hidden sm:flex items-center gap-2 border border-white/[0.18] px-6 py-3 bg-transparent text-white/80 font-mono text-[11px] tracking-[0.38em] uppercase transition-all duration-300 hover:bg-white hover:text-black hover:border-white">
            Start Project <ArrowUpRight size={12} />
          </button>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────── */}
      <section ref={heroRef} onMouseMove={onHeroMove} className="min-h-screen flex flex-col relative overflow-hidden px-6 md:px-12 pt-24 pb-8 md:pb-12">

        {/* Parallax glow */}
        <div className="hidden md:block" style={{
          position: 'absolute', width: 900, height: 900, borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(255,255,255,0.035) 0%, transparent 65%)',
          left: `${mouse.x * 100}%`, top: `${mouse.y * 100}%`,
          transform: 'translate(-50%,-50%)',
          transition: 'left 1.5s cubic-bezier(0.16,1,0.3,1), top 1.5s cubic-bezier(0.16,1,0.3,1)',
        }} />

        {/* Fine grid */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.03, backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '120px 120px' }} />

        {/* Content pushed up via auto margins */}
        <div className="my-auto w-full relative z-10">
          
          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, ...S(0.15) }}>
            <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', letterSpacing: '0.4em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Digital Architecture</span>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.4)', animation: 'pulse 2s ease infinite' }} />
          </div>

          {/* GIANT TITLE & SUBTITLE STACK - Fade in animation */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(64px, 14vw, 220px)', fontWeight: 300, lineHeight: 0.8, letterSpacing: '-0.02em', margin: 0, ...S(0.2) }}>
              IMPERIIAL
            </h1>
            
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mt-4 lg:mt-2">
              <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(40px, 9vw, 130px)', fontWeight: 300, lineHeight: 0.8, letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.25)', margin: 0, ...S(0.4) }}>
                FREELANCE STUDIO
              </h2>
              
              <div style={{ maxWidth: 380, textAlign: 'right', ...S(0.6) }} className="hidden lg:block pb-2">
                <p style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 300, color: 'rgba(255,255,255,0.9)', fontStyle: 'italic', lineHeight: 1.45 }}>
                  Minimalist software for brands that refuse to compromise.
                </p>
              </div>
            </div>
          </div>
          
        </div>

        {/* Bottom bar with Circular scroll indicator and Button */}
        <div className="w-full relative flex flex-col md:flex-row items-center justify-between gap-6 mt-12 pt-8 border-t border-white/[0.07]" style={S(0.7)}>
          
          {/* Mobile tagline */}
          <div className="md:hidden w-full text-center mb-2">
            <p style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '26px', fontWeight: 300, color: 'rgba(255,255,255,0.9)', fontStyle: 'italic', lineHeight: 1.5 }}>
              Minimalist software for brands that refuse to compromise.
            </p>
          </div>

          {/* Circle Indicator (Desktop only) */}
          <div className="hidden md:flex absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/[0.15] bg-[#050505] items-center justify-center z-10">
            <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
          </div>

          {/* Spacer to push button right on desktop */}
          <div className="hidden md:block flex-1"></div>

          {/* Action Button */}
          <div className="w-full md:w-auto flex-shrink-0 z-10">
            <button onClick={() => navigate('/start')} 
              className="w-full md:w-auto flex justify-center items-center gap-3 bg-white text-black px-10 py-5 hover:bg-white/90 transition-colors duration-300"
              style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', letterSpacing: '0.42em', textTransform: 'uppercase', border: 'none' }}>
              Initialize Project <ArrowUpRight size={14} />
            </button>
          </div>
          
        </div>
      </section>

      {/* ── TICKER ───────────────────────────────── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '18px 0', overflow: 'hidden', background: 'rgba(255,255,255,0.012)' }}>
        <div style={{ display: 'inline-flex', gap: 80, animation: 'ticker 40s linear infinite', whiteSpace: 'nowrap' }}>
          {Array(14).fill(null).map((_, i) => (
            <span key={i} style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', letterSpacing: '0.55em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', flexShrink: 0 }}>
              {i % 2 === 0 ? 'Imperiial Digital Architecture' : '·'}
            </span>
          ))}
        </div>
      </div>

      {/* ── CAPABILITIES ─────────────────────────── */}
      <section id="work" className="pt-20 md:pt-32">
        <div className="px-6 md:px-12 mb-12 max-w-[1600px] mx-auto">
          <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', letterSpacing: '0.55em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 20 }}>What We Build</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(44px, 6.5vw, 88px)', fontWeight: 300, lineHeight: 0.95, letterSpacing: '-0.025em', margin: 0 }}>Capabilities.</h2>
            <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.2)' }}>05 SERVICES</span>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          {[
            { num: '01', title: 'Web Architecture', desc: 'High-performance React & Next.js platforms built for SEO dominance, load speed obsession, and scale.', icon: Globe },
            { num: '02', title: 'Mobile Ecosystems', desc: 'Native iOS and Android. Seamless, responsive experiences built for the modern consumer.', icon: Smartphone },
            { num: '03', title: 'Artificial Intelligence', desc: 'Custom LLM agents and automation workflows that optimize your entire business operation.', icon: Zap },
            { num: '04', title: 'Bespoke Software', desc: 'Tailor-made solutions designed for your unique business logic. No templates. No shortcuts.', icon: Layers },
            { num: '05', title: 'Product Design', desc: 'UI/UX that combines aesthetic purity with conversion-optimized user flows. Beauty is function.', icon: Layout },
          ].map((item, i) => <ServiceRow key={item.num} {...item} index={i} />)}
        </div>
      </section>

      {/* ── PROCESS ──────────────────────────────── */}
      <section id="process" ref={pRef} className="px-6 md:px-12 py-24 md:py-32 mt-12 md:mt-24 border-t border-white/[0.06]">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/[0.06] pb-10 mb-16 md:mb-20 gap-4">
            <div>
              <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', letterSpacing: '0.55em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 16 }}>How We Operate</p>
              <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(44px, 6.5vw, 88px)', fontWeight: 300, lineHeight: 0.95, letterSpacing: '-0.025em', margin: 0 }}>Process.</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 border border-white/[0.07]">
            {[
              { n: '01', t: 'Discovery & Blueprint', b: 'We analyze your business logic, identify constraints, and architect a scalable roadmap — before a single line of code is written.' },
              { n: '02', t: 'Sovereign Development', b: 'Rapid, transparent engineering sprints. Secure builds, live staging, and obsessive precision throughout the entire lifecycle.' },
              { n: '03', t: 'Deployment & Ascension', b: "Rigorous testing, flawless deployment, and post-launch infrastructure support. Your digital asset doesn't just launch — it dominates." },
            ].map(({ n, t, b }, i) => (
              <div key={n}
                className="p-8 md:p-12"
                style={{ borderRight: i < 2 ? '1px solid rgba(255,255,255,0.07)' : 'none', position: 'relative', opacity: pVis ? 1 : 0, transform: pVis ? 'none' : 'translateY(40px)', transition: `all 0.85s ease ${i * 0.15}s`, background: 'rgba(255,255,255,0)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0)'}>
                <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', letterSpacing: '0.45em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 36 }}>{n}</div>
                <h3 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '30px', fontWeight: 300, color: 'rgba(255,255,255,0.95)', marginBottom: 20, lineHeight: 1.15 }}>{t}</h3>
                <p style={{ fontSize: 'clamp(18px, 2vw, 22px)', color: 'rgba(255,255,255,0.9)', lineHeight: 1.85, fontWeight: 300 }}>{b}</p>
                <div className="hidden md:block absolute bottom-0 left-0 h-[2px] bg-white/[0.35] w-0 transition-all duration-700 ease-out"
                  onMouseEnter={e => e.currentTarget.style.width = '100%'} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MANIFESTO ────────────────────────────── */}
      <section id="manifesto" ref={mRef} className="px-6 md:px-12 py-24 md:py-36 border-t border-white/[0.06] relative overflow-hidden">
        
        {/* Transparent Logo Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.025] z-0">
          <Logo size={700} white />
        </div>

        <div className="max-w-[1000px] mx-auto text-center relative z-10">
          <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', letterSpacing: '0.6em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 48, opacity: mVis ? 1 : 0, transition: 'opacity 1s ease' }}>Our Manifesto</p>

          <blockquote style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 300, lineHeight: 1.22, fontStyle: 'italic', color: 'rgba(255,255,255,0.95)', marginBottom: 48, opacity: mVis ? 1 : 0, transform: mVis ? 'none' : 'translateY(30px)', transition: 'all 1s ease 0.2s' }}>
            "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away."
          </blockquote>

          <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', gap: 24, marginBottom: 48, opacity: mVis ? 1 : 0, transition: 'opacity 1s ease 0.5s', width: '100%', justifyContent: 'center' }}>
            <div style={{ height: 1, width: 60, background: 'rgba(255,255,255,0.15)' }} />
            <Logo size={20} white />
            <div style={{ height: 1, width: 60, background: 'rgba(255,255,255,0.15)' }} />
          </div>

          <p style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 300, color: 'rgba(255,255,255,0.9)', lineHeight: 1.9, maxWidth: 800, margin: '0 auto', opacity: mVis ? 1 : 0, transition: 'opacity 1s ease 0.65s' }}>
            We believe the internet is bloated. Slow load times, messy codebases, and chaotic design are liabilities.
            Imperiial strips away the noise — architecting digital assets that are fast, secure, and beautiful.
          </p>

          <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '13px', letterSpacing: '0.45em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', marginTop: 48, opacity: mVis ? 1 : 0, transition: 'opacity 1s ease 0.85s' }}>
            No bloat. Just dominance.
          </p>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────── */}
      <section className="px-6 md:px-12 py-24 md:py-32 border-t border-white/[0.06]">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-16">
            <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', letterSpacing: '0.55em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 20 }}>Testimonials</p>
            <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(40px, 6vw, 80px)', fontWeight: 300, lineHeight: 0.95, letterSpacing: '-0.025em', margin: 0 }}>Client Voices.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ReviewCard index={0} text="Imperiial transformed our disjointed tools into a single, cohesive operating system. The result was far beyond what we imagined possible." author="Arpit Ingle" />
            <ReviewCard index={1} text="Minimalist, fast, and incredibly stable. They don't just write code — they architect digital assets with a completely different caliber of precision." author="Samarth Thakur" />
            <ReviewCard index={2} text="The AI integration they built saved us 40 hours per week. ROI was visible within the first month. Truly exceptional." author="Shubham Agarwal" />
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────── */}
      <section className="px-6 md:px-12 py-32 md:py-40 border-t border-white/[0.06] relative overflow-hidden">
        
        {/* Transparent Logo Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.025] z-0">
          <Logo size={800} white />
        </div>
        <div className="absolute inset-0 pointer-events-none opacity-[0.025] z-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '120px 120px' }} />

        <div className="max-w-[900px] mx-auto text-center relative z-10">
          <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', letterSpacing: '0.6em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 40 }}>Open for new partnerships</p>
          <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(50px, 10vw, 136px)', fontWeight: 300, lineHeight: 0.88, letterSpacing: '-0.035em', marginBottom: 64, color: '#fff' }}>
            Ready to define<br />your legacy?
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <button onClick={() => navigate('/start')} className="w-full sm:w-auto justify-center"
              style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#fff', color: '#000', border: 'none', padding: '22px 56px', fontFamily: '"IBM Plex Mono", monospace', fontSize: '12px', letterSpacing: '0.42em', textTransform: 'uppercase', boxShadow: '0 0 120px rgba(255,255,255,0.1)', transition: 'background 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.88)'}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
              Start Project <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;