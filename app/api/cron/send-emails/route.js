import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';
import { sendCheckinEmail } from '../../../../lib/email';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

function authorized(req) {
  const auth = req.headers.get('authorization') || '';
  return auth === `Bearer ${process.env.CRON_SECRET}`;
}

export async function GET(req) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date().toISOString();
  const { data: due, error } = await supabase
    .from('letters')
    .select('id, name, email, next_email_at')
    .lte('next_email_at', now)
    .eq('consent', true);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: 'Could not load due letters.' }, { status: 500 });
  }

  const results = [];
  for (const letter of due || []) {
    const checkinUrl = `${process.env.SITE_URL}/checkin/${letter.id}`;
    const unsubscribeUrl = `${process.env.SITE_URL}/api/unsubscribe/${letter.id}`;
    try {
      await sendCheckinEmail({ to: letter.email, name: letter.name, checkinUrl, unsubscribeUrl });
      const nextEmailAt = new Date(new Date(letter.next_email_at).getTime() + THIRTY_DAYS_MS).toISOString();
      await supabase.from('letters').update({ next_email_at: nextEmailAt }).eq('id', letter.id);
      results.push({ id: letter.id, sent: true });
    } catch (err) {
      console.error('Failed to email letter', letter.id, err);
      results.push({ id: letter.id, sent: false });
    }
  }

  return NextResponse.json({ processed: results.length, results });
}
