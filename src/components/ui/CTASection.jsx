import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';

/** Closing call-to-action band, reused at the bottom of key pages. */
const CTASection = ({
  title = 'Have a project in mind? Let’s build it properly.',
  description = 'Tell us about your goals. We’ll respond within one business day with next steps and a clear proposal.',
  primary = { label: 'Start a project', to: '/contact' },
  secondary = { label: 'View pricing', to: '/pricing' },
}) => {
  const { company: COMPANY } = useCompany();
  return (
  <section className="section bg-white">
    <div className="container-site">
      <div className="relative overflow-hidden rounded-3xl bg-brand-navy px-8 py-14 md:px-16 md:py-20">
        <div className="absolute inset-0 bg-grid-light" aria-hidden="true" />
        <div className="absolute -bottom-32 -right-20 w-[420px] h-[420px] rounded-full bg-brand-rose/30 blur-[110px]" aria-hidden="true" />
        <div className="relative grid gap-10 md:grid-cols-[1.5fr_1fr] md:items-center">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">{title}</h2>
            <p className="mt-4 text-white/70 text-lg max-w-xl">{description}</p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link to={primary.to} className="btn-primary">
              {primary.label} <ArrowRight size={16} />
            </Link>
            {secondary && (
              <Link to={secondary.to} className="btn-ghost-light">
                {secondary.label}
              </Link>
            )}
          </div>
        </div>
        <p className="relative mt-10 pt-6 border-t border-white/10 text-xs text-white/50">
          {COMPANY.legalName} · {COMPANY.email} · {COMPANY.phone}
        </p>
      </div>
    </div>
  </section>
  );
};

export default CTASection;
