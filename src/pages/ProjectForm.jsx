import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Send, ChevronRight } from 'lucide-react';

/* ─────────────────────────────────────────────
   WORDMARK
───────────────────────────────────────────── */
const Wordmark = ({ style = {} }) => (
  <span style={{
    fontFamily: '"Cormorant Garamond", Georgia, serif',
    fontWeight: 300,
    fontSize: '15px',
    letterSpacing: '0.42em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.7)',
    display: 'inline-block',
    lineHeight: 1,
    ...style,
  }}>
    Imperiial
  </span>
);

/* ─────────────────────────────────────────────
   CURSOR (Desktop only)
───────────────────────────────────────────── */
const Cursor = () => {
  const dot  = useRef(null);
  const ring = useRef(null);
  const pos  = useRef({ x: -100, y: -100 });
  const rpos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    if (window.innerWidth < 768) return;
    const move = (e) => { pos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', move);
    let raf;
    const loop = () => {
      rpos.current.x += (pos.current.x - rpos.current.x) * 0.11;
      rpos.current.y += (pos.current.y - rpos.current.y) * 0.11;
      if (dot.current)  dot.current.style.transform  = `translate(${pos.current.x - 3}px,${pos.current.y - 3}px)`;
      if (ring.current) ring.current.style.transform = `translate(${rpos.current.x - 18}px,${rpos.current.y - 18}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div className="hidden md:block">
      <div ref={dot}  style={{ position: 'fixed', top: 0, left: 0, width: 6, height: 6, borderRadius: '50%', background: '#fff', zIndex: 9999, pointerEvents: 'none', mixBlendMode: 'difference', willChange: 'transform' }} />
      <div ref={ring} style={{ position: 'fixed', top: 0, left: 0, width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.45)', zIndex: 9999, pointerEvents: 'none', mixBlendMode: 'difference', willChange: 'transform' }} />
    </div>
  );
};

/* ─────────────────────────────────────────────
   FLOATING INPUT
───────────────────────────────────────────── */
const Field = ({ label, value, onChange, type = 'text', required, tag = 'input', rows }) => {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;

  const sharedStyle = {
    display: 'block', width: '100%', background: 'transparent',
    padding: '20px 0 12px',
    fontSize: 'clamp(17px, 2.5vw, 20px)', fontWeight: 300,
    color: '#fff', border: 'none',
    borderBottom: `1px solid ${focused ? '#fff' : 'rgba(255,255,255,0.14)'}`,
    outline: 'none', resize: 'none', transition: 'border-color 0.35s',
    letterSpacing: '0.02em', fontFamily: 'Georgia, serif',
  };

  return (
    <div style={{ position: 'relative', paddingTop: 24 }}>
      {tag === 'textarea'
        ? <textarea required={required} rows={rows || 5} value={value} onChange={onChange}
            placeholder="" onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            style={sharedStyle} className="w-full" />
        : <input type={type} required={required} value={value} onChange={onChange}
            placeholder="" onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            style={sharedStyle} className="w-full" />
      }
      <label style={{
        position: 'absolute', left: 0, pointerEvents: 'none',
        top: lifted ? 0 : 36,
        fontSize: lifted ? '11px' : 'clamp(16px, 2.5vw, 20px)',
        letterSpacing: lifted ? '0.5em' : '0.04em',
        textTransform: lifted ? 'uppercase' : 'none',
        color: focused ? '#fff' : lifted ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)',
        fontFamily: lifted ? '"IBM Plex Mono", monospace' : 'Georgia, serif',
        fontWeight: 300, transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
      }}>{label}</label>
      <div style={{ position: 'absolute', bottom: 0, left: 0, height: 1, background: '#fff', width: focused ? '100%' : '0%', transition: 'width 0.5s cubic-bezier(0.16,1,0.3,1)' }} />
    </div>
  );
};

/* ─────────────────────────────────────────────
   CHIP
───────────────────────────────────────────── */
const Chip = ({ label, selected, onClick, withCheck }) => (
  <button type="button" onClick={onClick}
    className="hover:border-white/40 hover:text-white/75"
    style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '10px 18px',
      border: `1px solid ${selected ? '#fff' : 'rgba(255,255,255,0.14)'}`,
      background: selected ? '#fff' : 'transparent',
      color: selected ? '#000' : 'rgba(255,255,255,0.9)',
      fontFamily: '"IBM Plex Mono", monospace',
      fontSize: 'clamp(10px, 1.2vw, 11px)',
      letterSpacing: '0.32em', textTransform: 'uppercase',
      transition: 'all 0.25s',
    }}>
    {withCheck && selected && <Check size={9} strokeWidth={3} />}
    {label}
  </button>
);

/* ─────────────────────────────────────────────
   STEP INDICATOR
───────────────────────────────────────────── */
const StepDot = ({ active, done, label, n }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
    <div style={{
      width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: `1px solid ${done ? '#fff' : active ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.14)'}`,
      background: done ? '#fff' : 'transparent', transition: 'all 0.4s', flexShrink: 0,
    }}>
      {done
        ? <Check size={12} strokeWidth={3} style={{ color: '#000' }} />
        : <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', color: active ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.22)' }}>{n}</span>
      }
    </div>
    <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '9px', letterSpacing: '0.38em', textTransform: 'uppercase', color: active ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.18)' }}>{label}</span>
  </div>
);

