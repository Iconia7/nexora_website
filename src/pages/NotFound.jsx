import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import { useCompany } from '../context/CompanyContext';

const NotFound = () => {
  const { company: COMPANY } = useCompany();
  return (
    <div className="relative pt-28 pb-24 min-h-[80vh] flex items-center justify-center bg-white overflow-hidden">
      <SEO
        title={`404 — Page Not Found | ${COMPANY.legalName}`}
        description={`The page you are looking for does not exist on ${COMPANY.legalName}.`}
        url="/404"
        noindex={true}
      />

      <div className="absolute inset-0 bg-grid mask-fade-b" aria-hidden="true" />

      <div className="relative container-site text-center max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <span className="eyebrow">Error 404</span>
          <p className="mt-4 font-display text-7xl sm:text-9xl font-extrabold tracking-tightest text-brand-navy leading-none">
            404
          </p>
          <h1 className="heading-lg mt-6">Page not found</h1>
          <p className="lead mt-4">
            The page you requested may have moved or no longer exists. Return to the homepage or contact our team for help.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link to="/" className="btn-primary">
              <ArrowLeft size={16} /> Back to home
            </Link>
            <Link to="/contact" className="btn-outline">
              Contact us <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
