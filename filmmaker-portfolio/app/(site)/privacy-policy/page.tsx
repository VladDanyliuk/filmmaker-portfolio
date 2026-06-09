import type { Metadata } from 'next'
import { RevealOnScroll } from '@/components/motion/RevealOnScroll'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for this videographer portfolio website.',
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="pt-32 md:pt-40 pb-16 md:pb-20 border-b border-glass">
        <div className="container mx-auto px-6 md:px-10">
          <RevealOnScroll>
            <p className="text-xs uppercase tracking-widest text-accent-orange mb-4">Legal</p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight max-w-3xl">
              Privacy Policy
            </h1>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <p className="mt-6 text-text-secondary text-sm">
              Last updated: May 2025
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto px-6 md:px-10 max-w-3xl">
          <div className="space-y-10 text-text-secondary text-sm leading-relaxed">

            <RevealOnScroll>
              <div className="space-y-4">
                <h2 className="font-display text-xl md:text-2xl font-medium tracking-tight text-text-primary">
                  1. Who We Are
                </h2>
                <p>
                  This website is operated by a London-based videographer and cinematographer. If you have
                  any questions about this privacy policy or how your data is handled, you can contact
                  us via the contact form on this site.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll>
              <div className="space-y-4">
                <h2 className="font-display text-xl md:text-2xl font-medium tracking-tight text-text-primary">
                  2. What Data We Collect
                </h2>
                <p>
                  We only collect data that you voluntarily provide through the contact form on this
                  website. This includes:
                </p>
                <ul className="list-disc list-inside space-y-2 pl-2">
                  <li>Your name</li>
                  <li>Your email address</li>
                  <li>Project type (optional)</li>
                  <li>Your message</li>
                </ul>
                <p>
                  We do not collect any data automatically beyond what is described in the Cookies
                  section below.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll>
              <div className="space-y-4">
                <h2 className="font-display text-xl md:text-2xl font-medium tracking-tight text-text-primary">
                  3. How We Use Your Data
                </h2>
                <p>
                  Information submitted via the contact form is used solely to respond to your inquiry.
                  We do not sell, rent, or share your personal data with third parties for marketing
                  purposes.
                </p>
                <p>
                  Contact form submissions are processed by{' '}
                  <a
                    href="https://resend.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-primary underline underline-offset-2 hover:text-accent-orange transition-colors duration-200"
                  >
                    Resend
                  </a>
                  , a third-party email delivery service, in order to send you a confirmation and to
                  notify us of your inquiry. Please refer to Resend's privacy policy for details on
                  how they handle data.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll>
              <div className="space-y-4">
                <h2 className="font-display text-xl md:text-2xl font-medium tracking-tight text-text-primary">
                  4. Cookies
                </h2>
                <p>
                  This website uses cookies to improve your browsing experience. A cookie is a small
                  text file stored on your device by your browser.
                </p>
                <p>We use the following types of cookies:</p>
                <ul className="list-disc list-inside space-y-2 pl-2">
                  <li>
                    <span className="text-text-primary">Essential cookies</span> — necessary for the
                    website to function correctly. These cannot be disabled.
                  </li>
                  <li>
                    <span className="text-text-primary">Analytics cookies</span> — used to understand
                    how visitors interact with the website (e.g. pages visited, time spent). These are
                    only set if you have given your consent.
                  </li>
                </ul>
                <p>
                  Your cookie preference is stored locally in your browser under the key{' '}
                  <code className="text-accent-orange bg-bg-secondary px-1.5 py-0.5 rounded-sm text-xs">
                    cookie-consent
                  </code>
                  . No consent data is sent to any server. You can change your preference at any time
                  by clearing your browser's local storage.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll>
              <div className="space-y-4">
                <h2 className="font-display text-xl md:text-2xl font-medium tracking-tight text-text-primary">
                  5. Data Retention
                </h2>
                <p>
                  We retain contact form submissions only as long as necessary to respond to your
                  inquiry. We do not maintain a database of submissions beyond the email correspondence
                  initiated by your contact.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll>
              <div className="space-y-4">
                <h2 className="font-display text-xl md:text-2xl font-medium tracking-tight text-text-primary">
                  6. Your Rights
                </h2>
                <p>
                  Under the UK GDPR and the Data Protection Act 2018, you have the right to:
                </p>
                <ul className="list-disc list-inside space-y-2 pl-2">
                  <li>Access the personal data we hold about you</li>
                  <li>Request correction of inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Object to processing of your data</li>
                  <li>Withdraw consent at any time</li>
                </ul>
                <p>
                  To exercise any of these rights, please contact us via the{' '}
                  <a
                    href="/contact"
                    className="text-text-primary underline underline-offset-2 hover:text-accent-orange transition-colors duration-200"
                  >
                    contact form
                  </a>
                  .
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll>
              <div className="space-y-4">
                <h2 className="font-display text-xl md:text-2xl font-medium tracking-tight text-text-primary">
                  7. Third-Party Links
                </h2>
                <p>
                  This website may contain links to external sites (e.g. Vimeo, Instagram). We are not
                  responsible for the privacy practices or content of those sites and encourage you to
                  review their privacy policies.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll>
              <div className="space-y-4">
                <h2 className="font-display text-xl md:text-2xl font-medium tracking-tight text-text-primary">
                  8. Changes to This Policy
                </h2>
                <p>
                  We may update this privacy policy from time to time. Any changes will be posted on
                  this page with an updated date. Continued use of this website after any changes
                  constitutes acceptance of the updated policy.
                </p>
              </div>
            </RevealOnScroll>

          </div>
        </div>
      </section>
    </>
  )
}
