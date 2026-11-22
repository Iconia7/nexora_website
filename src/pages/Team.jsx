import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Loader2, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import ReCAPTCHA from 'react-google-recaptcha';
import toast from 'react-hot-toast';
import { fetchTeamMembers, subscribeNewsletter, resolveMediaUrl } from '../api';
import SEO from '../components/SEO';
import PageHeader from '../components/ui/PageHeader';
import SectionHeading from '../components/ui/SectionHeading';
import { useCompany } from '../context/CompanyContext';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const SocialIconMap = {
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
};

const Team = () => {
  const { company: COMPANY } = useCompany();
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const captchaRef = useRef(null);

  useEffect(() => {
    fetchTeamMembers()
      .then((res) => {
        setTeam(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching team:', err);
        setLoading(false);
      });
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email.');
      setStatus('error');
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
    <div className="overflow-hidden">
      <SEO
        title={`Our Leadership & Engineering Team | ${COMPANY.legalName}`}
        description={`Meet the directors, software engineers, and product designers at ${COMPANY.legalName} building reliable digital products in Kenya.`}
        url="/team"
        image="/ncs.png"
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Our Team', item: '/team' },
        ]}
      />

      <PageHeader
        eyebrow="Our people"
        title={
          <>
            The specialists behind <span className="text-brand-rose">every release</span>.
          </>
        }
        description={`Meet the leadership, engineers, and designers representing ${COMPANY.legalName}.`}
        breadcrumbs={[{ label: 'Team' }]}
      />

      {/* Team Grid */}
      <section className="section bg-white">
        <div className="container-site">
          <SectionHeading
            align="center"
            eyebrow="Leadership & specialists"
            title="Accountable, multidisciplinary talent"
            description="Every client works directly with senior practitioners across architecture, design, and delivery."
          />

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0, 1, 2].map((i) => (
                <div key={i} className="card h-[420px] animate-pulse bg-brand-light" />
              ))}
            </div>
          ) : team.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map((member) => (
                <motion.article
                  key={member.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="card-hover group overflow-hidden flex flex-col"
                >
                  <Link to={`/team/${member.id}`} className="flex aspect-[4/4] overflow-hidden bg-brand-light items-center justify-center">
                    {member.image ? (
                      <img
                        src={resolveMediaUrl(member.image)}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <span className="inline-flex w-20 h-20 items-center justify-center rounded-full bg-brand-navy text-white font-display text-3xl font-bold">
                        {member.name?.charAt(0)}
                      </span>
                    )}
                  </Link>

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-display text-xl font-bold text-ink">
                      <Link to={`/team/${member.id}`} className="hover:text-brand-rose transition-colors">
                        {member.name}
                      </Link>
                    </h3>
                    <p className="text-sm font-medium text-brand-rose mt-0.5">{member.role}</p>

                    <div className="mt-5 pt-5 border-t border-line flex items-center justify-between">
                      <div className="flex gap-2">
                        {['facebook', 'twitter', 'linkedin', 'instagram'].map((platform) => {
                          const Icon = SocialIconMap[platform];
                          const url = member[platform] || member.socials?.[platform];
                          return url ? (
                            <a
                              key={platform}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${member.name} on ${platform}`}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-line text-ink-muted hover:border-brand-rose hover:text-brand-rose transition-colors"
                            >
                              <Icon size={14} />
                            </a>
                          ) : null;
                        })}
                      </div>

                      <Link
                        to={`/team/${member.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-ink hover:text-brand-rose transition-colors"
                      >
                        Profile <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {COMPANY.directors.map((d) => (
                <div key={d.name} className="card p-8">
                  <span className="inline-flex w-14 h-14 items-center justify-center rounded-full bg-brand-navy text-white font-display text-xl font-bold">
                    {d.name.charAt(0)}
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold text-ink">{d.name}</h3>
                  <p className="text-sm font-medium text-brand-rose">{d.role}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Band */}
      <section className="section bg-brand-light">
        <div className="container-site">
          <div className="relative overflow-hidden rounded-3xl bg-brand-navy text-white px-8 py-14 md:px-16 md:py-16">
            <div className="absolute inset-0 bg-grid-light" aria-hidden="true" />
            <div
              className="absolute -bottom-32 -right-20 w-[400px] h-[400px] rounded-full bg-brand-rose/25 blur-[110px]"
              aria-hidden="true"
            />

            <div className="relative max-w-2xl mx-auto text-center">
              <span className="eyebrow !text-white/70">Newsletter</span>
              <h2 className="heading-lg !text-white mt-4">
                Stay updated with insights from {COMPANY.shortName}
              </h2>
              <p className="mt-3 text-white/70">
                Occasional dispatches on product engineering, company updates, and digital strategy. No spam.
              </p>

              <form onSubmit={handleSubscribe} className="mt-8 space-y-4 max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.co.ke"
                    disabled={status === 'loading' || status === 'success'}
                    className="flex-1 rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/45 focus:outline-none focus:border-brand-rose"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading' || status === 'success'}
                    className={`px-6 py-3 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2 shrink-0 ${status === 'success'
                        ? 'bg-emerald-600 text-white cursor-default'
                        : status === 'error'
                          ? 'bg-red-600 text-white'
                          : 'bg-brand-rose text-white hover:bg-brand-rose-dark'
                      }`}
                  >
                    {status === 'loading' ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : status === 'success' ? (
                      <>
                        <CheckCircle size={16} /> Subscribed
                      </>
                    ) : status === 'error' ? (
                      <>
                        <AlertCircle size={16} /> Retry
                      </>
                    ) : (
                      'Subscribe'
                    )}
                  </button>
                </div>

                <div className="flex justify-center">
                  <ReCAPTCHA ref={captchaRef} sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} theme="dark" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Team;
