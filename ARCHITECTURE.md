# Stack architecture

How Vercel, Supabase, and Resend fit together for this project. See [README.md](README.md) for setup/env vars.

```mermaid
flowchart TD
    subgraph GH["GitHub"]
        repo["manukyantsovinar-design/manifesto<br/>(main branch)"]
    end

    subgraph VC["Vercel — hosting + scheduler"]
        deploy["Next.js app<br/>(auto-deployed on push to main)"]
        cron["Vercel Cron<br/>vercel.json → 0 13 * * * (daily, 13:00 UTC)"]
        letters_api["POST /api/letters<br/>(write a letter)"]
        checkin_api["POST /api/checkin/:token<br/>(answer 3 questions)"]
        cron_api["GET /api/cron/send-emails<br/>(Bearer CRON_SECRET)"]
        unsub_api["GET /api/unsubscribe/:token"]
    end

    subgraph SB["Supabase — database only"]
        letters[("letters table<br/>id, name, email, want/why/give,<br/>consent, next_email_at")]
        checkins[("checkins table<br/>letter_id, moved, blocked, next_step")]
    end

    subgraph RS["Resend — email delivery"]
        send_conf["send: 'Your letter is sealed'"]
        send_checkin["send: 'Three small questions'"]
    end

    user(("Visitor"))

    repo -->|git push triggers deploy| deploy

    user -->|fills out /write| letters_api
    letters_api -->|insert row, next_email_at = now + 30d| letters
    letters_api -->|call Resend API| send_conf
    send_conf -->|email with link to /sealed/:token| user

    cron -->|hits daily| cron_api
    cron_api -->|select where next_email_at is due and consent is true| letters
    cron_api -->|call Resend API, one per due letter| send_checkin
    send_checkin -->|email with link to /checkin/:token| user
    cron_api -->|update next_email_at += 30d| letters

    user -->|opens /checkin/:token, submits answers| checkin_api
    checkin_api -->|verify letter exists| letters
    checkin_api -->|insert row| checkins

    user -->|clicks 'stop reminders' in email| unsub_api
    unsub_api -->|update consent = false| letters

    deploy -.->|reads/writes via service role key| letters
    deploy -.->|reads/writes via service role key| checkins
```

## What each service does

- **Vercel** — hosts the Next.js app and its API routes, redeploys automatically on every push to `main`, and runs the daily cron job (`vercel.json`) that drives the 30-day email cycle. All secrets (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `EMAIL_FROM`, `SITE_URL`, `CRON_SECRET`) live in Vercel → Project → Settings → Environment Variables.
- **Supabase** — Postgres database only, nothing else. Two tables: `letters` (one row per person, tracks `next_email_at` for the 30-day cycle and `consent` for unsubscribes) and `checkins` (one row per monthly answer, foreign-keyed to `letters`). Row-level security is on with zero policies — the app only ever reaches it server-side with the `service_role` key, so it's unreachable directly from a browser.
- **Resend** — the actual email sender. Two templates: the immediate "Your letter is sealed" confirmation (sent from `/api/letters`) and the monthly "Three small questions" check-in (sent from the cron route). Free tier: 100 emails/day, 3,000/month.

## The two triggers that move data

1. **Someone writes a letter** → `/api/letters` inserts into `letters` with `next_email_at` set 30 days out, then immediately asks Resend to send the confirmation email.
2. **Vercel Cron fires once a day** → `/api/cron/send-emails` asks Supabase who's overdue, asks Resend to email each of them, then pushes their `next_email_at` forward another 30 days. This repeats indefinitely and doesn't depend on anyone actually answering a given month's check-in.