/* ─────────────────────────────────────────────
   SUCCESS SCREEN
───────────────────────────────────────────── */
const Success = ({ name, onReturn }) => (
  <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-5 sm:px-8 py-16 text-center relative overflow-hidden">
    <Cursor />
    <div className="fixed inset-0 pointer-events-none z-[60] opacity-[0.04]"
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
    <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
      style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '100px 100px' }} />

    <div className="relative z-10 max-w-[580px] w-full" style={{ animation: 'fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) both' }}>

      {/* Pulsing ring icon */}
      <div className="mx-auto mb-10 relative w-20 h-20 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-white/[0.15]" style={{ animation: 'ping 3s ease-in-out infinite' }} />
        <div className="absolute -inset-2.5 rounded-full border border-white/[0.06]" />
        {/* Wordmark in circle */}
        <Wordmark style={{ fontSize: '9px', letterSpacing: '0.38em', color: 'rgba(255,255,255,0.5)' }} />
      </div>

      <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', letterSpacing: '0.6em', textTransform: 'uppercase', color: '#fff', marginBottom: 28 }}>
        Transmission Received
      </p>

      <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(36px, 7vw, 80px)', fontWeight: 300, lineHeight: 0.9, letterSpacing: '-0.03em', marginBottom: 32, whiteSpace: 'pre-line' }}>
        {name ? `${name.split(' ')[0]},\nwe're on it.` : 'Request\nReceived.'}
      </h2>

      <p style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', fontWeight: 300, color: 'rgba(255,255,255,0.9)', lineHeight: 1.85, margin: '0 auto 56px', maxWidth: 440 }}>
        Your brief has been routed to our intake team. Expect a response within{' '}
        <span style={{ color: '#fff' }}>24 hours.</span>
      </p>

      <div className="flex items-center justify-center gap-6 mb-10">
        <div style={{ height: 1, width: 48, background: 'rgba(255,255,255,0.08)' }} />
        <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', letterSpacing: '0.5em', textTransform: 'uppercase', color: '#fff' }}>What's Next</span>
        <div style={{ height: 1, width: 48, background: 'rgba(255,255,255,0.08)' }} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-14">
        {[['01', 'Brief Review', 'We study your submission in full.'], ['02', 'Discovery Call', '30-min intro with our team.'], ['03', 'Proposal', 'Custom scope & pricing.']].map(([n, t, d]) => (
          <div key={n} className="p-5 sm:p-6 border border-white/[0.07] bg-white/[0.018] text-left hover:border-white/[0.15] transition-colors">
            <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', color: '#fff', marginBottom: 12, letterSpacing: '0.4em' }}>{n}</p>
            <p style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '20px', fontWeight: 300, color: 'rgba(255,255,255,0.95)', marginBottom: 8 }}>{t}</p>
            <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>{d}</p>
          </div>
        ))}
      </div>

      <button onClick={onReturn}
        className="mx-auto flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.4em] text-white/30 hover:text-white transition-colors duration-300 bg-transparent border-none">
        <ArrowLeft size={12} /> Return to Imperiial
      </button>
    </div>

    <style>{`
      @keyframes fadeUp { from { transform: translateY(32px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      @keyframes ping   { 0%, 100% { transform: scale(1); opacity: 0.4; } 50% { transform: scale(1.25); opacity: 0; } }
    `}</style>
  </div>
);

