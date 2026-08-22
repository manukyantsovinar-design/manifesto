import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/* Plain, warm, unhurried, no exclamation marks, no emoji — the voice rules
   from the design system's readme apply to the emails too. */
function checkinEmailHtml({ name, checkinUrl, unsubscribeUrl }) {
  return `
  <div style="background:#E9F4FF;padding:40px 16px;font-family:Georgia,'Times New Roman',serif;">
    <div style="max-width:480px;margin:0 auto;background:#F6F0E4;border-radius:6px;padding:40px 36px;box-shadow:0 10px 30px rgba(64,45,43,0.12);">
      <p style="margin:0 0 4px;font-size:13px;letter-spacing:0.06em;color:rgba(15,60,102,0.6);text-align:center;">Manifesto by Tsovinar Manukyan</p>
      <h1 style="margin:24px 0 16px;font-size:28px;font-weight:400;letter-spacing:0.02em;color:#402D2B;text-align:center;">Hello again, ${escapeHtml(name)}</h1>
      <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#402D2B;text-align:center;">It has been a month since you last checked in. Three small questions are waiting, and your letter is right where you left it.</p>
      <div style="text-align:center;margin:32px 0;">
        <a href="${checkinUrl}" style="display:inline-block;background:#0F3C66;color:#B8D7F4;text-decoration:none;padding:14px 32px;border-radius:50px;font-size:16px;letter-spacing:0.04em;">Answer your check-in</a>
      </div>
      <p style="margin:0;font-size:12px;line-height:1.6;color:rgba(64,45,43,0.7);text-align:center;">Takes about five honest minutes.</p>
      <p style="margin:32px 0 0;font-size:11px;line-height:1.6;color:rgba(64,45,43,0.5);text-align:center;">This lands in your inbox once a month. If you&rsquo;d rather not, <a href="${unsubscribeUrl}" style="color:rgba(15,60,102,0.6);">stop these reminders</a>.</p>
    </div>
  </div>`;
}

function escapeHtml(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export async function sendCheckinEmail({ to, name, checkinUrl, unsubscribeUrl }) {
  return resend.emails.send({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Three small questions',
    html: checkinEmailHtml({ name, checkinUrl, unsubscribeUrl })
  });
}
