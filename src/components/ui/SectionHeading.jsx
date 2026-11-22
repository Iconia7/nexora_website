import React from 'react';
import { motion } from 'framer-motion';

/**
 * Consistent section intro: eyebrow + heading + optional description.
 * Use `dark` when placed on a navy background.
 */
const SectionHeading = ({ eyebrow, title, description, align = 'left', dark = false, className = '', action }) => {
  const centered = align === 'center';
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`mb-12 md:mb-16 ${centered ? 'text-center max-w-2xl mx-auto' : 'flex flex-col md:flex-row md:items-end md:justify-between gap-6'} ${className}`}
    >
      <div className={centered ? '' : 'max-w-2xl'}>
        {eyebrow && <span className={`eyebrow ${dark ? '!text-white/70' : ''}`}>{eyebrow}</span>}
        <h2 className={`heading-lg mt-4 ${dark ? '!text-white' : ''}`}>{title}</h2>
        {description && (
          <p className={`mt-4 text-lg leading-relaxed ${dark ? 'text-white/70' : 'text-ink-muted'}`}>{description}</p>
        )}
      </div>
      {action && !centered && <div className="shrink-0">{action}</div>}
    </motion.div>
  );
};

export default SectionHeading;
