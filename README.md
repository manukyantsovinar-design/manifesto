# Manifesto

Write a short letter to yourself. Once a month, an email brings you back to reread it and answer three questions about it.

## Local setup

```bash
npm install
cp .env.example .env.local
# fill in .env.local with real values (see below)
npm run dev
```

## Environment variables

| Variable | Where to get it |
| --- | --- |
| `SUPABASE_URL` | Supabase project → Settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase project → Settings → API → `service_role` secret key |
| `RESEND_API_KEY` | Resend → API Keys |
| `EMAIL_FROM` | e.g. `Manifesto <letters@yourdomain>` — the address must be on a domain verified in Resend |
| `SITE_URL` | The site's public URL, e.g. `https://manifesto.yourdomain.com` |
| `CRON_SECRET` | Any random string you generate — protects the email-sending endpoint |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare → Turnstile → Add site → copy the "Site Key" |
| `TURNSTILE_SECRET_KEY` | Same Turnstile site → copy the "Secret Key" |

## Database

Run `supabase-schema.sql` once in the Supabase project's SQL editor (Dashboard → SQL Editor → paste → Run).

## Deploying

1. Push this folder to a GitHub repo.
2. Import the repo in Vercel.
3. Add all the environment variables above in Vercel → Project → Settings → Environment Variables.
4. Deploy.
5. Vercel Cron (configured in `vercel.json`) hits `/api/cron/send-emails` daily and sends the monthly check-in email to anyone whose 30 days are up.

## How the 30-day cycle works

- Sealing a letter sets `next_email_at` to 30 days from signup.
- Every day, the cron job finds letters whose `next_email_at` has passed, emails them a link to their private check-in page, and pushes `next_email_at` forward by another 30 days.
- The check-in page always shows the original letter plus every past check-in, then three new questions.
- This repeats indefinitely, independent of whether someone actually answers a given month's check-in.
