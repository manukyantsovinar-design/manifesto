import Link from 'next/link';
import { supabase } from '../../../lib/supabase';
import CheckInClient from './CheckInClient';

export default async function CheckInPage({ params }) {
  const { token } = await params;

  const { data: letter } = await supabase
    .from('letters')
    .select('id, name, email, want, why, give, created_at')
    .eq('id', token)
    .single();

  if (!letter) {
    return (
      <div style={{ padding: 80, textAlign: 'center', fontFamily: 'Georgia, serif', color: '#402D2B' }}>
        <p>This check-in link is not valid.</p>
        <Link href="/" style={{ color: '#0F3C66' }}>Back to Manifesto</Link>
      </div>
    );
  }

  const { data: checkins } = await supabase
    .from('checkins')
    .select('id, moved, blocked, next_step, created_at')
    .eq('letter_id', token)
    .order('created_at', { ascending: false });

  return <CheckInClient letter={letter} checkins={checkins || []} token={token} />;
}
