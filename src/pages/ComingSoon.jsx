import React, { useState, useEffect } from 'react';
import { Facebook, Twitter, Linkedin, Instagram, Loader2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { subscribeNewsletter } from '../api';
import picture from '../assets/newton.jpeg';
import Logo from '../assets/NCS_Secondary_Logo.png';
import SEO from '../components/SEO';
import { useCompany } from '../context/CompanyContext';

const ComingSoon = () => {
  const { company: COMPANY } = useCompany();
  const socialItems = [
    { href: COMPANY.socials.facebook, label: 'Facebook', Icon: Facebook },
    { href: COMPANY.socials.x, label: 'X', Icon: Twitter },
    { href: COMPANY.socials.linkedin, label: 'LinkedIn', Icon: Linkedin },
    { href: COMPANY.socials.instagram, label: 'Instagram', Icon: Instagram },
  ].filter((s) => Boolean(s.href));
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const [timeLeft, setTimeLeft] = useState({
    days: 5,
    hours: 1,
    minutes: 30,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else {
          seconds = 59;
          if (minutes > 0) minutes--;
          else {
            minutes = 59;
            if (hours > 0) hours--;
            else {
              hours = 23;
              if (days > 0) days--;
            }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setMessage('Please enter a valid email.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const res = await subscribeNewsletter(email);

      setStatus('success');
      setEmail('');
      setMessage(
        res.data?.already_subscribed
          ? 'You are already subscribed to launch updates!'
          : 'You have been subscribed successfully!'
      );
    } catch (error) {
      console.error('Error: ', error);
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans">
      <SEO
        title={`Coming Soon | ${COMPANY.legalName}`}
        description={`We are crafting a new digital experience at ${COMPANY.legalName}. Stay tuned for updates.`}
        url="/coming-soon"
        noindex={true}
      />

      {/* Left visual */}
      <div className="w-full md:w-1/2 relative h-[380px] md:h-screen shrink-0 bg-brand-navy">
        <img src={picture} alt="Newton Mwangi" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/85 via-brand-navy/20 to-transparent" />

        <div className="absolute bottom-10 left-10 right-10 rounded-2xl border border-white/15 bg-brand-navy/70 backdrop-blur-md p-6 text-white hidden md:block max-w-md">
          <p className="text-base leading-relaxed text-white/90">
            &ldquo;We are building something purposeful. Stay tuned for the next chapter of {COMPANY.legalName}.&rdquo;
          </p>
          <div className="mt-4 pt-4 border-t border-white/15">
            <h4 className="font-display font-bold text-white">Newton Mwangi</h4>
            <p className="text-xs text-white/70">Founder &amp; Managing Director, {COMPANY.legalName}</p>
          </div>
        </div>
      </div>

      {/* Right content */}
      <div className="w-full md:w-1/2 flex flex-col bg-white h-auto md:h-screen overflow-y-auto">
        <div className="p-8 pb-0">
          <Link to="/">
            <img src={Logo} alt={COMPANY.legalName} className="h-14 w-auto object-contain" />
          </Link>
        </div>

        <div className="flex-grow flex flex-col justify-center px-8 md:px-12 py-10">
          <div className="max-w-lg w-full mx-auto">
            <span className="eyebrow">Coming soon</span>
            <h1 className="heading-xl mt-4 mb-8">
              Get notified when we <span className="text-brand-rose">launch</span>.
            </h1>

            <div className="grid grid-cols-4 gap-3 mb-10 text-center">
              {[
                { label: 'Days', val: timeLeft.days },
                { label: 'Hours', val: timeLeft.hours },
                { label: 'Minutes', val: timeLeft.minutes },
                { label: 'Seconds', val: timeLeft.seconds },
              ].map((item) => (
                <div key={item.label} className="card p-4">
                  <div className="font-display text-2xl md:text-4xl font-extrabold text-ink">
                    {String(item.val).padStart(2, '0')}
                  </div>
                  <p className="text-ink-subtle text-[11px] uppercase font-semibold tracking-wider mt-1">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubscribe} className="space-y-3 mb-10">
              <label htmlFor="coming-soon-email" className="label">
                Get notified when we go live
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  id="coming-soon-email"
                  type="email"
                  placeholder="you@company.co.ke"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading' || status === 'success'}
                  className="input flex-1"
                />
                <button
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  className={`px-6 py-3 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2 shrink-0 ${
                    status === 'success' ? 'bg-emerald-600 text-white cursor-default' : 'btn-primary'
                  }`}
                >
                  {status === 'loading' ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : status === 'success' ? (
                    <>
                      <CheckCircle size={16} /> Subscribed
                    </>
                  ) : (
                    'Notify me'
                  )}
                </button>
              </div>
              {message && (
                <p className={`text-sm ${status === 'error' ? 'text-red-600' : 'text-emerald-600'}`}>{message}</p>
              )}
            </form>

            <div className="flex gap-2.5">
              {socialItems.map((item) => {
                const SocialIcon = item.Icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-line text-ink-muted hover:border-brand-rose hover:text-brand-rose transition-colors"
                  >
                    <SocialIcon size={17} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-8 text-ink-subtle text-xs border-t border-line">
          &copy; {new Date().getFullYear()} {COMPANY.legalName}. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
