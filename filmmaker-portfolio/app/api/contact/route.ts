import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const WINDOW_MS = 15 * 60 * 1000
const MAX_REQUESTS = 3

// ── Rate limiting ──────────────────────────────────────────────────────────
// Durable, cross-instance rate limiting via Upstash Redis. Required in
// production: the previous in-memory Map reset on every Vercel cold start and
// was not shared across serverless instances, so it provided no real limit.
//
// Configure via env vars (see .env.local.example). These are provisioned
// automatically by the Vercel Marketplace Upstash Redis integration:
//   KV_REST_API_URL, KV_REST_API_TOKEN
//
// If those are absent (e.g. local dev), we fall back to a best-effort in-memory
// limiter so the form still works locally — but that fallback is NOT durable
// and must not be relied on in production.
const redisUrl = process.env.KV_REST_API_URL
const redisToken = process.env.KV_REST_API_TOKEN

const ratelimit =
  redisUrl && redisToken
    ? new Ratelimit({
        redis: new Redis({ url: redisUrl, token: redisToken }),
        limiter: Ratelimit.slidingWindow(MAX_REQUESTS, '15 m'),
        prefix: 'contact-form',
        analytics: false,
      })
    : null

const memoryMap = new Map<string, number[]>()

function isRateLimitedInMemory(ip: string): boolean {
  const now = Date.now()
  const timestamps = (memoryMap.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  if (timestamps.length >= MAX_REQUESTS) return true
  timestamps.push(now)
  memoryMap.set(ip, timestamps)
  return false
}

async function isRateLimited(ip: string): Promise<boolean> {
  if (ratelimit) {
    const { success } = await ratelimit.limit(ip)
    return !success
  }
  if (process.env.NODE_ENV === 'production') {
    console.warn(
      '[contact] KV_REST_API_URL/KV_REST_API_TOKEN missing — rate limiting is in-memory only and not durable.'
    )
  }
  return isRateLimitedInMemory(ip)
}

// ── Input validation ───────────────────────────────────────────────────────
// Format validation is the minimum bar for a public contact form: it blocks
// malformed addresses and the most common throwaway/spam domains before we ask
// Resend to send anything. Full ownership verification (double opt-in) is out
// of scope here — a confirmation email to an unverified address is acceptable
// for a contact form, but only once the address is at least well-formed.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Common disposable / throwaway email providers. Not exhaustive — a best-effort
// inline blocklist that needs no external API call.
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  'guerrillamail.com',
  'guerrillamail.info',
  'sharklasers.com',
  '10minutemail.com',
  'tempmail.com',
  'temp-mail.org',
  'throwawaymail.com',
  'yopmail.com',
  'getnada.com',
  'trashmail.com',
  'dispostable.com',
  'maildrop.cc',
  'fakeinbox.com',
  'mailnesia.com',
  'mohmal.com',
  'emailondeck.com',
  'spam4.me',
])

function isValidEmail(email: string): boolean {
  if (email.length > 254) return false
  if (!EMAIL_REGEX.test(email)) return false
  const domain = email.split('@')[1]?.toLowerCase()
  if (!domain || DISPOSABLE_DOMAINS.has(domain)) return false
  return true
}

