import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* Shared paper-card shell every email sits on. Plain, warm, unhurried, no
   exclamation marks, no emoji — the voice rules from the design system's
   readme apply to the emails too. */
function shell(bodyHtml) {
  const sealUrl = `${process.env.SITE_URL}/imagery/wax-seal-sun.png`;
  return `
  <div style="background:#E9F4FF;padding:40px 16px;font-family:Georgia,'Times New Roman',serif;">
    <div style="max-width:480px;margin:0 auto;background:#F6F0E4;border-radius:6px;padding:40px 36px;box-shadow:0 10px 30px rgba(64,45,43,0.12);">
      <img src="${sealUrl}" width="40" height="40" alt="" style="display:block;margin:0 auto 12px;" />
      <p style="margin:0 0 4px;font-size:13px;letter-spacing:0.06em;color:rgba(15,60,102,0.6);text-align:center;">Manifesto by Tsovinar Manukyan</p>
      ${bodyHtml}
      <p style="margin:24px 0 0;font-size:10px;line-height:1.5;color:rgba(64,45,43,0.45);text-align:center;">This is an automated message &mdash; please don&rsquo;t reply.</p>
    </div>
  </div>`;
}

function confirmationEmailHtml({ name, sealedUrl }) {
  return shell(`
    <h1 style="margin:24px 0 16px;font-size:28px;font-weight:400;letter-spacing:0.02em;color:#402D2B;text-align:center;">Your letter is sealed, ${escapeHtml(name)}</h1>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#402D2B;text-align:center;">It&rsquo;s kept safe. In about 30 days a note will land here with three small questions and a link back to it &mdash; this email is just so you always have that link, even if you lose the tab.</p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${sealedUrl}" style="display:inline-block;background:#0F3C66;color:#B8D7F4;text-decoration:none;padding:14px 32px;border-radius:50px;font-size:16px;letter-spacing:0.04em;">View your sealed letter</a>
    </div>
    <p style="margin:0;font-size:11px;line-height:1.6;color:rgba(64,45,43,0.6);text-align:center;">Nothing is shared. This letter is only yours.</p>
  `);
}

function checkinEmailHtml({ name, checkinUrl, unsubscribeUrl }) {
  return shell(`
    <h1 style="margin:24px 0 16px;font-size:28px;font-weight:400;letter-spacing:0.02em;color:#402D2B;text-align:center;">Hello again, ${escapeHtml(name)}</h1>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#402D2B;text-align:center;">It has been a month since you last checked in. Three small questions are waiting, and your letter is right where you left it.</p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${checkinUrl}" style="display:inline-block;background:#0F3C66;color:#B8D7F4;text-decoration:none;padding:14px 32px;border-radius:50px;font-size:16px;letter-spacing:0.04em;">Answer your check-in</a>
    </div>
    <p style="margin:0;font-size:12px;line-height:1.6;color:rgba(64,45,43,0.7);text-align:center;">Takes about five honest minutes.</p>
    <p style="margin:32px 0 0;font-size:11px;line-height:1.6;color:rgba(64,45,43,0.5);text-align:center;">This lands in your inbox once a month. If you&rsquo;d rather not, <a href="${unsubscribeUrl}" style="color:rgba(15,60,102,0.6);">stop these reminders</a>.</p>
  `);
}

export async function sendConfirmationEmail({ to, name, sealedUrl }) {
  return resend.emails.send({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Your letter is sealed',
    html: confirmationEmailHtml({ name, sealedUrl })
  });
}

export async function sendCheckinEmail({ to, name, checkinUrl, unsubscribeUrl }) {
  return resend.emails.send({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Three small questions',
    html: checkinEmailHtml({ name, checkinUrl, unsubscribeUrl })
  });
}

export function previewHtml(type) {
  if (type === 'confirmation') {
    return confirmationEmailHtml({ name: 'Tsovinar', sealedUrl: `${process.env.SITE_URL}/sealed/preview` });
  }
  return checkinEmailHtml({
    name: 'Tsovinar',
    checkinUrl: `${process.env.SITE_URL}/checkin/preview`,
    unsubscribeUrl: `${process.env.SITE_URL}/api/unsubscribe/preview`
  });
}
