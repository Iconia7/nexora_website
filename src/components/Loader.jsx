import React from 'react';
import { motion } from 'framer-motion';
import { useCompany } from '../context/CompanyContext';

const Loader = () => {
  const { company: COMPANY } = useCompany();
  const logoPath = '/NCS_Secondary_Logo.png';

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-md">
      <div className="relative flex items-center justify-center w-28 h-28 mb-5">
        <motion.div
          className="absolute inset-0 border-2 border-line border-t-brand-rose rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
        />

        <div className="relative z-10 bg-white p-3 rounded-full">
          <img
            src={logoPath}
            alt={COMPANY.legalName}
            className="w-14 h-14 object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      </div>

      <p className="text-ink-subtle font-medium tracking-[0.2em] uppercase text-[11px]">
        {COMPANY.legalName}
      </p>
    </div>
  );
};

export default Loader;
