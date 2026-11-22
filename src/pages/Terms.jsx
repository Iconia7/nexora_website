import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin } from 'lucide-react';
import SEO from '../components/SEO';
import PageHeader from '../components/ui/PageHeader';
import { useCompany } from '../context/CompanyContext';

const sections = [
  { id: 'contracting-entity', label: '1. Contracting Entity' },
  { id: 'scope', label: '2. Scope of Work & Services' },
  { id: 'payments', label: '3. Payments & Billing' },
  { id: 'intellectual-property', label: '4. Intellectual Property Rights' },
  { id: 'hosting', label: '5. Hosting, APIs & Maintenance' },
  { id: 'confidentiality', label: '6. Confidentiality' },
  { id: 'liability', label: '7. Limitation of Liability' },
  { id: 'termination', label: '8. Termination' },
  { id: 'governing-law', label: '9. Governing Law & Jurisdiction' },
];

const Terms = () => {
  const { company: COMPANY, formatAddress } = useCompany();
  const effectiveYear = new Date().getFullYear();

  return (
    <div className="overflow-hidden">
      <SEO
        title={`Terms of Service | ${COMPANY.legalName}`}
        description={`Read the Terms of Service governing engagements, software engineering, web design and digital services provided by ${COMPANY.legalName}.`}
        url="/terms"
        image="/ncs.png"
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Terms of Service', item: '/terms' },
        ]}
      />

      <PageHeader
        eyebrow="Legal"
        title="Terms of Service"
        description={`Standard commercial terms governing client engagements and website usage with ${COMPANY.legalName}.`}
        breadcrumbs={[{ label: 'Terms of Service' }]}
      />

      <section className="section bg-white">
        <div className="container-site grid lg:grid-cols-[260px_1fr] gap-12 items-start">
          {/* Sticky Table of Contents */}
          <aside className="hidden lg:block sticky top-28 space-y-6">
            <div className="card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-subtle mb-4">On this page</p>
              <nav aria-label="Terms sections">
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
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-subtle mb-2">Questions?</p>
              <p className="text-sm text-ink-muted mb-3">
                For contract or billing enquiries, contact our corporate desk.
              </p>
              <a href={`mailto:${COMPANY.email}`} className="text-sm font-semibold text-brand-rose hover:underline">
                {COMPANY.email}
              </a>
            </div>
          </aside>

          {/* Main Legal Text */}
          <article className="prose-legal max-w-3xl">
            <div className="card p-6 md:p-8 bg-brand-light/70 border-l-4 border-l-brand-rose mb-10">
              <div className="flex items-start gap-4">
                <span className="icon-tile shrink-0">
                  <Building2 size={20} />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-subtle">
                    Effective {effectiveYear} · Contracting Entity
                  </p>
                  <p className="!mb-0 mt-1 text-sm text-ink-muted">
                    These Terms of Service constitute a legally binding agreement between you (&ldquo;Client&rdquo;) and{' '}
                    <strong>{COMPANY.legalName}</strong>, a {COMPANY.legalForm.toLowerCase()} incorporated in the{' '}
                    {COMPANY.jurisdiction} under the Companies Act, 2015, with its registered office at{' '}
                    <strong>{formatAddress()}</strong>.
                  </p>
                </div>
              </div>
            </div>

            <p>
              By accessing this website or engaging <strong>{COMPANY.legalName}</strong> (&ldquo;the Company&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) for software engineering, web or mobile application development, UI/UX design, consulting, or digital branding services, you agree to be bound by the terms set out below. Where a separate Master Services Agreement (MSA) or Statement of Work (SOW) is executed by both parties, the terms of that signed agreement shall take precedence to the extent of any conflict.
            </p>

            <h2 id="contracting-entity">1. Contracting Entity &amp; Corporate Authority</h2>
            <p>
              All proposals, quotations, Statements of Work, tax invoices, and delivery commitments are issued strictly in the name of <strong>{COMPANY.legalName}</strong>. No individual employee, contractor, or director assumes personal liability for obligations undertaken by the Company in the ordinary course of business.
            </p>

            <h2 id="scope">2. Scope of Work &amp; Services</h2>
            <p>
              {COMPANY.legalName} provides custom software architecture, web development, mobile application engineering, UI/UX design, payment and API integrations, and digital branding. The specific deliverables, technical architecture, milestones, and timelines for each engagement are formally defined in an approved Proposal or Statement of Work (SOW).
            </p>
            <p>
              Requests for additional features, structural revisions, or integrations outside the approved SOW constitute a change request (&ldquo;Scope Creep&rdquo;) and will be scoped, quoted, and billed separately prior to execution.
            </p>

            <h2 id="payments">3. Payments, Invoicing &amp; Billing</h2>
            <ul>
              <li>
                <strong>Commencement Deposit:</strong> A non-refundable mobilisation deposit of <strong>50%</strong> of the agreed project fee is required to schedule engineering resources and commence work, unless milestone billing is expressly specified in the SOW.
              </li>
              <li>
                <strong>Final Handover:</strong> The remaining balance is payable upon project completion and Client sign-off. Production source code repositories, administrative credentials, and live server deployments are released once cleared funds are received by {COMPANY.legalName}.
              </li>
              <li>
                <strong>Accepted Payment Channels:</strong> Payments are made exclusively to official {COMPANY.legalName} corporate accounts via verified Safaricom M-Pesa (Paybill/Till), Paystack, or direct Bank Transfer as detailed on the official Company invoice.
              </li>
              <li>
                <strong>Taxes &amp; Statutory Levies:</strong> Quoted fees are exclusive of applicable Kenyan statutory taxes (including VAT where applicable) unless explicitly stated otherwise on the quotation or invoice.
              </li>
              <li>
                <strong>Overdue Invoices:</strong> Invoices remaining unpaid beyond fourteen (14) calendar days from the due date may attract a 10% late payment surcharge and temporary suspension of active delivery or support services.
              </li>
            </ul>

            <h2 id="intellectual-property">4. Intellectual Property Rights</h2>
            <p>
              Upon receipt of full and final payment, {COMPANY.legalName} assigns to the Client ownership of the bespoke deliverables, compiled applications, custom frontend designs, and project-specific source code created specifically for the Client under the SOW.
            </p>
            <p>
              {COMPANY.legalName} retains ownership of pre-existing internal frameworks, reusable libraries, boilerplate utilities, and general engineering know-how, granting the Client a perpetual, non-exclusive licence to use any such components embedded in the delivered software. Unless a Non-Disclosure Agreement (NDA) prohibits it, the Company reserves the right to reference the completed engagement in its portfolio and credentials.
            </p>

            <h2 id="hosting">5. Hosting, Third-Party APIs &amp; Maintenance</h2>
            <p>
              Unless expressly covered under an active Service Level Agreement (SLA) or monthly maintenance retainer with {COMPANY.legalName}, project fees exclude recurring third-party infrastructure costs. The Client is responsible for ongoing subscriptions and usage charges for cloud hosting (such as AWS, Vercel, or VPS providers), domain registration and renewals, SSL certificates, and third-party APIs (such as Safaricom Daraja, Africa&rsquo;s Talking, Google Maps, or email gateways).
            </p>

            <h2 id="confidentiality">6. Confidentiality</h2>
            <p>
              Both parties agree to treat all non-public business, technical, financial, and customer information disclosed during an engagement as strictly confidential and to use such information solely for performing their obligations under the engagement.
            </p>

            <h2 id="liability">7. Limitation of Liability</h2>
            <p>
              {COMPANY.legalName} engineers systems using industry-standard security and quality practices; however, no digital environment can be guaranteed completely immune to external threats or third-party outages. To the maximum extent permitted by Kenyan law, the Company shall not be liable for indirect, consequential, or special damages, loss of profits, or downtime caused by third-party infrastructure providers, Client modifications, or force majeure events. Digital marketing ROI and search rankings depend on third-party algorithms and are not guaranteed.
            </p>
            <p>
              In any event, the aggregate liability of {COMPANY.legalName} arising out of or in connection with an engagement shall not exceed the total fees actually paid by the Client to the Company under the relevant SOW during the preceding six (6) months.
            </p>

            <h2 id="termination">8. Suspension &amp; Termination</h2>
            <p>
              Either party may terminate an engagement by written notice if the other commits a material breach that remains uncured fourteen (14) days after written notice. Upon termination, the Client shall settle all fees for milestones completed and work performed up to the termination date, and the Company shall hand over all paid-for work-in-progress.
            </p>

            <h2 id="governing-law">9. Governing Law &amp; Dispute Resolution</h2>
            <p>
              These Terms of Service shall be governed by and construed in accordance with the laws of the <strong>{COMPANY.jurisdiction}</strong>. The parties shall first attempt to resolve any dispute amicably through good-faith executive discussions within fourteen (14) days, failing which any unresolved dispute shall be subject to the exclusive jurisdiction of the courts of the Republic of Kenya.
            </p>

            <div className="mt-12 pt-8 border-t border-line">
              <h3 className="!mt-0 text-lg font-display font-bold text-ink">Corporate Contact Details</h3>
              <div className="mt-4 grid sm:grid-cols-2 gap-4 text-sm">
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
                See also our <Link to="/privacy">Privacy Policy</Link>.
              </p>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};

export default Terms;
