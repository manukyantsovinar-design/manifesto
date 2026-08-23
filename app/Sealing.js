'use client';

import { useEffect, useState } from 'react';
import { M, Stage, Wordmark, Headline, useIsMobile } from './Shell';
import { MPage, MWordmark, MHeadline } from './Mobile';

/* The sealing ceremony as a cross-fade: the open envelope with the blue card
   dissolves into the card slipping further in, then into the closed envelope,
   and finally the wax seal fades up on top. */
const FRAMES = [
  { src: 'envelope-open.png', left: 259, top: 209, width: 866 },
  { src: 'envelope-closing.png', left: 402, top: 204, width: 598 },
  { src: 'envelope-closed.png', left: 457, top: 396, width: 578 }
];

const CUES = [0, 800, 1600];
const SEAL_AT = 2200;
const LEAVE_AT = 3100;
const FADE = 650;

export default function Sealing({ onDone }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    const timers = CUES.slice(1).concat([SEAL_AT]).map(ms => setTimeout(() => setT(ms), ms));
    timers.push(setTimeout(() => onDone && onDone(), LEAVE_AT));
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  const shown = CUES.reduce((acc, c, i) => (t >= c ? i : acc), 0);
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <MPage>
        <MWordmark />
        <MHeadline>Almost there...</MHeadline>
        <div style={{ position: 'relative', width: '100%', maxWidth: 300, aspectRatio: '1', margin: '32px auto 0' }}>
          {FRAMES.map((f, i) => (
            <img key={f.src} src={M.img + f.src} alt="" style={{
              position: 'absolute', left: '50%', top: '50%', width: '90%', height: 'auto',
              transform: 'translate(-50%,-50%)',
              filter: 'drop-shadow(5px 8px 20px rgba(0,0,0,0.22))',
              opacity: i === shown ? 1 : 0,
              transition: 'opacity ' + (i === shown ? 320 : FADE) + 'ms ease-out'
            }} />
          ))}
          <img src={M.img + 'wax-seal-sun.png'} alt="" style={{
            position: 'absolute', left: '50%', top: '50%', width: '32%', height: 'auto',
            transform: 'translate(-50%,-50%) scale(' + (t >= SEAL_AT ? 1 : 0.9) + ')',
            filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.25))',
            opacity: t >= SEAL_AT ? 1 : 0,
            transition: 'opacity 260ms ease-out, transform 320ms ease-out'
          }} />
        </div>
      </MPage>
    );
  }

  return (
    <Stage height={1024}>
      <Wordmark />
      <Headline>Almost there...</Headline>
      {FRAMES.map((f, i) => (
        <img key={f.src} src={M.img + f.src} alt="" style={{
          position: 'absolute', left: f.left, top: f.top, width: f.width, height: 'auto',
          filter: 'drop-shadow(5px 8px 20px rgba(0,0,0,0.22))',
          opacity: i === shown ? 1 : 0,
          transition: 'opacity ' + (i === shown ? 320 : FADE) + 'ms ease-out'
        }} />
      ))}
      <img src={M.img + 'wax-seal-sun.png'} alt="" style={{
        position: 'absolute', left: 687, top: 607, width: 114, height: 114,
        filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.25))',
        opacity: t >= SEAL_AT ? 1 : 0,
        transform: 'scale(' + (t >= SEAL_AT ? 1 : 0.9) + ')',
        transition: 'opacity 260ms ease-out, transform 320ms ease-out'
      }} />
    </Stage>
  );
}
