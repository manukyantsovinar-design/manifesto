'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { M, Stage, Wordmark, Headline, Sub, Paper, Field, Cta, ruleStyle, useIsMobile } from '../Shell';
import { MPage, MWordmark, MHeadline, MSub, MPaper, MField, MCta } from '../Mobile';
import Sealing from '../Sealing';

/* Cloudflare Turnstile: invisible/one-click bot check. The widget calls
   window.onTurnstileVerified once solved; we hold that token and send it
   along with the letter for server-side verification in /api/letters. */
function TurnstileWidget({ onVerified }) {
  if (typeof window !== 'undefined') window.onTurnstileVerified = onVerified;
  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
      <div
        className="cf-turnstile"
        data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
        data-callback="onTurnstileVerified"
        data-theme="light"
      />
    </>
  );
}

const DREAMS = [
  { key: 'want', title: 'This is what I want', hint: 'Say it plainly. Dreams get shy when we hedge.', placeholder: 'By this time next year...' },
  { key: 'why', title: 'This is why I want it', hint: 'The real reason, not the polite one.', placeholder: 'I am meant for...' },
  { key: 'give', title: 'This is what I am willing to give', hint: "Hours, comfort, old habits. Name what you'll trade.", placeholder: 'I am willing...' }
];

const BLANK = { name: '', want: '', why: '', give: '', email: '', consent: true };

