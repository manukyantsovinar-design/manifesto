import Link from 'next/link';
import { supabase } from '../../../lib/supabase';
import SealedClient from './SealedClient';

export default async function SealedPage({ params }) {
  const { token } = await params;
  const { data: letter } = await supabase
    .from('letters')
    .select('id, name, email, want, why, give, created_at')
    .eq('id', token)
    .single();

  if (!letter) {
    return (
      <div style={{ padding: 80, textAlign: 'center', fontFamily: 'Georgia, serif', color: '#402D2B' }}>
        <p>This letter could not be found.</p>
        <Link href="/" style={{ color: '#0F3C66' }}>Back to Manifesto</Link>
      </div>
    );
  }

  return <SealedClient letter={letter} token={token} />;
}
