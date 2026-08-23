import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import { sendConfirmationEmail } from '../../../lib/email';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

async function verifyTurnstile(token, ip) {
  if (!token) return false;
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY, response: token, remoteip: ip || '' })
  });
  const data = await res.json();
  return data.success === true;
}

export async function POST(req) {
  const body = await req.json();
  const { name, want, why, give, email, consent, turnstileToken } = body || {};

  if (!name?.trim() || !want?.trim() || !email || !/.+@.+\..+/.test(email)) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const humanVerified = await verifyTurnstile(turnstileToken, ip);
  if (!humanVerified) {
    return NextResponse.json({ error: 'Could not verify you’re not a robot. Please try again.' }, { status: 400 });
  }

  const nextEmailAt = new Date(Date.now() + THIRTY_DAYS_MS).toISOString();

  const { data, error } = await supabase
    .from('letters')
    .insert({
      name: name.trim(),
      email: email.trim(),
      want: want.trim(),
      why: (why || '').trim(),
      give: (give || '').trim(),
      consent: consent !== false,
      next_email_at: nextEmailAt
    })
    .select('id')
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: 'Could not seal the letter.' }, { status: 500 });
  }

  try {
    await sendConfirmationEmail({
      to: email.trim(),
      name: name.trim(),
      sealedUrl: `${process.env.SITE_URL}/sealed/${data.id}`
    });
  } catch (err) {
    console.error('Confirmation email failed to send', err);
  }

  return NextResponse.json({ token: data.id });
}
