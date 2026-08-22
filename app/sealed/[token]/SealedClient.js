'use client';

import { useState } from 'react';
import { M, Stage, Wordmark, Headline, Sub, Cta, useIsMobile } from '../../Shell';
import { MPage, MWordmark, MHeadline, MSub, MCta } from '../../Mobile';

function escapeHtml(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

function printLetter(letter) {
  const rows = [
    ['This is what I want', letter.want],
    ['This is why I want it', letter.why],
    ['This is what I am willing to give', letter.give]
  ].map(([t, v]) => '<h2>' + t + '</h2><p class="hand">' + escapeHtml(v) + '</p>').join('');
  const w = window.open('', '_blank');
  w.document.write('<!doctype html><html><head><meta charset="utf-8"><title>My manifesto</title>' +
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Freehand&family=Alice&family=Aleo:ital,wght@0,400;1,300&display=swap">' +
    '<style>@page{margin:0}body{margin:0;background:#E9F4FF}' +
    '.sheet{width:210mm;min-height:297mm;box-sizing:border-box;padding:28mm 26mm;margin:0 auto;background:#F6F0E4;color:#402D2B}' +
    '.by{font-family:Alice,serif;font-size:11pt;color:rgba(15,60,102,.6);text-align:center;margin:0 0 14mm}' +
    'h1{font-family:Freehand,cursive;font-weight:400;font-size:34pt;letter-spacing:.06em;margin:0 0 12mm;color:#402D2B}' +
    'h2{font-family:Alice,serif;font-weight:400;font-size:13pt;letter-spacing:.06em;color:#0F3C66;margin:0 0 3mm}' +
    '.hand{font-family:Freehand,cursive;font-size:16pt;line-height:1.6;letter-spacing:.08em;white-space:pre-wrap;margin:0 0 14mm}' +
    '.sealed{font-family:Aleo,serif;font-style:italic;font-size:10pt;color:rgba(64,45,43,.75);margin-top:18mm}' +
    '@media print{body{background:#fff}}</style></head><body><div class="sheet">' +
    '<p class="by">Manifesto by Tsovinar Manukyan</p>' +
    '<h1>Dear ' + escapeHtml(letter.name) + '</h1>' + rows +
    '<p class="sealed">Sealed ' + new Date(letter.created_at).toLocaleDateString() + '</p>' +
    '</div><script>window.onload=function(){setTimeout(function(){window.print()},400)}<\/script></body></html>');
  w.document.close();
}

export default function SealedClient({ letter, token }) {
  const [copied, setCopied] = useState(false);
  const checkinUrl = typeof window !== 'undefined' ? `${window.location.origin}/checkin/${token}` : `/checkin/${token}`;

  const copy = () => {
    navigator.clipboard && navigator.clipboard.writeText(checkinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <MPage>
        <MWordmark />
        <MHeadline>It is sealed!</MHeadline>
        <MSub>Your letter is safe. Now print it and put it somewhere your eyes go every morning. I believe in you!</MSub>
        <div style={{ marginBottom: 28 }}>
          <MCta label="Download the printable letter" onClick={() => printLetter(letter)} />
        </div>
        <div style={{ borderRadius: 15, background: M.cream, boxShadow: '4px 4px 22px 0px rgba(170,188,204,0.2)', padding: '22px 20px', marginBottom: 20 }}>
          <p style={{ margin: '0 0 10px', fontFamily: M.alice, fontSize: 17, letterSpacing: '0.05em', color: M.navy }}>Your monthly check-in</p>
          <p style={{ margin: '0 0 16px', fontFamily: M.aleo, fontSize: 13, lineHeight: '20px', color: 'rgba(64,45,43,0.9)' }}>Once a month you&rsquo;ll get a note at {letter.email || 'your inbox'} with three small questions. It always opens this private page, where your letter is waiting.</p>
          <div style={{ borderRadius: 50, background: '#fff', boxShadow: '0 0 0 4px ' + M.sky, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px' }}>
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: M.alef, fontSize: 11, letterSpacing: '0.03em', color: M.navy }}>{checkinUrl}</span>
            <button onClick={copy} style={{ border: 0, background: 'transparent', cursor: 'pointer', flex: '0 0 auto', fontFamily: M.alice, fontSize: 12, letterSpacing: '0.06em', color: copied ? '#4A7A4A' : 'rgba(15,60,102,0.6)' }}>{copied ? 'Copied' : 'Copy'}</button>
          </div>
        </div>
        <a href={`/checkin/${token}`} style={{ display: 'block', textAlign: 'center', fontFamily: M.aleo, fontStyle: 'italic', fontSize: 12, color: 'rgba(15,60,102,0.7)', textDecoration: 'none' }}>Preview the monthly check-in page</a>
      </MPage>
    );
  }

  return (
    <Stage height={1024}>
      <Wordmark />
      <Headline>It is sealed!</Headline>
      <Sub top={218} width={700}>Your letter is safe.<br />Now print it and put it somewhere your eyes go every morning. I believe in you!</Sub>
      <Cta label="Download the printable letter" left={527} top={372} width={386} onClick={() => printLetter(letter)} />
      <div style={{ position: 'absolute', left: 474, top: 466, width: 492, height: 190, borderRadius: 15, background: M.cream, boxShadow: '4px 4px 22px 0px rgba(170,188,204,0.2)' }} />
      <span style={{ position: 'absolute', left: 515, top: 496, width: 410, fontFamily: M.alice, fontSize: 20, letterSpacing: '0.060em', color: M.navy }}>Your monthly check-in</span>
      <p style={{ position: 'absolute', left: 515, top: 530, width: 410, margin: 0, fontFamily: M.aleo, fontSize: 12, lineHeight: '19px', color: 'rgba(64,45,43,0.9)' }}>Once a month you&rsquo;ll get a note at {letter.email || 'your inbox'} with three small questions. It always opens this private page, where your letter is waiting.</p>
      <div style={{ position: 'absolute', left: 515, top: 587, width: 410, height: 51, borderRadius: 50, background: '#fff', boxShadow: '0 0 0 5px ' + M.sky, display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px', boxSizing: 'border-box' }}>
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: M.alef, fontSize: 12, letterSpacing: '0.040em', color: M.navy }}>{checkinUrl}</span>
        <button onClick={copy} style={{ border: 0, background: 'transparent', cursor: 'pointer', fontFamily: M.alice, fontSize: 12, letterSpacing: '0.08em', color: copied ? '#4A7A4A' : 'rgba(15,60,102,0.6)' }}>{copied ? 'Copied' : 'Copy'}</button>
      </div>
      <a href={`/checkin/${token}`} style={{ position: 'absolute', left: 0, top: 700, width: 1440, textAlign: 'center', display: 'block', fontFamily: M.aleo, fontStyle: 'italic', fontSize: 12, color: 'rgba(15,60,102,0.7)', textDecoration: 'none' }}>Preview the monthly check-in page</a>
    </Stage>
  );
}
