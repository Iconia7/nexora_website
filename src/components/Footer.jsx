import React, { useState, useRef } from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Loader2, CheckCircle, ArrowRight, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import toast from 'react-hot-toast';
import { subscribeNewsletter } from '../api';
import Logo from '../assets/NCS_Logo.png';
import { useCompany } from '../context/CompanyContext';

const columns = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Our Team', to: '/team' },
      { label: 'Careers', to: '/careers' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Work',
    links: [
      { label: 'Services', to: '/services' },
      { label: 'Projects', to: '/projects' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'Insights', to: '/blogs' },
      { label: 'Store', to: '/shop' },
    ],
  },
];

const Footer = () => {
  const { company: COMPANY, formatAddress } = useCompany();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const captchaRef = useRef(null);

  const socials = [
    { href: COMPANY.socials.facebook, label: 'Facebook', Icon: Facebook },
    { href: COMPANY.socials.x, label: 'X (Twitter)', Icon: Twitter },
    { href: COMPANY.socials.instagram, label: 'Instagram', Icon: Instagram },
    { href: COMPANY.socials.linkedin, label: 'LinkedIn', Icon: Linkedin },
  ].filter((s) => Boolean(s.href));

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email.');
      return;
    }

    const token = captchaRef.current?.getValue();
    if (!token) {
      toast.error('Please verify that you are not a robot.');
      return;
    }

    setStatus('loading');
    try {
      const res = await subscribeNewsletter(email);

      setStatus('success');
      setEmail('');
      toast.success(res.data?.already_subscribed ? "You're already subscribed!" : 'Thanks for subscribing!');
      captchaRef.current?.reset();
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Error: ', error);
      setStatus('error');
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <footer className="relative bg-brand-navy text-white/70 overflow-hidden">
      <div className="absolute inset-0 bg-grid-light opacity-60" aria-hidden="true" />

      <div className="relative container-site pt-20 pb-10">
        {/* Top: brand + newsletter */}
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1.4fr]">
          <div>
            <Link to="/" className="inline-block mb-6">
              <img src={Logo} alt={COMPANY.legalName} className="h-16 w-auto object-contain" />
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              We design and engineer digital products - websites, mobile apps and custom software - for organisations that take growth seriously.
            </p>
            <div className="flex gap-2 mt-6">
              {socials.map((item) => {
                const SocialIcon = item.Icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-white/10 hover:border-brand-rose hover:bg-brand-rose hover:text-white transition-colors"
                  >
                    <SocialIcon size={17} />
                  </a>
                );
              })}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-white text-sm font-semibold mb-5">{col.title}</h3>
              <ul className="space-y-3 text-sm">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="hover:text-white transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-white text-sm font-semibold mb-5">Get insights in your inbox</h3>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="flex rounded-lg border border-white/15 bg-white/5 focus-within:border-brand-rose transition-colors">
                <label htmlFor="footer-email" className="sr-only">Email address</label>
                <input
                  id="footer-email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading' || status === 'success'}
                  className="flex-1 min-w-0 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  aria-label="Subscribe"
                  className={`m-1 inline-flex items-center justify-center rounded-md px-4 text-sm font-semibold transition-colors ${status === 'success' ? 'bg-green-600 text-white' : 'bg-brand-rose text-white hover:bg-brand-rose-dark'
                    }`}
                >
                  {status === 'loading' ? <Loader2 className="animate-spin" size={16} /> :
                    status === 'success' ? <CheckCircle size={16} /> : <ArrowRight size={16} />}
                </button>
              </div>
              <div className="origin-left scale-[0.85]">
                <ReCAPTCHA ref={captchaRef} sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} theme="dark" />
              </div>
            </form>

            <ul className="mt-6 space-y-3 text-sm">
              <li>
                <a href={COMPANY.phoneHref} className="flex items-center gap-3 hover:text-white transition-colors">
                  <Phone size={15} className="text-brand-rose shrink-0" /> {COMPANY.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-3 hover:text-white transition-colors">
                  <Mail size={15} className="text-brand-rose shrink-0" /> {COMPANY.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={15} className="text-brand-rose shrink-0" /> {formatAddress()}
              </li>
            </ul>
          </div>
        </div>



        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p className="text-white/50 text-center md:text-left">
            &copy; {new Date().getFullYear()} {COMPANY.legalName}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-white/50 hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-white/50 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