function userConfirmationHtml(name: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Message Received</title>
</head>
<body style="margin:0;padding:0;background:#0B0B0D;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0B0B0D;padding:48px 24px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:560px;background:#151518;border:1px solid rgba(255,255,255,0.08);border-radius:4px;overflow:hidden;">
          <tr>
            <td style="padding:40px 40px 32px;border-bottom:1px solid rgba(255,255,255,0.08);">
              <span style="font-size:22px;font-weight:600;color:#F5F5F2;letter-spacing:-0.02em;">AD<span style="color:#FF8A3D;">.</span></span>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 24px;font-size:13px;text-transform:uppercase;letter-spacing:0.15em;color:#A1A1AA;">Inquiry Received</p>
              <h1 style="margin:0 0 16px;font-size:28px;font-weight:500;color:#F5F5F2;letter-spacing:-0.02em;line-height:1.1;">Thank you, ${name}.</h1>
              <p style="margin:0 0 24px;font-size:15px;color:#A1A1AA;line-height:1.6;">Your message has been received. I'll review the details and get back to you within 24 hours.</p>
              <p style="margin:0;font-size:15px;color:#A1A1AA;line-height:1.6;">In the meantime, feel free to explore my work or reach out directly if anything is urgent.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px;border-top:1px solid rgba(255,255,255,0.08);">
              <p style="margin:0;font-size:12px;color:rgba(161,161,170,0.6);">London-based videographer. Available worldwide.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function adminNotificationHtml(data: {
  name: string
  email: string
  projectType: string
  message: string
}): string {
  const projectLabel = data.projectType
    ? data.projectType.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : '—'

  // Escape HTML entities in user-supplied content
  const escape = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Inquiry</title>
</head>
<body style="margin:0;padding:0;background:#0B0B0D;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0B0B0D;padding:48px 24px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:560px;background:#151518;border:1px solid rgba(255,255,255,0.08);border-radius:4px;overflow:hidden;">
          <tr>
            <td style="padding:32px 40px;border-bottom:1px solid rgba(255,255,255,0.08);">
              <p style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:0.15em;color:#FF8A3D;">New Inquiry</p>
              <h1 style="margin:0;font-size:22px;font-weight:500;color:#F5F5F2;letter-spacing:-0.02em;">Portfolio Contact Form</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom:20px;vertical-align:top;width:120px;">
                    <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#A1A1AA;">Name</p>
                  </td>
                  <td style="padding-bottom:20px;vertical-align:top;">
                    <p style="margin:0;font-size:15px;color:#F5F5F2;">${escape(data.name)}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:20px;vertical-align:top;">
                    <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#A1A1AA;">Email</p>
                  </td>
                  <td style="padding-bottom:20px;vertical-align:top;">
                    <a href="mailto:${escape(data.email)}" style="color:#FF8A3D;text-decoration:none;font-size:15px;">${escape(data.email)}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:20px;vertical-align:top;">
                    <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#A1A1AA;">Project</p>
                  </td>
                  <td style="padding-bottom:20px;vertical-align:top;">
                    <p style="margin:0;font-size:15px;color:#F5F5F2;">${escape(projectLabel)}</p>
                  </td>
                </tr>
                <tr>
                  <td style="vertical-align:top;">
                    <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#A1A1AA;">Message</p>
                  </td>
                  <td style="vertical-align:top;">
                    <p style="margin:0;font-size:15px;color:#F5F5F2;line-height:1.6;white-space:pre-wrap;">${escape(data.message)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.08);">
              <a href="mailto:${escape(data.email)}" style="display:inline-block;padding:10px 24px;background:#FF8A3D;color:#0B0B0D;font-size:13px;font-weight:500;text-decoration:none;border-radius:9999px;">Reply to ${escape(data.name)}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
    if (await isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const apiKey = process.env.RESEND_API_KEY
    const adminEmail = process.env.ADMIN_EMAIL
    const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev'

    if (!apiKey) {
      console.error('RESEND_API_KEY env var is not set')
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
    }

    if (!adminEmail) {
      console.error('ADMIN_EMAIL env var is not set')
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
    }

    const resend = new Resend(apiKey)

    const body = await request.json()
    const { name, email, projectType, message, website } = body as {
      name?: string
      email?: string
      projectType?: string
      message?: string
      website?: string
    }

    if (website) {
      return NextResponse.json({ success: true })
    }

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate email format before sending anything. This prevents the form
    // from being used to fire confirmation emails at malformed/throwaway
    // addresses and from injecting junk into the admin notification + mailto links.
    if (!isValidEmail(email.trim())) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const [confirmation, notification] = await Promise.all([
      resend.emails.send({
        from: fromEmail,
        to: email.trim(),
        subject: 'Your inquiry has been received',
        html: userConfirmationHtml(name.trim()),
      }),
      resend.emails.send({
        from: fromEmail,
        to: adminEmail,
        subject: `New inquiry from ${name.trim()}`,
        html: adminNotificationHtml({
          name: name.trim(),
          email: email.trim(),
          projectType: projectType?.trim() ?? '',
          message: message.trim(),
        }),
      }),
    ])

    if (confirmation.error || notification.error) {
      console.error('Resend error:', confirmation.error ?? notification.error)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
