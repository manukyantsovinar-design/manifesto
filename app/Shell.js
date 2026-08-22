'use client';

import { useEffect, useState } from 'react';

/* Transcribed from the Manifesto Figma file via the design system export.
   Every number below is intentional — do not "clean up" the absolute positioning. */
export const M = {
  ink: '#402D2B', navy: '#0F3C66', sky: '#B8D7F4', cream: '#F6F0E4', base: '#E9F4FF',
  hand: '"Freehand",cursive', alice: '"Alice",Georgia,serif',
  aleo: '"Aleo",Georgia,serif', alef: '"Alef",system-ui,sans-serif',
  img: '/imagery/'
};

export const MOBILE_BREAKPOINT = 720;

/* Below the breakpoint, screens switch from the scaled 1440px stage to a
   normal-flow mobile layout (see Mobile.js) so text stays a legible fixed
   size instead of shrinking with the rest of the composition. */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const f = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    f();
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, []);
  return isMobile;
}

/* Authored at 1440px. Below that the whole stage scales down together so
   nothing reflows away from the composition. */
export function Stage({ height, children }) {
  const [s, setS] = useState(1);
  useEffect(() => {
    const f = () => setS(Math.min(1, window.innerWidth / 1440));
    f();
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, []);
  return (
    <div style={{ position: 'relative', width: '100%', height: height * s, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: '50%', top: 0, marginLeft: -720, width: 1440, height, transform: 'scale(' + s + ')', transformOrigin: 'top center' }}>{children}</div>
    </div>
  );
}

export function Backdrop() {
  const layer = { position: 'fixed', left: 0, top: 0, right: 0, bottom: 0, pointerEvents: 'none' };
  return (
    <>
      <div style={{ ...layer, background: M.base, zIndex: 0 }} />
      <div style={{ ...layer, background: 'url(' + M.img + 'bg-birds.png) center / cover no-repeat', mixBlendMode: 'overlay', zIndex: 0 }} />
      <div style={{ ...layer, background: 'url(' + M.img + 'texture-grunge.png) center / cover no-repeat', mixBlendMode: 'multiply', zIndex: 0 }} />
    </>
  );
}

export function Wordmark() {
  return <span style={{ position: 'absolute', left: 0, top: 59, width: 1440, textAlign: 'center', fontFamily: M.alice, fontSize: 16, lineHeight: '100%', color: 'rgba(15,60,102,0.6)' }}>Manifesto by Tsovinar Manukyan</span>;
}

export function Headline({ children, top = 95 }) {
  return <h1 style={{ position: 'absolute', left: 0, top, width: 1440, margin: 0, textAlign: 'center', fontFamily: M.hand, fontWeight: 400, fontSize: 96, lineHeight: '100%', letterSpacing: '0.060em', color: M.ink }}>{children}</h1>;
}

export function Sub({ children, top, width = 720 }) {
  return <p style={{ position: 'absolute', left: (1440 - width) / 2, top, width, margin: 0, textAlign: 'center', textWrap: 'pretty', fontFamily: M.alice, fontSize: 20, lineHeight: '155%', letterSpacing: '0.060em', color: M.navy }}>{children}</p>;
}

export function Cta({ label, onClick, left, top, width = 237, type = 'button', disabled }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      position: 'absolute', left, top, width, height: 51, border: 0, borderRadius: 50,
      cursor: disabled ? 'default' : 'pointer',
      background: disabled ? '#9AA6AE' : M.navy, color: M.sky, fontFamily: M.alice, fontSize: 20, letterSpacing: '0.080em',
      boxShadow: '0 0 0 2px ' + M.sky + ', 4px 4px 20px 0px rgba(0,0,0,0.15)'
    }}>{label}</button>
  );
}

/* Cream deckle-edged sheet. The 15px inset ring is how the Figma file draws the
   paper's soft outer edge, so it is reproduced rather than converted to padding. */
export function Paper({ left, top, width, height, children }) {
  return (
    <div style={{ position: 'absolute', left, top, width, height, borderRadius: 3, background: M.cream, filter: 'url(#deckle) drop-shadow(3px 5px 12px rgba(170,188,204,0.35))', boxShadow: 'inset 0 0 0 15px ' + M.cream + ', 0 0 0 15px ' + M.cream }}>{children}</div>
  );
}

export const ruleStyle = { position: 'absolute', height: 0, borderTop: '0.5px solid rgba(64,45,43,0.3)' };

/* One question: Alice title, Aleo italic hint, then a handwritten answer area. */
export function Field({ left, top, width = 387, height, title, hint, placeholder, value, onChange, single }) {
  const shared = {
    position: 'absolute', left: 0, top: 71, width, height: height - 71 - 12, boxSizing: 'border-box',
    background: 'transparent', border: 0, outline: 'none', resize: 'none', padding: 0,
    fontFamily: M.hand, fontSize: 18, lineHeight: '27px', letterSpacing: '0.080em', color: M.ink
  };
  return (
    <div style={{ position: 'absolute', left, top, width, height }}>
      <label style={{ position: 'absolute', left: 0, top: 21, width, fontFamily: M.alice, fontSize: 16, lineHeight: '100%', letterSpacing: '0.060em', color: M.navy }}>{title}</label>
      <span style={{ position: 'absolute', left: 0, top: 45, width, fontFamily: M.aleo, fontStyle: 'italic', fontWeight: 300, fontSize: 12, lineHeight: '100%', color: 'rgba(64,45,43,0.8)' }}>{hint}</span>
      {single
        ? <input value={value} onChange={onChange} placeholder={placeholder} style={{ ...shared, height: 27 }} />
        : <textarea value={value} onChange={onChange} placeholder={placeholder} style={shared} />}
      <div style={{ ...ruleStyle, left: 0, top: height, width }} />
    </div>
  );
}

/* Hidden paper-edge filter every <Paper> references. Rendered once in the root layout. */
export function DeckleFilter() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <filter id="deckle" x="-6%" y="-4%" width="112%" height="108%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.02 0.11" numOctaves="4" seed="7" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="10" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}
