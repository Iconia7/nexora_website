import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Plus, Minus, Loader2, CheckCircle, AlertCircle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReCAPTCHA from 'react-google-recaptcha';
import toast from 'react-hot-toast';
import { fetchServices, fetchFAQs, fetchBenefits, submitContactMessage } from '../api';
import SEO from '../components/SEO';
import LucideIcon from '../components/LucideIcon';
import PageHeader from '../components/ui/PageHeader';
import SectionHeading from '../components/ui/SectionHeading';
import CTASection from '../components/ui/CTASection';
import { useCompany } from '../context/CompanyContext';
import { PHOTOS } from '../config/photos';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const Services = () => {
  const { company: COMPANY } = useCompany();
  const [services, setServices] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(0);
  const captchaRef = useRef(null);

  const [formData, setFormData] = useState({ name: '', email: '' });
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    Promise.all([fetchServices(), fetchFAQs(), fetchBenefits()])
      .then(([servicesRes, faqsRes, benefitsRes]) => {
        setServices(servicesRes.data || []);
        setFaqs(faqsRes.data || []);
        setBenefits(benefitsRes.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching services data:', err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
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
      await submitContactMessage({
        name: formData.name,
        email: formData.email,
        service: 'Quick Quote',
        message: 'Client submitted a quick quote request via the Services page.',
        source: 'Services Page',
      });

      setStatus('success');
      toast.success("Message sent successfully! We'll be in touch.");
      setFormData({ name: '', email: '' });
      captchaRef.current?.reset();
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
      toast.error('Something went wrong. Please try again.');
    }
  };

  const displayFaqs =
    faqs.length > 0
      ? faqs
      : [
        {
          question: 'What services does your company provide?',
          answer:
            'We provide a comprehensive range of digital services including Website Development, Mobile App Development, UI/UX Design, Digital Marketing, and Cloud Computing solutions.',
        },
        {
          question: 'What industries do you serve?',
          answer:
            'We serve a diverse range of industries including Healthcare, E-commerce, Real Estate, Education, and FinTech, delivering custom solutions for each sector.',
        },
        {
          question: 'Do you offer custom IT solutions?',
          answer:
            'Yes, absolutely. We specialize in building custom software solutions from the ground up to ensure they align perfectly with your specific business workflows.',
        },
        {
          question: 'How can I contact your support team?',
          answer: `You can reach our support team via email at ${COMPANY.email} or call us directly at ${COMPANY.phone}.`,
        },
      ];

  const displayBenefits =
    benefits.length > 0
      ? benefits
      : [
        { title: 'Senior Engineering Team', description: 'Technical specialists with years of production experience.' },
        { title: 'Structured Delivery', description: 'Clear milestones, weekly demos, and accountable timelines.' },
        { title: 'Dedicated Support', description: 'Post-launch monitoring, SLAs, and rapid issue resolution.' },
        { title: 'Transparent Pricing', description: 'Fixed-scope corporate proposals with no hidden surprises.' },
      ];

  return (
    <div className="overflow-hidden">
      <SEO
        title={`Digital Services | Web Design, Mobile Apps & Software | ${COMPANY.legalName}`}
        description={`Explore ${COMPANY.legalName}'s technology services: Custom Mobile App Development, Responsive Web Design, SEO Optimization, UI/UX Design, and Cloud Architecture in Kenya.`}
        url="/services"
        image="/ncs.png"
        keywords={[
          'web design Kenya',
          'mobile app development Nairobi',
          'UI UX design Kenya',
          'software development Thika',
          'SEO services Kenya',
          'e-commerce development Kenya',
        ]}
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Services', item: '/services' },
        ]}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: `Services Offered by ${COMPANY.legalName}`,
          itemListElement: [
            {
              '@type': 'Service',
              position: 1,
              name: 'Custom Mobile App Development',
              description: 'High-performance iOS and Android mobile apps engineered with Flutter and React Native.',
              provider: { '@type': 'ProfessionalService', name: COMPANY.legalName },
            },
            {
              '@type': 'Service',
              position: 2,
              name: 'Custom Web Application Design & Development',
              description: 'Modern, fast, and SEO-optimized responsive web applications and portals.',
              provider: { '@type': 'ProfessionalService', name: COMPANY.legalName },
            },
            {
              '@type': 'Service',
              position: 3,
              name: 'UI/UX & Digital Brand Design',
              description: 'Engaging user interfaces, wireframing, brand identity, and interactive digital experiences.',
              provider: { '@type': 'ProfessionalService', name: COMPANY.legalName },
            },
          ],
        }}
      />

      <PageHeader
        eyebrow="Capabilities"
        title={
          <>
            Engineering and design <span className="text-brand-rose">built to scale</span>.
          </>
        }
        description="From strategy and interface design to production software and payment integrations — delivered under clear commercial terms."
        breadcrumbs={[{ label: 'Services' }]}
      />

      {/* Services Grid */}
      <section className="section bg-white">
        <div className="container-site">
          <SectionHeading
            eyebrow="What we deliver"
            title="Core technology services"
            description="Every engagement is tailored to your operational goals, security requirements, and long-term roadmap."
          />

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="card h-64 animate-pulse bg-brand-light" />
              ))}
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {services.map((service, idx) => (
                <motion.div key={service.id} variants={fadeUp}>
                  <Link to={`/services/${service.id}`} className="card-hover group flex h-full flex-col p-8">
                    <div className="flex items-start justify-between">
                      <span className="icon-tile">
                        <LucideIcon name={service.icon} size={22} />
                      </span>
                      <span className="font-display text-sm font-semibold text-ink-subtle">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className="heading-md mt-7 group-hover:text-brand-rose transition-colors">
                      {service.title}
                    </h3>
                    <p className="mt-3 text-ink-muted leading-relaxed line-clamp-3 flex-1">
                      {service.description}
                    </p>
                    <span className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-rose">
                      Explore service
                      <ArrowUpRight
                        size={16}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Why Trust Us */}
      <section className="relative bg-brand-navy text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-light" aria-hidden="true" />
        <div className="relative container-site section grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={PHOTOS.servicesWhyPartner}
              alt="Engineering architecture review session"
              className="rounded-3xl shadow-lift w-full aspect-[4/3] object-cover border border-white/10"
            />
          </motion.div>

          <div>
            <SectionHeading
              dark
              className="!mb-10"
              eyebrow="Why partner with us"
              title="Commercial discipline meets engineering craft"
              description={`As ${COMPANY.legalName}, we pair senior technical execution with the governance, contracts, and reliability expected by modern businesses.`}
            />

            <div className="grid sm:grid-cols-2 gap-4">
              {displayBenefits.slice(0, 4).map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-colors hover:border-white/20"
                >
                  <span className="inline-flex w-7 h-7 items-center justify-center rounded-full bg-brand-rose text-white mb-4">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  <h4 className="font-display text-base font-bold text-white">{item.title}</h4>
                  {item.description && (
                    <p className="mt-2 text-sm text-white/65 leading-relaxed">{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quote & FAQ */}
      <section className="section bg-brand-light">
        <div className="container-site grid lg:grid-cols-[0.95fr_1.05fr] gap-12 lg:gap-16 items-start">
          {/* Quick Quote Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card p-8 md:p-10"
          >
            <span className="eyebrow">Request a proposal</span>
            <h3 className="heading-lg mt-4 text-2xl sm:text-3xl">Get a tailored quote</h3>
            <p className="mt-3 text-sm text-ink-muted leading-relaxed">
              Share your name and work email and our team will reach out within one business day to scope your requirements.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5 mt-8">
              <div>
                <label htmlFor="services-name" className="label">Full name *</label>
                <input
                  id="services-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Jane Mwangi"
                  required
                  className="input"
                />
              </div>
              <div>
                <label htmlFor="services-email" className="label">Work email *</label>
                <input
                  id="services-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jane@company.co.ke"
                  required
                  className="input"
                />
              </div>

              <div className="overflow-x-auto">
                <ReCAPTCHA ref={captchaRef} sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} />
              </div>

              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className={`w-full py-3.5 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${status === 'success'
                    ? 'bg-emerald-600 text-white cursor-default'
                    : status === 'error'
                      ? 'bg-red-600 text-white'
                      : 'btn-primary'
                  }`}
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="animate-spin" size={18} /> Sending...
                  </>
                ) : status === 'success' ? (
                  <>
                    <CheckCircle size={18} /> Request Sent
                  </>
                ) : status === 'error' ? (
                  <>
                    <AlertCircle size={18} /> Failed — Try Again
                  </>
                ) : (
                  <>
                    Request Quote <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* FAQ Accordion */}
          <div>
            <SectionHeading
              className="!mb-8"
              eyebrow="FAQ"
              title="Common questions"
              description="Straight answers about how we scope, price, and deliver projects."
            />

            <div className="space-y-3">
              {displayFaqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border bg-white transition-colors ${isOpen ? 'border-brand-rose/40 shadow-soft' : 'border-line'
                      }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                      className="w-full flex items-center justify-between gap-4 p-6 text-left"
                    >
                      <span className={`font-display font-semibold text-base sm:text-lg ${isOpen ? 'text-brand-rose' : 'text-ink'}`}>
                        {faq.question}
                      </span>
                      <span className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg bg-brand-light text-ink">
                        {isOpen ? <Minus size={16} className="text-brand-rose" /> : <Plus size={16} />}
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <p className="px-6 pb-6 text-sm sm:text-base text-ink-muted leading-relaxed">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
};

export default Services;
