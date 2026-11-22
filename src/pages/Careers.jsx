import React, { useState, useEffect, useRef } from 'react';
import { Briefcase, MapPin, Clock, ArrowRight, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReCAPTCHA from 'react-google-recaptcha';
import toast from 'react-hot-toast';
import { fetchJobs, fetchBenefits, submitJobApplication } from '../api';
import SEO from '../components/SEO';
import LucideIcon from '../components/LucideIcon';
import PageHeader from '../components/ui/PageHeader';
import SectionHeading from '../components/ui/SectionHeading';
import { useCompany } from '../context/CompanyContext';
import { PHOTOS } from '../config/photos';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const Careers = () => {
  const { company: COMPANY } = useCompany();
  const [jobs, setJobs] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', link: '', message: '' });
  const [status, setStatus] = useState('idle');
  const captchaRef = useRef(null);

  useEffect(() => {
    Promise.all([fetchJobs(), fetchBenefits()])
      .then(([jobsRes, benefitsRes]) => {
        setJobs(jobsRes.data || []);
        setBenefits(benefitsRes.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching careers data:', err);
        setLoading(false);
      });
  }, []);

  const openApplication = (position) => {
    setSelectedPosition(position);
    setIsModalOpen(true);
  };

  const closeApplication = () => {
    setIsModalOpen(false);
    setFormData({ name: '', email: '', link: '', message: '' });
    setStatus('idle');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.link) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const token = captchaRef.current?.getValue();
    if (!token) {
      toast.error('Please verify that you are not a robot.');
      return;
    }

    setStatus('loading');

    try {
      await submitJobApplication({
        position: selectedPosition,
        name: formData.name,
        email: formData.email,
        portfolio_link: formData.link,
        message: formData.message,
      });

      setStatus('success');
      toast.success("Application submitted! We'll be in touch.");
      captchaRef.current?.reset();
      setTimeout(() => closeApplication(), 3000);
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
      toast.error('Something went wrong. Please try again.');
    }
  };

  const displayBenefits =
    benefits.length > 0
      ? benefits
      : [
          { id: 1, icon: 'Briefcase', title: 'Meaningful Engineering', description: 'Work on production software, fintech integrations, and platforms used daily.' },
          { id: 2, icon: 'Globe', title: 'Hybrid Flexibility', description: 'Outcome-driven collaboration across Thika, Nairobi, and remote setups.' },
          { id: 3, icon: 'Users', title: 'Career Growth', description: 'Direct mentorship, architectural ownership, and structured progression.' },
        ];

  return (
    <div className="overflow-hidden">
      <SEO
        title={`Careers & Tech Jobs in Kenya | ${COMPANY.legalName}`}
        description={`Explore software engineering, Flutter, web development, and UI/UX design careers at ${COMPANY.legalName} in Kenya.`}
        url="/careers"
        image="/ncs.png"
        keywords={[
          'tech jobs Kenya',
          'software engineering jobs Nairobi',
          'web developer vacancies Kenya',
          'Nexora careers',
        ]}
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Careers', item: '/careers' },
        ]}
      />

      <PageHeader
        eyebrow="Careers"
        title={
          <>
            Build products that <span className="text-brand-rose">matter</span>.
          </>
        }
        description={`Join ${COMPANY.legalName}. We are building a disciplined team of engineers, designers, and problem-solvers in Kenya.`}
        breadcrumbs={[{ label: 'Careers' }]}
      >
        <button
          type="button"
          className="btn-primary"
          onClick={() => document.getElementById('openings')?.scrollIntoView({ behavior: 'smooth' })}
        >
          View open roles <ArrowRight size={16} />
        </button>
      </PageHeader>

      {/* Culture Intro Image */}
      <section className="section bg-white">
        <div className="container-site">
          <div className="rounded-3xl overflow-hidden shadow-lift aspect-[21/9] min-h-[260px] bg-brand-light">
            <img
              src={PHOTOS.careersHero}
              alt="Nexora Creative Solutions Ltd engineering and product team in boardroom session"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="relative bg-brand-navy text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-light" aria-hidden="true" />
        <div className="relative container-site section">
          <SectionHeading
            dark
            align="center"
            eyebrow="Why join us"
            title={`Working at ${COMPANY.shortName}`}
            description="High trust, clear expectations, and room to do the best work of your career."
          />

          <div className="grid md:grid-cols-3 gap-6">
            {displayBenefits.map((benefit, idx) => (
              <motion.div
                key={benefit.id ?? idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-8"
              >
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-rose text-white mb-6">
                  <LucideIcon name={benefit.icon || 'Briefcase'} size={20} />
                </span>
                <h3 className="font-display text-lg font-bold text-white">{benefit.title}</h3>
                <p className="mt-2.5 text-sm text-white/65 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="openings" className="section bg-brand-light scroll-mt-20">
        <div className="container-site max-w-4xl">
          <SectionHeading
            align="center"
            eyebrow="Open roles"
            title="Current opportunities"
            description="We review every application personally and respond promptly."
          />

          {loading ? (
            <div className="space-y-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="card h-28 animate-pulse bg-white" />
              ))}
            </div>
          ) : jobs.length > 0 ? (
            <div className="space-y-4">
              {jobs.map((job) => (
                <motion.div
                  key={job.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="card-hover p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                >
                  <div>
                    <h3 className="font-display text-xl font-bold text-ink">{job.title}</h3>
                    <div className="flex flex-wrap gap-4 mt-2.5 text-sm text-ink-muted">
                      {(job.job_type || job.type) && (
                        <span className="inline-flex items-center gap-1.5">
                          <Briefcase size={15} className="text-brand-rose" /> {job.job_type || job.type}
                        </span>
                      )}
                      {job.location && (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin size={15} className="text-brand-rose" /> {job.location}
                        </span>
                      )}
                      {(job.experience || job.exp) && (
                        <span className="inline-flex items-center gap-1.5">
                          <Clock size={15} className="text-brand-rose" /> {job.experience || job.exp}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => openApplication(job.title)}
                    className="btn-primary shrink-0"
                  >
                    Apply now <ArrowRight size={15} />
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <h3 className="heading-md">No specific vacancies listed right now</h3>
              <p className="mt-2 text-ink-muted max-w-md mx-auto">
                We are always glad to hear from strong engineers and designers. Submit a general application below.
              </p>
              <button
                type="button"
                onClick={() => openApplication('General Application')}
                className="btn-primary mt-6"
              >
                Submit General Application <ArrowRight size={15} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Life @ Nexora */}
      <section className="section bg-white">
        <div className="container-site">
          <SectionHeading eyebrow="Culture" title={`Life at ${COMPANY.shortName}`} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:h-[460px]">
            <div className="col-span-2 row-span-2 overflow-hidden rounded-2xl">
              <img
                src={PHOTOS.careersCultureMeeting}
                alt="Team standup collaboration"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="col-span-1 row-span-1 overflow-hidden rounded-2xl">
              <img
                src={PHOTOS.careersCultureDesign}
                alt="Mobile app development and testing"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="col-span-1 row-span-2 overflow-hidden rounded-2xl">
              <img
                src={PHOTOS.careersCultureDesk}
                alt="Software engineer at coding workstation"
                className="w-full h-full object-cover object-right"
              />
            </div>
            <div className="col-span-1 row-span-1 overflow-hidden rounded-2xl">
              <img
                src={PHOTOS.careersCultureStudio}
                alt="Modern Nexora studio lounge and workspace"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* General Application CTA */}
      <section className="section bg-brand-light">
        <div className="container-site">
          <div className="rounded-3xl bg-brand-navy text-white px-8 py-14 md:px-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-light" aria-hidden="true" />
            <div className="relative max-w-xl">
              <h2 className="font-display text-3xl font-bold text-white">Don&rsquo;t see a role that fits?</h2>
              <p className="mt-3 text-white/70">
                Send your CV or portfolio to {COMPANY.legalName} and we will keep you on file for upcoming roles.
              </p>
            </div>
            <button
              type="button"
              onClick={() => openApplication('General Application')}
              className="relative btn-primary shrink-0"
            >
              Send your resume <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Application Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeApplication}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-7 md:p-8 max-w-lg w-full relative shadow-lift max-h-[90vh] overflow-y-auto"
            >
              <button
                type="button"
                aria-label="Close application modal"
                onClick={closeApplication}
                className="absolute top-5 right-5 inline-flex items-center justify-center w-9 h-9 rounded-lg text-ink-subtle hover:bg-brand-light hover:text-ink"
              >
                <X size={20} />
              </button>

              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-rose">Apply to {COMPANY.shortName}</p>
              <h3 className="heading-md mt-1">{selectedPosition}</h3>
              <p className="text-sm text-ink-muted mt-1 mb-6">{COMPANY.legalName}</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="career-name" className="label">Full name *</label>
                  <input
                    id="career-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                    className="input"
                  />
                </div>
                <div>
                  <label htmlFor="career-email" className="label">Email address *</label>
                  <input
                    id="career-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="input"
                  />
                </div>
                <div>
                  <label htmlFor="career-link" className="label">Resume / Portfolio URL *</label>
                  <input
                    id="career-link"
                    type="text"
                    name="link"
                    value={formData.link}
                    onChange={handleChange}
                    placeholder="LinkedIn, GitHub, or Google Drive link"
                    required
                    className="input"
                  />
                </div>
                <div>
                  <label htmlFor="career-message" className="label">Brief note</label>
                  <textarea
                    id="career-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Tell us about your relevant experience..."
                    className="input"
                  />
                </div>

                <div className="overflow-x-auto">
                  <ReCAPTCHA ref={captchaRef} sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  className={`w-full py-3.5 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2 ${
                    status === 'success'
                      ? 'bg-emerald-600 text-white'
                      : status === 'error'
                      ? 'bg-red-600 text-white'
                      : 'btn-primary'
                  }`}
                >
                  {status === 'loading' ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : status === 'success' ? (
                    <>
                      <CheckCircle size={16} /> Application Received
                    </>
                  ) : status === 'error' ? (
                    <>
                      <AlertCircle size={16} /> Failed — Retry
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Careers;
