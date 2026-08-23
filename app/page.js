'use client';

import { useRouter } from 'next/navigation';
import { M, Stage, Wordmark, Headline, Sub, Cta, useIsMobile } from './Shell';
import { MPage, MWordmark, MHeadline, MSub, MCta } from './Mobile';

export default function Landing() {
  const router = useRouter();
  const go = () => router.push('/write');
  const isMobile = useIsMobile();

  if (isMobile) {
    /* Same composition as desktop — note written on the card, seal on the
       envelope flap — reproduced as percentages of a wrapper locked to the
       envelope artwork's own aspect ratio, so it scales as one photo instead
       of needing separate pixel math per screen size. */
    return (
      <MPage>
        <MWordmark />
        <MHeadline>Write it Down</MHeadline>
        <MSub>Before it&rsquo;s gone</MSub>
        {/* Scaled up as a group on an unanimated wrapper — the envfloat
            animation lives one level in, since a CSS animation targeting
            `transform` would otherwise overwrite this static scale every
            frame. `overflow-x:hidden` on <body> makes bleeding past the
            screen edge safe: it clips instead of creating a scrollbar. */}
        <div style={{ transform: 'scale(1.32)', transformOrigin: 'center' }}>
          <div style={{ position: 'relative', width: 'calc(100% + 36px)', margin: '20px -18px 0', aspectRatio: '1011.647 / 878.522', animation: 'envfloat 9s ease-in-out infinite' }}>
            <img src={M.img + 'envelope-open-card.png'} alt="" style={{
              position: 'absolute', left: 0, top: 0, width: '86.9%', height: '80.05%',
              transform: 'translateX(17.5%) rotate(12.65deg)', transformOrigin: '0 0',
              filter: 'drop-shadow(5px 5px 20px rgba(0,0,0,0.25))'
            }} />
            <p style={{
              position: 'absolute', left: '33%', top: '33%', width: '40%', margin: 0, textAlign: 'center',
              fontFamily: M.hand, fontSize: 'clamp(10px, 3vw, 13px)', lineHeight: 1.25, letterSpacing: '0.04em',
              color: M.ink, textShadow: '1px 1px 2px rgba(245,245,245,0.49)'
            }}>Write down your crazy ideas and dreams here. I will make sure you follow through them...</p>
            <button onClick={go} title="Write my letter" style={{
              position: 'absolute', left: '51%', top: '59%', width: '13%', aspectRatio: '1',
              transform: 'translate(-50%, -50%)',
              padding: 0, border: 0, borderRadius: '50%', background: 'transparent', cursor: 'pointer'
            }}>
              <img src={M.img + 'wax-seal-sun.png'} alt="Press the seal to begin" style={{ display: 'block', width: '100%', height: '100%', animation: 'sunturn 80s linear infinite', filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.25))' }} />
            </button>
          </div>
        </div>
        <div style={{ marginTop: 32 }}>
          <MCta label="Write my letter" onClick={go} />
        </div>
      </MPage>
    );
  }

  return (
    <Stage height={1024}>
      <Wordmark />
      <Headline>Write it Down</Headline>
      <Sub top={218}>Before it&rsquo;s gone</Sub>
      <div style={{ position: 'absolute', left: 204, top: 167.871, width: 1011.647, height: 878.522, animation: 'envfloat 9s ease-in-out infinite' }}>
        <img src={M.img + 'envelope-open-card.png'} alt="" style={{ position: 'absolute', left: 0, top: 0, width: 879.135, height: 703.308, transform: 'matrix(0.976,0.219,-0.219,0.976,153.787,0)', transformOrigin: '0 0', filter: 'drop-shadow(5px 5px 20px rgba(0,0,0,0.25))' }} />
        <p style={{ position: 'absolute', left: 356, top: 278.129, width: 349, margin: 0, fontFamily: M.hand, fontSize: 22, lineHeight: '27px', letterSpacing: '0.080em', color: M.ink, textShadow: '1px 1px 2px rgba(245,245,245,0.49)' }}>Write down your crazy ideas and dreams here.<br />I will make sure you follow through them...</p>
        <button onClick={go} title="Write my letter" style={{ position: 'absolute', left: 471, top: 439.129, width: 114, height: 114, padding: 0, border: 0, borderRadius: '50%', background: 'transparent', cursor: 'pointer', transition: 'transform 400ms cubic-bezier(.2,1.4,.5,1)' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
          <img src={M.img + 'wax-seal-sun.png'} alt="Press the seal to begin" style={{ display: 'block', width: 114, height: 114, animation: 'sunturn 80s linear infinite', filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.25))' }} />
        </button>
      </div>
      <Cta label="Write my letter" left={602} top={893} onClick={go} />
    </Stage>
  );
}
