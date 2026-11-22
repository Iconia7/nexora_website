import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck } from 'lucide-react';
import { useCompany } from '../context/CompanyContext';

const PrivacyNotice = () => {
  const { company: COMPANY } = useCompany();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('nexora_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('nexora_cookie_consent', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-50"
        >
          <div className="rounded-2xl bg-brand-navy/95 backdrop-blur-xl text-white p-6 shadow-lift border border-white/10 relative">
            <button
              type="button"
              aria-label="Dismiss cookie notice"
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-2.5 mb-2">
              <ShieldCheck size={18} className="text-brand-rose shrink-0" />
              <h4 className="font-display font-bold text-base text-white">Your privacy matters</h4>
            </div>
            <p className="text-white/70 text-xs sm:text-sm mb-5 leading-relaxed">
              {COMPANY.legalName} uses essential cookies and reCAPTCHA to secure forms and improve site performance.
            </p>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={acceptCookies}
                className="btn-primary !py-2 !px-5 flex-1 text-xs"
              >
                Accept
              </button>
              <Link
                to="/privacy"
                className="btn-ghost-light !py-2 !px-4 text-xs text-center"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PrivacyNotice;