/* ─────────────────────────────────────────────
   CONTINUE BUTTON
───────────────────────────────────────────── */
const ContinueBtn = ({ onClick, disabled }) => (
  <button type="button" onClick={onClick} disabled={disabled}
    className={`w-full flex items-center justify-center gap-3 font-mono text-[12px] tracking-[0.42em] uppercase transition-all duration-300 border-none ${disabled ? 'bg-white/[0.1] text-white/[0.25]' : 'bg-white text-black hover:bg-white/90'}`}
    style={{ padding: '20px 0' }}>
    Continue <ChevronRight size={14} />
  </button>
);

/* ─────────────────────────────────────────────
   FORM DATA
───────────────────────────────────────────── */
const SERVICES  = ['Web Architecture', 'Mobile App', 'AI Integration', 'Product Design', 'Bespoke Software'];
const TIMELINES = ['ASAP', '1 – 3 months', '3 – 6 months', 'Flexible'];

/* ─────────────────────────────────────────────
   MAIN FORM
───────────────────────────────────────────── */
const ProjectForm = () => {
  const navigate = useNavigate();
  const [step, setStep]         = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]   = useState(false);
  const [form, setForm]         = useState({ name: '', email: '', phone: '', services: [], timeline: '', details: '' });

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));
  const toggleSvc = s => setForm(p => ({
    ...p,
    services: p.services.includes(s) ? p.services.filter(x => x !== s) : [...p.services, s],
  }));

  const can1 = form.name.trim() && form.email.trim() && form.phone.trim();
  const can2 = form.services.length > 0 && form.timeline;
  const can3 = can2 && form.details.trim();

  const handleSubmit = async () => {
    if (!can3) return;
    setSubmitting(true);
    try {
      const res = await fetch('https://imperiial-backend.onrender.com', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSubmitting(false);
      setSuccess(true);
    } catch {
      setSubmitting(false);
      alert('Transmission intercepted. Ensure backend is running on port 5000.');
    }
  };

  if (success) return <Success name={form.name} onReturn={() => navigate('/')} />;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col overflow-hidden relative">
      <Cursor />

      {/* Noise */}
      <div className="fixed inset-0 pointer-events-none z-[60] opacity-[0.04]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

      {/* Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '100px 100px' }} />

      {/* ── HEADER ── */}
      <div className="flex items-center justify-between px-5 sm:px-8 lg:px-12 py-5 sm:py-6 border-b border-white/[0.05] relative z-10">
        <button
          onClick={() => step > 1 ? setStep(s => s - 1) : navigate('/')}
          className="flex items-center gap-2 bg-transparent border-none text-white hover:text-white transition-colors"
          style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', letterSpacing: '0.38em', textTransform: 'uppercase' }}>
          <ArrowLeft size={12} /> {step > 1 ? 'Back' : 'Imperiial'}
        </button>

        {/* Centred wordmark */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Wordmark />
        </div>

        <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', letterSpacing: '0.42em', color: '#fff', textTransform: 'uppercase' }}>
          {String(step).padStart(2, '0')} / 03
        </span>
      </div>

      {/* ── STEP INDICATOR ── */}
      <div className="px-5 sm:px-8 pt-8 sm:pt-10 relative z-10">
        <div className="max-w-[480px] mx-auto flex items-start gap-3">
          {[{ n: '01', label: 'You' }, { n: '02', label: 'Project' }, { n: '03', label: 'Details' }].map((s, i) => (
            <React.Fragment key={s.n}>
              <StepDot n={s.n} label={s.label} active={step === i + 1} done={step > i + 1} />
              {i < 2 && (
                <div style={{ flex: 1, height: 1, marginTop: 15, background: step > i + 1 ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.08)', transition: 'background 0.5s' }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── FORM BODY ── */}
      <div className="flex-1 flex items-start justify-center px-5 sm:px-8 py-10 sm:py-14 md:py-20 relative z-10">
        <div className="w-full max-w-[540px]" style={{ animation: 'slideIn 0.55s cubic-bezier(0.16,1,0.3,1) both' }} key={step}>

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', letterSpacing: '0.55em', textTransform: 'uppercase', color: '#fff', marginBottom: 16 }}>Step 01</p>
              <h1 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 300, lineHeight: 0.95, letterSpacing: '-0.02em', marginBottom: 16 }}>Introduce yourself.</h1>
              <p style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', fontWeight: 300, color: 'rgba(255,255,255,0.9)', marginBottom: 40, lineHeight: 1.6 }}>Every great project starts with a name.</p>
              <div className="flex flex-col gap-8 mb-10">
                <Field label="Your Name"        value={form.name}  onChange={set('name')}  required />
                <Field label="Email Address" type="email" value={form.email} onChange={set('email')} required />
                <Field label="Phone" type="tel"  value={form.phone} onChange={set('phone')} required />
              </div>
              <ContinueBtn disabled={!can1} onClick={() => can1 && setStep(2)} />
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', letterSpacing: '0.55em', textTransform: 'uppercase', color: '#fff', marginBottom: 16 }}>Step 02</p>
              <h1 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 300, lineHeight: 0.95, letterSpacing: '-0.02em', marginBottom: 16 }}>Define the scope.</h1>
              <p style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', fontWeight: 300, color: 'rgba(255,255,255,0.9)', marginBottom: 40, lineHeight: 1.6 }}>Select everything that applies.</p>

              <div className="flex flex-col gap-10 mb-10">
                <div>
                  <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', letterSpacing: '0.45em', textTransform: 'uppercase', color: '#fff', marginBottom: 16 }}>Services needed</p>
                  <div className="flex flex-wrap gap-2">
                    {SERVICES.map(s => <Chip key={s} label={s} selected={form.services.includes(s)} onClick={() => toggleSvc(s)} withCheck />)}
                  </div>
                </div>
                <div>
                  <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', letterSpacing: '0.45em', textTransform: 'uppercase', color: '#fff', marginBottom: 16 }}>Timeline</p>
                  <div className="flex flex-wrap gap-2">
                    {TIMELINES.map(t => <Chip key={t} label={t} selected={form.timeline === t} onClick={() => setForm(p => ({ ...p, timeline: t }))} />)}
                  </div>
                </div>
              </div>
              <ContinueBtn disabled={!can2} onClick={() => can2 && setStep(3)} />
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', letterSpacing: '0.55em', textTransform: 'uppercase', color: '#fff', marginBottom: 16 }}>Step 03</p>
              <h1 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 300, lineHeight: 0.95, letterSpacing: '-0.02em', marginBottom: 16 }}>Tell us everything.</h1>
              <p style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', fontWeight: 300, color: 'rgba(255,255,255,0.9)', marginBottom: 32, lineHeight: 1.6 }}>The more context, the better the outcome.</p>

              {/* Selection summary */}
              <div className="p-4 sm:p-6 border border-white/[0.08] bg-white/[0.018] mb-8 flex flex-wrap gap-2">
                <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#fff', width: '100%', marginBottom: 4 }}>Your selection</span>
                {form.services.map(s => (
                  <span key={s} style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', padding: '4px 12px', border: '1px solid rgba(255,255,255,0.22)', color: 'rgba(255,255,255,0.9)' }}>{s}</span>
                ))}
                {form.timeline && (
                  <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', padding: '4px 12px', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}>{form.timeline}</span>
                )}
              </div>

              <div className="mb-10">
                <Field label="Project Details & Vision" tag="textarea" rows={6} value={form.details} onChange={set('details')} required />
                <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginTop: 16, letterSpacing: '0.25em', lineHeight: 1.7 }}>
                  Include goals, audience, references, or anything relevant.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || !can3}
                className={`w-full flex items-center justify-center gap-3 font-mono text-[12px] tracking-[0.42em] uppercase transition-all duration-300 border-none ${can3 && !submitting ? 'bg-white text-black hover:bg-white/90' : 'bg-white/[0.12] text-white/30'}`}
                style={{ padding: '20px 0' }}>
                {submitting
                  ? <><span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin inline-block" /> Transmitting...</>
                  : <>Submit Project Brief <Send size={14} /></>
                }
              </button>

              <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', color: '#fff', marginTop: 20, textAlign: 'center', letterSpacing: '0.3em' }}>
                By submitting you agree to our terms. No spam, ever.
              </p>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProjectForm;
