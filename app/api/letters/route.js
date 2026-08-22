import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export async function POST(req) {
  const body = await req.json();
  const { name, want, why, give, email, consent } = body || {};

  if (!name?.trim() || !want?.trim() || !email || !/.+@.+\..+/.test(email)) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
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

  return NextResponse.json({ token: data.id });
}
