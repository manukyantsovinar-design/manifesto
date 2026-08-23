'use client';

import { M } from './Shell';

/* Normal-flow mobile layout: fixed, legible font sizes and stacked content,
   instead of the desktop stage scaled down as a whole. */

export function MPage({ children, maxWidth = 440 }) {
  return (
    <div style={{ position: 'relative', maxWidth, margin: '0 auto', padding: '40px 20px 72px', boxSizing: 'border-box' }}>{children}</div>
  );
}

export function MWordmark() {
  return <p style={{ textAlign: 'center', margin: '0 0 28px', fontFamily: M.alice, fontSize: 12, letterSpacing: '0.06em', color: 'rgba(15,60,102,0.6)' }}>Manifesto by Tsovinar Manukyan</p>;
}

export function MHeadline({ children }) {
  return <h1 style={{ margin: '0 0 10px', textAlign: 'center', fontFamily: M.hand, fontWeight: 400, fontSize: 'clamp(32px, 11vw, 48px)', lineHeight: 1.1, letterSpacing: '0.04em', color: M.ink }}>{children}</h1>;
}

export function MSub({ children }) {
  return <p style={{ margin: '0 0 32px', textAlign: 'center', fontFamily: M.alice, fontSize: 15, lineHeight: 1.6, letterSpacing: '0.02em', color: M.navy }}>{children}</p>;
}

/* The deckle filter must only ever touch a plain background layer, never an
   element that also contains text — feDisplacementMap distorts every pixel
   it paints, letters included, which is what made mobile text look wobbly. */
export function MPaper({ children, style }) {
  return (
    <div style={{ position: 'relative', boxSizing: 'border-box', padding: '28px 20px', marginBottom: 28, ...style }}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: 3, background: M.cream, filter: 'url(#deckle) drop-shadow(3px 5px 12px rgba(170,188,204,0.35))' }} />
      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  );
}

export function MCta({ label, onClick, type = 'button', disabled }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      display: 'block', width: '100%', height: 52, border: 0, borderRadius: 50,
      cursor: disabled ? 'default' : 'pointer',
      background: disabled ? '#9AA6AE' : M.navy, color: M.sky, fontFamily: M.alice, fontSize: 17, letterSpacing: '0.06em',
      boxShadow: '0 0 0 2px ' + M.sky + ', 4px 4px 20px 0px rgba(0,0,0,0.15)'
    }}>{label}</button>
  );
}

const mRuleStyle = { height: 0, borderTop: '0.5px solid rgba(64,45,43,0.3)', marginTop: 8 };

export function MField({ title, hint, placeholder, value, onChange, single, style }) {
  const shared = {
    display: 'block', width: '100%', boxSizing: 'border-box',
    background: 'transparent', border: 0, outline: 'none', resize: 'none', padding: 0,
    fontFamily: M.hand, fontSize: 17, lineHeight: '26px', letterSpacing: '0.06em', color: M.ink
  };
  return (
    <div style={{ marginBottom: 26, ...style }}>
      <label style={{ display: 'block', fontFamily: M.alice, fontSize: 14, letterSpacing: '0.05em', color: M.navy, marginBottom: 4 }}>{title}</label>
      <span style={{ display: 'block', fontFamily: M.aleo, fontStyle: 'italic', fontWeight: 300, fontSize: 11, color: 'rgba(64,45,43,0.8)', marginBottom: 10 }}>{hint}</span>
      {single
        ? <input value={value} onChange={onChange} placeholder={placeholder} style={shared} />
        : <textarea rows={3} value={value} onChange={onChange} placeholder={placeholder} style={{ ...shared, minHeight: 66 }} />}
      <div style={mRuleStyle} />
    </div>
  );
}
