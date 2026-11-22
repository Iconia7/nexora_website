import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from '../assets/NCS_Secondary_Logo.png';
import { useCompany } from '../context/CompanyContext';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Projects', to: '/projects' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Insights', to: '/blogs' },
];

const Navbar = () => {
  const { company: COMPANY } = useCompany();
  const [openPath, setOpenPath] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const isOpen = openPath === pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleMenu = () => setOpenPath((prev) => (prev === pathname ? null : pathname));

  const linkClass = ({ isActive }) =>
    `relative px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? 'text-ink' : 'text-ink-muted hover:text-ink'
    }`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || isOpen
          ? 'bg-white/90 backdrop-blur-xl border-b border-line shadow-[0_1px_0_rgba(14,16,36,0.02)]'
          : 'bg-white border-b border-transparent'
      }`}
    >
      <nav className="container-site flex h-20 items-center justify-between" aria-label="Main">
        <Link to="/" className="flex items-center shrink-0" aria-label={`${COMPANY.legalName} – Home`}>
          <img src={Logo} alt={COMPANY.legalName} className="h-14 w-auto object-contain" />
        </Link>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkClass}>
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full bg-brand-rose"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-ink-muted hover:text-ink transition-colors"
          >
            <ShoppingBag size={16} /> Store
          </Link>
          <Link to="/contact" className="btn-primary !py-2.5">
            Start a project <ArrowRight size={16} />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={toggleMenu}
          className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg text-ink hover:bg-brand-light"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden bg-white border-t border-line"
          >
            <div className="container-site py-4">
              {[...navLinks, { label: 'Team', to: '/team' }, { label: 'Careers', to: '/careers' }, { label: 'Store', to: '/shop' }].map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center justify-between py-3.5 border-b border-line text-base font-medium ${
                      isActive ? 'text-brand-rose' : 'text-ink'
                    }`
                  }
                >
                  {item.label}
                  <ArrowRight size={16} className="opacity-30" />
                </NavLink>
              ))}
              <Link to="/contact" className="btn-primary w-full mt-5">
                Start a project <ArrowRight size={16} />
              </Link>
              <p className="mt-4 text-center text-xs text-ink-subtle">{COMPANY.legalName}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
