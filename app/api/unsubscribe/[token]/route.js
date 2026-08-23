import { supabase } from '../../../../lib/supabase';

export async function GET(req, { params }) {
  const { token } = await params;
  await supabase.from('letters').update({ consent: false }).eq('id', token);

  return new Response(
    `<!doctype html><html><head><meta charset="utf-8"><title>Unsubscribed</title></head>
     <body style="font-family:Georgia,serif;background:#E9F4FF;color:#402D2B;text-align:center;padding:80px 20px;">
       <p style="font-size:18px;">You won&rsquo;t get the monthly note anymore.</p>
       <p style="font-size:14px;color:rgba(64,45,43,0.7);">Your letter is still safe, if you ever want to come back to it.</p>
       <p style="margin-top:32px;"><a href="/" style="font-size:13px;letter-spacing:0.05em;color:rgba(15,60,102,0.7);text-decoration:underline;">Back to Manifesto</a></p>
     </body></html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}
