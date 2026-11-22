import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import SEO from '../components/SEO';
import PageHeader from '../components/ui/PageHeader';
import { useCompany } from '../context/CompanyContext';

const sections = [
  { id: 'controller', label: '1. Data Controller' },
  { id: 'collection', label: '2. Information We Collect' },
  { id: 'usage', label: '3. How We Use Your Data' },
  { id: 'security', label: '4. Infrastructure & Security' },
  { id: 'processors', label: '5. Third-Party Processors' },
  { id: 'cookies', label: '6. Cookies & Analytics' },
  { id: 'retention', label: '7. Data Retention' },
  { id: 'rights', label: '8. Your Rights & Contact' },
];

const PrivacyPolicy = () => {
  const { company: COMPANY, formatAddress } = useCompany();
  const effectiveYear = new Date().getFullYear();

  return (
    <div className="overflow-hidden">
      <SEO
        title={`Privacy Policy | ${COMPANY.legalName}`}
        description={`Understand how ${COMPANY.legalName} collects, processes, and protects your personal and enterprise data in compliance with the Kenya Data Protection Act, 2019.`}
        url="/privacy"
        image="/ncs.png"
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Privacy Policy', item: '/privacy' },
        ]}
      />

      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        description={`How ${COMPANY.legalName} collects, safeguards, and processes personal and client data under the Kenyan Data Protection Act (2019).`}
        breadcrumbs={[{ label: 'Privacy Policy' }]}
      />

      <section className="section bg-white">
        <div className="container-site grid lg:grid-cols-[260px_1fr] gap-12 items-start">
          {/* Sticky Table of Contents */}
          <aside className="hidden lg:block sticky top-28 space-y-6">
            <div className="card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-subtle mb-4">On this page</p>
              <nav aria-label="Privacy policy sections">
                <ul className="space-y-2.5 text-sm">
                  {sections.map((s) => (
                    <li key={s.id}>
                      <a href={`#${s.id}`} className="text-ink-muted hover:text-brand-rose transition-colors block">
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            <div className="card p-6 bg-brand-light/60">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-subtle mb-2">Data Requests</p>
              <p className="text-sm text-ink-muted mb-3">
                Exercise your rights under the Data Protection Act, 2019.
              </p>
              <a href={`mailto:${COMPANY.email}`} className="text-sm font-semibold text-brand-rose hover:underline">
                {COMPANY.email}
              </a>
            </div>
          </aside>

          {/* Main Policy Text */}
          <article className="prose-legal max-w-3xl">
            <div className="card p-6 md:p-8 bg-brand-light/70 border-l-4 border-l-brand-rose mb-10">
              <div className="flex items-start gap-4">
                <span className="icon-tile shrink-0">
                  <ShieldCheck size={20} />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-subtle">
                    Effective {effectiveYear} · Data Controller Notice
                  </p>
                  <p className="!mb-0 mt-1 text-sm text-ink-muted">
                    <strong>{COMPANY.legalName}</strong> (a {COMPANY.legalForm.toLowerCase()} incorporated in the{' '}
                    {COMPANY.jurisdiction}) is the Data Controller responsible for personal data collected through{' '}
                    <strong>{COMPANY.siteUrl.replace('https://', '')}</strong> and our client engagements, in compliance with the{' '}
                    <strong>Kenya Data Protection Act, 2019</strong>.
                  </p>
                </div>
              </div>
            </div>

            <h2 id="controller">1. Data Controller Identity</h2>
            <p>
              At <strong>{COMPANY.legalName}</strong> (&ldquo;the Company&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;), we treat data privacy and security as core engineering requirements. References in this policy to the Data Controller mean <strong>{COMPANY.legalName}</strong>, with its registered office at <strong>{formatAddress()}</strong>.
            </p>
            <p>
              Where we process end-user personal data on behalf of a client within custom software we develop or host, {COMPANY.legalName} acts as a Data Processor strictly in accordance with the client&rsquo;s documented instructions and applicable Data Processing Agreements.
            </p>

            <h2 id="collection">2. Information We Collect</h2>
            <ul>
              <li>
                <strong>Identity &amp; Contact Data:</strong> Full name, company name, job title, corporate email address, phone number, and correspondence sent via our contact, quote, careers, or newsletter forms.
              </li>
              <li>
                <strong>Technical &amp; Project Specifications:</strong> Business requirements, architectural documentation, and temporary environment credentials shared during project discovery, engineering, and support.
              </li>
              <li>
                <strong>Billing &amp; Transaction Data:</strong> Invoicing details, M-Pesa transaction reference codes, and store order records. <em>{COMPANY.legalName} does not process or store raw payment card numbers on its servers.</em>
              </li>
              <li>
                <strong>Usage &amp; Technical Logs:</strong> Browser type, device metadata, IP address, and aggregated page interaction metrics collected to secure and improve our website.
              </li>
            </ul>

            <h2 id="usage">3. How We Use Your Data &amp; Lawful Basis</h2>
            <p>
              We process personal data only where a lawful basis exists under the Kenya Data Protection Act, 2019 — including performance of a contract, compliance with legal obligations, legitimate business interests, or your explicit consent:
            </p>
            <ul>
              <li>Scoping, architecting, delivering, and supporting custom software, web, mobile, and branding projects.</li>
              <li>Issuing corporate quotations, agreements, statutory tax invoices, and processing verified payments.</li>
              <li>Responding to enquiries, recruitment applications, and technical support requests.</li>
              <li>Maintaining infrastructure security, preventing abuse (including bot protection), and complying with Kenyan statutory record-keeping requirements.</li>
            </ul>

            <h2 id="security">4. Infrastructure &amp; Security</h2>
            <p>
              {COMPANY.legalName} implements technical and organisational safeguards to protect personal and enterprise data against unauthorised access, alteration, or disclosure. Client credentials, API keys, and sensitive records are encrypted in transit (SSL/TLS) and at rest across vetted cloud environments (including AWS, Vercel, Firebase, and hardened VPS infrastructure) governed by role-based access controls.
            </p>

            <h2 id="processors">5. Third-Party Data Processors</h2>
            <p>
              To operate our website and deliver client solutions, we work with established third-party processors bound by strict data-protection commitments, including:
            </p>
            <ul>
              <li><strong>Payment Gateways:</strong> Safaricom Daraja (M-Pesa) and Paystack.</li>
              <li><strong>Communications &amp; Forms:</strong> Zoho Mail SMTP and communication APIs (such as Africa&rsquo;s Talking or Twilio where integrated).</li>
              <li><strong>Security &amp; Analytics:</strong> Google reCAPTCHA (spam and bot mitigation) and Google Analytics 4.</li>
            </ul>
            <p>
              We never sell or rent your personal information to third parties.
            </p>

            <h2 id="cookies">6. Cookies &amp; Analytics</h2>
            <p>
              Our website uses essential cookies (such as remembering your privacy banner preference and store cart state) as well as analytics cookies to understand site performance and visitor trends. You may manage or decline non-essential cookies via our privacy notice or your browser settings at any time.
            </p>

            <h2 id="retention">7. Data Retention</h2>
            <p>
              We retain personal data only for as long as necessary to fulfil the purposes for which it was collected, manage active client engagements, and comply with Kenyan statutory, tax, and accounting obligations (typically up to seven years for financial and contractual records).
            </p>

            <h2 id="rights">8. Your Data Rights &amp; Contacting Us</h2>
            <p>
              Under the Kenya Data Protection Act, 2019, you have the right to be informed of the use to which your personal data is put, to access personal data we hold about you, to object to processing, and to request correction or deletion of inaccurate or outdated data.
            </p>
            <p>
              To exercise any of these rights or raise a privacy concern, please contact the Data Protection Desk at <strong>{COMPANY.legalName}</strong>:
            </p>

            <div className="mt-8 pt-8 border-t border-line">
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-brand-rose mt-1 shrink-0" />
                  <div>
                    <p className="!mb-0 font-semibold text-ink">{COMPANY.legalName}</p>
                    <p className="!mb-0 text-ink-muted">Registered Office: {formatAddress()}</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="!mb-0 flex items-center gap-2">
                    <Mail size={15} className="text-brand-rose shrink-0" />
                    <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
                  </p>
                  <p className="!mb-0 flex items-center gap-2">
                    <Phone size={15} className="text-brand-rose shrink-0" />
                    <a href={COMPANY.phoneHref}>{COMPANY.phone}</a>
                  </p>
                </div>
              </div>
              <p className="mt-6 text-xs text-ink-subtle">
                See also our <Link to="/terms">Terms of Service</Link>.
              </p>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
