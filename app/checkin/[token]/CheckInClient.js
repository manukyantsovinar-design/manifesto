'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { M, Stage, Wordmark, Headline, Sub, Paper, Field, Cta, useIsMobile } from '../../Shell';
import { MPage, MWordmark, MHeadline, MSub, MPaper, MField, MCta } from '../../Mobile';

const QUESTIONS = [
  { key: 'moved', title: 'What has moved since last time?', hint: 'Any small steps count.', placeholder: 'I started...' },
  { key: 'blocked', title: 'What got in the way?', hint: 'Facing challenges is okay.', placeholder: 'I had to...' },
  { key: 'next_step', title: 'What will you do next month?', hint: 'Plan ahead and dream big.', placeholder: 'I plan to...' }
];

const LETTER_BASE = 333;

function fmtDate(d) {
  return new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

/* The original letter, read-only, plus the archive of every past check-in —
   all on one flowing sheet, since paper does not have chrome. Reports its
   own height so the page below can shift to make room. */
function LetterSheet({ letter, checkins, onHeight }) {
  const ref = useRef(null);
  useLayoutEffect(() => { if (onHeight && ref.current) onHeight(ref.current.offsetHeight); });
  const label = { fontFamily: M.alice, fontSize: 14, letterSpacing: '0.060em', color: 'rgba(15,60,102,0.55)' };
  const hand = { fontFamily: M.hand, fontSize: 18, lineHeight: '27px', letterSpacing: '0.080em', color: M.ink, whiteSpace: 'pre-wrap', margin: '4px 0 0' };
  const rows = [['This is what I want', letter.want], ['This is why I want it so badly', letter.why], ['This is what I am willing to give', letter.give]];
  const archiveRows = [
    ['What has moved', 'moved'],
    ['What got in the way', 'blocked'],
    ['The next step', 'next_step']
  ];

  return (
    <div ref={ref} style={{ position: 'absolute', left: 495, top: 331, width: 451, minHeight: LETTER_BASE, boxSizing: 'border-box', padding: '28px 27px' }}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: 3, background: M.cream, filter: 'url(#deckle) drop-shadow(3px 5px 12px rgba(170,188,204,0.35))', boxShadow: 'inset 0 0 0 15px ' + M.cream + ', 0 0 0 15px ' + M.cream }} />
      <div style={{ ...hand, margin: 0, position: 'relative' }}>Dear, {letter.name || 'Name'}</div>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 30, marginTop: 8 }}>
        {rows.map(([t, v]) => (
          <div key={t}>
            <div style={label}>{t}</div>
            <p style={hand}>{v || '—'}</p>
          </div>
        ))}
      </div>
      <div style={{ position: 'relative', marginTop: 45, fontFamily: M.hand, fontSize: 14, letterSpacing: '0.080em', color: 'rgba(64,45,43,0.75)' }}>Sealed {fmtDate(letter.created_at)}</div>

      {checkins.length > 0 && (
        <div style={{ position: 'relative', marginTop: 40 }}>
          <div style={{ ...label, fontSize: 16, marginBottom: 20 }}>Your check-ins so far</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {checkins.map(c => (
              <div key={c.id} style={{ borderTop: '0.5px solid rgba(64,45,43,0.2)', paddingTop: 18 }}>
                <div style={{ fontFamily: M.aleo, fontSize: 11, fontStyle: 'italic', color: 'rgba(64,45,43,0.6)', marginBottom: 10 }}>{fmtDate(c.created_at)}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {archiveRows.map(([t, k]) => (
                    <div key={k}>
                      <div style={{ ...label, fontSize: 12 }}>{t}</div>
                      <p style={{ ...hand, fontSize: 16, lineHeight: '24px' }}>{c[k] || '—'}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* Same content as LetterSheet, in normal document flow for mobile. */
function MLetterSheet({ letter, checkins }) {
  const label = { fontFamily: M.alice, fontSize: 13, letterSpacing: '0.05em', color: 'rgba(15,60,102,0.55)' };
  const hand = { fontFamily: M.hand, fontSize: 17, lineHeight: '25px', letterSpacing: '0.05em', color: M.ink, whiteSpace: 'pre-wrap', margin: '4px 0 0' };
  const rows = [['This is what I want', letter.want], ['This is why I want it so badly', letter.why], ['This is what I am willing to give', letter.give]];
  const archiveRows = [
    ['What has moved', 'moved'],
    ['What got in the way', 'blocked'],
    ['The next step', 'next_step']
  ];
  return (
    <MPaper>
      <div style={{ ...hand, margin: 0 }}>Dear, {letter.name || 'Name'}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginTop: 8 }}>
        {rows.map(([t, v]) => (
          <div key={t}>
            <div style={label}>{t}</div>
            <p style={hand}>{v || '—'}</p>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 30, fontFamily: M.hand, fontSize: 13, letterSpacing: '0.06em', color: 'rgba(64,45,43,0.75)' }}>Sealed {fmtDate(letter.created_at)}</div>

      {checkins.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <div style={{ ...label, fontSize: 14, marginBottom: 16 }}>Your check-ins so far</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            {checkins.map(c => (
              <div key={c.id} style={{ borderTop: '0.5px solid rgba(64,45,43,0.2)', paddingTop: 14 }}>
                <div style={{ fontFamily: M.aleo, fontSize: 10, fontStyle: 'italic', color: 'rgba(64,45,43,0.6)', marginBottom: 8 }}>{fmtDate(c.created_at)}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {archiveRows.map(([t, k]) => (
                    <div key={k}>
                      <div style={{ ...label, fontSize: 11 }}>{t}</div>
                      <p style={{ ...hand, fontSize: 15, lineHeight: '22px' }}>{c[k] || '—'}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </MPaper>
  );
}

function CheckInDone({ letter, checkins }) {
  const [d, setD] = useState(0);
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <MPage>
        <MWordmark />
        <MHeadline>See you next time, {letter.name || 'Name'}</MHeadline>
        <MSub>You wrote this to yourself</MSub>
        <MLetterSheet letter={letter} checkins={checkins} />
        <p style={{ margin: '8px 0 12px', textAlign: 'center', fontFamily: M.hand, fontSize: 32, letterSpacing: '0.05em', color: M.ink }}>Noted, and kept.</p>
        <MSub>One step is enough for this month. We&rsquo;ll knock again in thirty days.</MSub>
      </MPage>
    );
  }

  return (
    <Stage height={1024 + d}>
      <Wordmark />
      <Headline>See you next time, {letter.name || 'Name'}</Headline>
      <Sub top={218}>You wrote this to yourself</Sub>
      <LetterSheet letter={letter} checkins={checkins} onHeight={h => setD(Math.max(0, h - LETTER_BASE))} />
      <p style={{ position: 'absolute', left: 0, top: 724 + d, width: 1440, margin: 0, textAlign: 'center', fontFamily: M.hand, fontSize: 48, letterSpacing: '0.060em', color: M.ink }}>Noted, and kept.</p>
      <Sub top={800 + d} width={620}>One step is enough for this month.<br />We&rsquo;ll knock again in thirty days.</Sub>
    </Stage>
  );
}

export default function CheckInClient({ letter, checkins, token }) {
  const [answers, setAnswers] = useState({ moved: '', blocked: '', next_step: '' });
  const [d, setD] = useState(0);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const isMobile = useIsMobile();

  const set = k => e => setAnswers({ ...answers, [k]: e.target.value });

  const save = async e => {
    e.preventDefault();
    if (!answers.moved.trim() || !answers.blocked.trim() || !answers.next_step.trim()) {
      setError('All three answers help future you — fill them in before saving.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`/api/checkin/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers)
      });
      if (!res.ok) throw new Error('Could not save this check-in. Please try again.');
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return <CheckInDone letter={letter} checkins={[{ id: 'new', created_at: new Date().toISOString(), ...answers }, ...checkins]} />;
  }

  if (isMobile) {
    return (
      <MPage>
        <MWordmark />
        <MHeadline>Hello again, {letter.name || 'Name'}</MHeadline>
        <MSub>You wrote this to yourself</MSub>
        <MLetterSheet letter={letter} checkins={checkins} />
        <MSub>Now answer these 3 questions.</MSub>
        <form onSubmit={save}>
          <MPaper>
            {QUESTIONS.map(q => (
              <MField key={q.key} title={q.title} hint={q.hint} placeholder={q.placeholder} value={answers[q.key]} onChange={set(q.key)} />
            ))}
            {error && <span style={{ display: 'block', fontFamily: M.aleo, fontSize: 12, color: '#7C2B2B', marginBottom: 8 }}>{error}</span>}
          </MPaper>
          <MCta type="submit" label={submitting ? 'Saving…' : 'Save this check-in'} onClick={save} disabled={submitting} />
        </form>
        <a href={`/sealed/${token}`} style={{ display: 'block', textAlign: 'center', marginTop: 24, fontFamily: M.alice, fontSize: 14, letterSpacing: '0.05em', color: M.navy, textDecoration: 'underline', textUnderlineOffset: '4px' }}>Go back to printable letter</a>
      </MPage>
    );
  }

  return (
    <Stage height={1700 + d}>
      <Wordmark />
      <Headline>Hello again, {letter.name || 'Name'}</Headline>
      <Sub top={218}>You wrote this to yourself</Sub>
      <LetterSheet letter={letter} checkins={checkins} onHeight={h => setD(Math.max(0, h - LETTER_BASE))} />
      <Sub top={730 + d}>Now answer these 3 questions.</Sub>
      <form onSubmit={save}>
        <Paper left={495} top={814 + d} width={451} height={727} />
        {QUESTIONS.map((q, i) => (
          <Field key={q.key} left={522} top={834 + d + i * 196} height={178} title={q.title} hint={q.hint} placeholder={q.placeholder} value={answers[q.key]} onChange={set(q.key)} />
        ))}
        {error && <span style={{ position: 'absolute', left: 522, top: 1420 + d, width: 400, fontFamily: M.aleo, fontSize: 11, color: '#7C2B2B' }}>{error}</span>}
        <Cta type="submit" label={submitting ? 'Saving…' : 'Save this check-in'} left={522} top={1439 + d} width={386} onClick={save} disabled={submitting} />
      </form>
      <a href={`/sealed/${token}`} style={{ position: 'absolute', left: 0, top: 1506 + d, width: 1440, textAlign: 'center', display: 'block', fontFamily: M.alice, fontSize: 16, letterSpacing: '0.060em', color: M.navy, textDecoration: 'underline', textUnderlineOffset: '4px' }}>Go back to printable letter</a>
    </Stage>
  );
}
