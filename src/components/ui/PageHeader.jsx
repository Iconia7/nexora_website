import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Standard inner-page header used across the site.
 *
 * <PageHeader
 *   eyebrow="Our Services"
 *   title="Engineering that moves business forward"
 *   description="Optional supporting paragraph."
 *   breadcrumbs={[{ label: 'Services' }]}
 * >
 *   optional children (e.g. CTA buttons, filters)
 * </PageHeader>
 */
const PageHeader = ({ eyebrow, title, description, breadcrumbs = [], align = 'left', children }) => {
  const centered = align === 'center';

  return (
    <section className="relative overflow-hidden bg-brand-navy text-white">
      <div className="absolute inset-0 bg-grid-light mask-fade-b" aria-hidden="true" />
      <div
        className="absolute -top-40 right-[-10%] w-[520px] h-[520px] rounded-full bg-brand-rose/25 blur-[120px]"
        aria-hidden="true"
      />

      <div className={`relative container-site pt-36 pb-16 md:pt-40 md:pb-20 ${centered ? 'text-center' : ''}`}>
        {breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className={`mb-6 flex flex-wrap items-center gap-1.5 text-sm text-white/60 ${centered ? 'justify-center' : ''}`}>
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            {breadcrumbs.map((crumb, i) => (
              <React.Fragment key={i}>
                <ChevronRight size={14} className="opacity-50" />
                {crumb.to ? (
                  <Link to={crumb.to} className="hover:text-white transition-colors">{crumb.label}</Link>
                ) : (
                  <span className="text-white line-clamp-1">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={centered ? 'max-w-3xl mx-auto' : 'max-w-3xl'}
        >
          {eyebrow && (
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70 mb-4">
              <span className="w-6 h-px bg-brand-rose" />
              {eyebrow}
            </span>
          )}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tightest leading-[1.08] text-white">
            {title}
          </h1>
          {description && (
            <p className={`mt-5 text-lg text-white/70 leading-relaxed max-w-2xl ${centered ? 'mx-auto' : ''}`}>
              {description}
            </p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </motion.div>
      </div>
    </section>
  );
};

export default PageHeader;
