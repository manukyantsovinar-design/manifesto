import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

export async function POST(req, { params }) {
  const { token } = await params;
  const body = await req.json();
  const { moved, blocked, next_step } = body || {};

  if (!moved?.trim() || !blocked?.trim() || !next_step?.trim()) {
    return NextResponse.json({ error: 'Answer all three questions.' }, { status: 400 });
  }

  const { data: letter, error: letterErr } = await supabase
    .from('letters')
    .select('id')
    .eq('id', token)
    .single();

  if (letterErr || !letter) {
    return NextResponse.json({ error: 'Letter not found.' }, { status: 404 });
  }

  const { error } = await supabase.from('checkins').insert({
    letter_id: token,
    moved: moved.trim(),
    blocked: blocked.trim(),
    next_step: next_step.trim()
  });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: 'Could not save this check-in.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
