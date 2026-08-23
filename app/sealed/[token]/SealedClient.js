'use client';

import { useEffect, useState } from 'react';
import { M, Stage, Wordmark, Headline, Sub, Cta, useIsMobile } from '../../Shell';
import { MPage, MWordmark, MHeadline, MSub, MCta } from '../../Mobile';

function escapeHtml(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

/* Renders the letter into an offscreen sheet, rasterizes it, and saves a
   real PDF file directly — no print dialog, no new tab. */
async function downloadLetterPdf(letter) {
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import('jspdf'),
    import('html2canvas')
  ]);

  const rows = [
    ['This is what I want', letter.want],
    ['This is why I want it', letter.why],
    ['This is what I am willing to give', letter.give]
  ].map(([t, v]) =>
    '<h2 style="font-family:Alice,serif;font-weight:400;font-size:17px;letter-spacing:.06em;color:#0F3C66;margin:0 0 8px;">' + t + '</h2>' +
    '<p style="font-family:Freehand,cursive;font-size:22px;line-height:1.6;letter-spacing:.08em;white-space:pre-wrap;margin:0 0 38px;color:#402D2B;">' + escapeHtml(v) + '</p>'
  ).join('');

  const sheet = document.createElement('div');
  sheet.style.cssText = 'position:fixed;left:-9999px;top:0;width:794px;box-sizing:border-box;padding:75px 68px;background:#F6F0E4;color:#402D2B;';
  sheet.innerHTML =
    '<p style="font-family:Alice,serif;font-size:14px;color:rgba(15,60,102,.6);text-align:center;margin:0 0 40px;">Manifesto by Tsovinar Manukyan</p>' +
    '<h1 style="font-family:Freehand,cursive;font-weight:400;font-size:44px;letter-spacing:.06em;margin:0 0 34px;color:#402D2B;">Dear ' + escapeHtml(letter.name) + '</h1>' +
    rows +
    '<p style="font-family:Aleo,serif;font-style:italic;font-size:13px;color:rgba(64,45,43,.75);margin-top:24px;">Sealed ' + new Date(letter.created_at).toLocaleDateString() + '</p>';
  document.body.appendChild(sheet);

  try {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    const canvas = await html2canvas(sheet, { scale: 2, backgroundColor: '#F6F0E4' });

    const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const imgData = canvas.toDataURL('image/png');
    const imgW = pageW;
    const imgH = (canvas.height * imgW) / canvas.width;

    let heightLeft = imgH;
    let position = 0;
    pdf.addImage(imgData, 'PNG', 0, position, imgW, imgH);
    heightLeft -= pageH;
    while (heightLeft > 0) {
      position -= pageH;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgW, imgH);
      heightLeft -= pageH;
    }

    const slug = (letter.name || 'me').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    pdf.save(`manifesto-letter-${slug || 'me'}.pdf`);
  } finally {
    document.body.removeChild(sheet);
  }
}

export default function SealedClient({ letter, token }) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [checkinUrl, setCheckinUrl] = useState(`/checkin/${token}`);
  useEffect(() => setCheckinUrl(`${window.location.origin}/checkin/${token}`), [token]);

  const copy = () => {
    navigator.clipboard && navigator.clipboard.writeText(checkinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const download = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      await downloadLetterPdf(letter);
    } finally {
      setDownloading(false);
    }
  };

  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <MPage>
        <MWordmark />
        <MHeadline>It is sealed!</MHeadline>
        <MSub>Your letter is safe. Download it, print it if you like, and put it somewhere your eyes go every morning. I believe in you!</MSub>
        <div style={{ marginBottom: 28 }}>
          <MCta label={downloading ? 'Preparing your PDF…' : 'Download your letter'} onClick={download} disabled={downloading} />
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
      <Sub top={218} width={700}>Your letter is safe.<br />Download it, print it if you like, and put it somewhere your eyes go every morning. I believe in you!</Sub>
      <Cta label={downloading ? 'Preparing your PDF…' : 'Download your letter'} left={527} top={372} width={386} onClick={download} disabled={downloading} />
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
