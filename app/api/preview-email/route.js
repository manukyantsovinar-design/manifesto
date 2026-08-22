import { previewHtml } from '../../../lib/email';

/* Visual preview only — renders the email HTML in a browser tab so the
   design can be checked without waiting on real delivery. Some email
   clients (Gmail especially) render HTML/CSS more strictly than a browser,
   so treat this as a design check, not a final render test. */
export async function GET(req) {
  const type = new URL(req.url).searchParams.get('type') === 'confirmation' ? 'confirmation' : 'checkin';
  return new Response(previewHtml(type), { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