export default function WriteLetter() {
  const router = useRouter();
  const [letter, setLetter] = useState(BLANK);
  const [touched, setTouched] = useState(false);
  const [sealing, setSealing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState(null);
  const [captchaToken, setCaptchaToken] = useState('');
  const isMobile = useIsMobile();

  const set = k => e => setLetter({ ...letter, [k]: e.target.value });
  const ready = letter.name.trim() && letter.want.trim() && /.+@.+\..+/.test(letter.email) && letter.consent;

  const seal = async e => {
    e.preventDefault();
    setTouched(true);
    if (!ready || submitting) return;
    if (!captchaToken) {
      setError('Please complete the check above so we know you’re not a robot.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/letters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...letter, turnstileToken: captchaToken })
      });
      if (!res.ok) throw new Error('Something went wrong sealing your letter. Please try again.');
      const data = await res.json();
      setToken(data.token);
      setSealing(true);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
      setCaptchaToken('');
      if (typeof window !== 'undefined' && window.turnstile) window.turnstile.reset();
    }
  };

  if (sealing) {
    return <Sealing onDone={() => router.push('/sealed/' + token)} />;
  }

  if (isMobile) {
    return (
      <MPage>
        <MWordmark />
        <MHeadline>Take your time</MHeadline>
        <MSub>You&apos;ll write one short letter to yourself. What do you want, why you want it, and what you&apos;re willing to give for it. Once a month I will check up on you.</MSub>
        <form onSubmit={seal}>
          <MPaper>
            <div style={{ marginBottom: 26 }}>
              <label style={{ display: 'block', fontFamily: M.alice, fontSize: 14, letterSpacing: '0.05em', color: M.navy, marginBottom: 8 }}>Dear</label>
              <input value={letter.name} onChange={set('name')} placeholder="Your name" style={{ display: 'block', width: '100%', boxSizing: 'border-box', padding: 0, border: 0, outline: 'none', background: 'transparent', fontFamily: M.hand, fontSize: 20, letterSpacing: '0.06em', color: M.ink }} />
              <div style={{ height: 0, borderTop: '0.5px solid rgba(64,45,43,0.3)', marginTop: 8 }} />
            </div>
            {DREAMS.map(d => (
              <MField key={d.key} title={d.title} hint={d.hint} placeholder={d.placeholder} value={letter[d.key]} onChange={set(d.key)} />
            ))}
            <span style={{ display: 'block', fontFamily: M.aleo, fontSize: 13, letterSpacing: '0.05em', color: M.navy, marginBottom: 10 }}>Where should your monthly check-in land?</span>
            <input type="email" value={letter.email} onChange={set('email')} placeholder="you@gmail.com" style={{ display: 'block', width: '100%', boxSizing: 'border-box', height: 44, padding: '0 16px', borderRadius: 50, border: 0, outline: 'none', background: '#fff', boxShadow: '0 0 0 2.5px ' + M.sky, fontFamily: M.aleo, fontSize: 14, color: 'rgba(64,45,43,0.9)', marginBottom: 16 }} />
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 14 }}>
              <input id="consent-m" type="checkbox" checked={letter.consent} onChange={e => setLetter({ ...letter, consent: e.target.checked })} style={{ width: 18, height: 18, margin: '2px 0 0', accentColor: M.navy, flex: '0 0 auto' }} />
              <label htmlFor="consent-m" style={{ fontFamily: M.aleo, fontSize: 13, lineHeight: '19px', color: 'rgba(64,45,43,0.9)' }}>Once a month, send me three small questions about this dream — and remind me what I wrote here.</label>
            </div>
            <span style={{ display: 'block', fontFamily: M.aleo, fontStyle: 'italic', fontWeight: 300, fontSize: 11, color: 'rgba(64,45,43,0.7)', marginBottom: 8 }}>Nothing is shared. This letter is only yours.</span>
            {touched && !ready && <span style={{ display: 'block', fontFamily: M.aleo, fontSize: 12, color: '#7C2B2B', marginBottom: 8 }}>Your name, the first answer, an email address and the monthly note — then it can be sealed.</span>}
            {error && <span style={{ display: 'block', fontFamily: M.aleo, fontSize: 12, color: '#7C2B2B', marginBottom: 8 }}>{error}</span>}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
              <TurnstileWidget onVerified={setCaptchaToken} />
            </div>
          </MPaper>
          <MCta type="submit" label={submitting ? 'Sealing…' : 'Seal my letter'} onClick={seal} disabled={submitting} />
        </form>
      </MPage>
    );
  }

  return (
    <Stage height={1705}>
      <Wordmark />
      <Headline>Take your time</Headline>
      <Sub top={218} width={700}>You&apos;ll write one short letter to yourself. What do you want, why you want it, and what you&apos;re willing to give for it.<br />Once a month I will check up on you.</Sub>
      <Paper left={489} top={381} width={461} height={1169} />
      <form onSubmit={seal}>
        <div style={{ position: 'absolute', left: 522, top: 420, width: 387, height: 66 }}>
          <label style={{ position: 'absolute', left: 0, top: 0, width: 387, fontFamily: M.alice, fontSize: 16, lineHeight: '100%', letterSpacing: '0.060em', color: M.navy }}>Dear</label>
          <input value={letter.name} onChange={set('name')} placeholder="Your name" style={{ position: 'absolute', left: 0, top: 33, width: 387, height: 27, padding: 0, border: 0, outline: 'none', background: 'transparent', fontFamily: M.hand, fontSize: 22, lineHeight: '27px', letterSpacing: '0.080em', color: M.ink }} />
          <div style={{ ...ruleStyle, left: 0, top: 66, width: 386 }} />
        </div>
        {DREAMS.map((d, i) => (
          <Field key={d.key} left={522} top={490 + i * 264} height={246} title={d.title} hint={d.hint} placeholder={d.placeholder} value={letter[d.key]} onChange={set(d.key)} />
        ))}
        <span style={{ position: 'absolute', left: 518, top: 1345, width: 404, fontFamily: M.aleo, fontSize: 14, lineHeight: '100%', letterSpacing: '0.060em', color: M.navy }}>Where should your monthly check-in land?</span>
        <input type="email" value={letter.email} onChange={set('email')} placeholder="you@gmail.com" style={{ position: 'absolute', left: 518, top: 1372, width: 404, height: 27, boxSizing: 'border-box', padding: '0 12px', borderRadius: 50, border: 0, outline: 'none', background: '#fff', boxShadow: '0 0 0 2.5px ' + M.sky, fontFamily: M.aleo, fontSize: 12, letterSpacing: '0.010em', color: 'rgba(64,45,43,0.9)' }} />
        <div style={{ position: 'absolute', left: 522, top: 1408, width: 400, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <input id="consent" type="checkbox" checked={letter.consent} onChange={e => setLetter({ ...letter, consent: e.target.checked })} style={{ width: 18, height: 18, margin: '2px 0 0', accentColor: M.navy, flex: '0 0 auto' }} />
          <label htmlFor="consent" style={{ fontFamily: M.aleo, fontSize: 12, lineHeight: '17px', color: 'rgba(64,45,43,0.9)' }}>Once a month, send me three small questions about this dream — and remind me what I wrote here.</label>
        </div>
        <span style={{ position: 'absolute', left: 522, top: 1456, width: 400, fontFamily: M.aleo, fontStyle: 'italic', fontWeight: 300, fontSize: 10, color: 'rgba(64,45,43,0.7)' }}>Nothing is shared. This letter is only yours.</span>
        {touched && !ready && <span style={{ position: 'absolute', left: 522, top: 1476, width: 400, fontFamily: M.aleo, fontSize: 11, color: '#7C2B2B' }}>Your name, the first answer, an email address and the monthly note — then it can be sealed.</span>}
        {error && <span style={{ position: 'absolute', left: 522, top: 1476, width: 400, fontFamily: M.aleo, fontSize: 11, color: '#7C2B2B' }}>{error}</span>}
        <div style={{ position: 'absolute', left: 572, top: 1500 }}>
          <TurnstileWidget onVerified={setCaptchaToken} />
        </div>
        <Cta type="submit" label={submitting ? 'Sealing…' : 'Seal my letter'} left={601} top={1578} onClick={seal} disabled={submitting} />
      </form>
    </Stage>
  );
}
