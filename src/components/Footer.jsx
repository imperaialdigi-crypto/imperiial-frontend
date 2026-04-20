import React from 'react';
import { ArrowUpRight, ArrowUp } from 'lucide-react';

const Logo = ({ size = 32, white = true }) => (
  <img src="/logo.png" alt="Imperiial" width={size} height={size}
    style={{ filter: white ? 'invert(1)' : 'none', objectFit: 'contain', display: 'block' }} />
);

const Footer = () => {
  return (
    <footer className="bg-[#050505] border-t border-white/[0.06] pt-16 md:pt-20 pb-8 px-6 md:px-12 relative overflow-hidden">
      {/* Noise */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

      <div className="max-w-[1600px] mx-auto relative z-10">

        {/* Top section — large brand + links */}
        <div className="flex flex-col md:flex-row justify-between gap-12 md:gap-16 mb-16 pb-16 border-b border-white/[0.06]">

          {/* Brand */}
          <div className="max-w-[400px]">
            <div className="flex items-center gap-4 mb-6">
              <Logo size={36} white />
              <span style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '22px', fontWeight: 300, letterSpacing: '0.35em', color: '#fff', textTransform: 'uppercase' }}>Imperiial</span>
            </div>
            {/* Systematically brightened brand description (white) */}
            <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px', color: '#fff', lineHeight: 1.9, letterSpacing: '0.05em' }}>
              We architect digital dominance. Minimalist software for brands that refuse to compromise.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row gap-12 sm:gap-20">
            <div className="flex flex-col gap-5">
              <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', letterSpacing: '0.55em', textTransform: 'uppercase', color: '#fff', marginBottom: 4 }}>Navigate</p>
              {['Work', 'Process', 'Manifesto'].map(l => (
                <a key={l} href={`#${l.toLowerCase()}`}
                  className="hover:text-white transition-colors duration-300"
                  style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '12px', letterSpacing: '0.32em', textTransform: 'uppercase', color: '#fff', textDecoration: 'none' }}>
                  {l}
                </a>
              ))}
            </div>

            <div className="flex flex-col gap-5">
              <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', letterSpacing: '0.55em', textTransform: 'uppercase', color: '#fff', marginBottom: 4 }}>Connect</p>
              {[['LinkedIn', 'https://www.linkedin.com/company/imperiial'], ['Instagram', 'https://www.instagram.com/imperiial.dev/']].map(([l, h]) => (
                <a key={l} href={h} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors duration-300"
                  style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '12px', letterSpacing: '0.32em', textTransform: 'uppercase', color: '#fff', textDecoration: 'none' }}>
                  {l} <ArrowUpRight size={12} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6">
            {/* Systematically brightened Copyright/Location (white) */}
            <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#fff' }}>© 2026 Imperiial Digital Architecture</p>
            <div className="hidden sm:block w-[1px] h-3 bg-white/10" />
            <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#fff' }}>Pune, India</p>
          </div>

          {/* Systematically brightened Back to Top text (white) and increased circle opacity */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 bg-transparent border-none text-white hover:text-white transition-colors duration-300 group"
            style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', letterSpacing: '0.38em', textTransform: 'uppercase' }}>
            Back to Top
            <span className="w-8 h-8 border border-white/40 rounded-full flex items-center justify-center group-hover:border-white/90 transition-colors">
              <ArrowUp size={12} />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;