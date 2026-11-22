import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Phone, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import ReCAPTCHA from 'react-google-recaptcha';
import toast from 'react-hot-toast';
import { fetchServiceById, fetchServices, submitContactMessage } from '../api';
import SEO from '../components/SEO';
import PageHeader from '../components/ui/PageHeader';
import CTASection from '../components/ui/CTASection';
import { useCompany } from '../context/CompanyContext';
import { PHOTOS } from '../config/photos';

const ServiceDetails = () => {
  const { company: COMPANY } = useCompany();
  const { id } = useParams();
  const [currentService, setCurrentService] = useState(null);
  const [allServices, setAllServices] = useState([]);
  const [loadedId, setLoadedId] = useState(null);
  const loading = loadedId !== id;
  const captchaRef = useRef(null);

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    let active = true;
    Promise.all([fetchServiceById(id), fetchServices()])
      .then(([detailRes, listRes]) => {
        if (!active) return;
        setCurrentService(detailRes.data);
        setAllServices(listRes.data || []);
        setLoadedId(id);
      })
      .catch((err) => {
        if (!active) return;
        console.error('Error fetching service details:', err);
        setLoadedId(id);
      });
    return () => {
      active = false;
    };
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
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
        service: currentService.title,
        message: formData.message,
        source: 'Service Details Page',
      });

      setStatus('success');
      toast.success("Message sent successfully! We'll be in touch.");
      setFormData({ name: '', email: '', message: '' });
      captchaRef.current?.reset();
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
      toast.error('Something went wrong. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] pt-36 pb-20 flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-brand-rose" />
      </div>
    );
  }

  if (!currentService) {
    return (
      <div className="min-h-[60vh] pt-36 pb-20 container-site text-center">
        <h1 className="heading-lg">Service not found</h1>
        <p className="mt-3 text-ink-muted">The service you are looking for may have moved or been updated.</p>
        <Link to="/services" className="btn-primary mt-8">
          Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <SEO
        title={`${currentService.title} | ${COMPANY.legalName}`}
        description={`Professional ${currentService.title} services in Kenya delivered by ${COMPANY.legalName}. Tailored digital engineering for ambitious businesses.`}
        url={`/services/${currentService.id}`}
        image="/ncs.png"
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Services', item: '/services' },
          { name: currentService.title, item: `/services/${currentService.id}` },
        ]}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: currentService.title,
          description: currentService.description || `Professional ${currentService.title} by ${COMPANY.legalName}.`,
          provider: {
            '@type': 'ProfessionalService',
            name: COMPANY.legalName,
            url: COMPANY.siteUrl,
          },
          areaServed: 'Kenya',
        }}
      />

      <PageHeader
        eyebrow="Service"
        title={currentService.title}
        description={currentService.description}
        breadcrumbs={[
          { label: 'Services', to: '/services' },
          { label: currentService.title },
        ]}
      />

      <section className="section bg-white">
        <div className="container-site grid lg:grid-cols-[1fr_360px] gap-12 lg:gap-16 items-start">
          {/* Main Content */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="rounded-3xl overflow-hidden shadow-soft mb-10 aspect-[16/9]">
              <img
                src={PHOTOS.serviceDetailsHero}
                alt={currentService.title}
                className="w-full h-full object-cover"
              />
            </div>

            <h2 className="heading-lg text-2xl sm:text-3xl">
              {currentService.heading || currentService.title}
            </h2>
            <p className="lead mt-5">
              {currentService.intro || currentService.description}
            </p>
            <p className="mt-4 text-ink-muted leading-relaxed">
              Every engagement with {COMPANY.legalName} follows a documented scope of work, clear milestone reviews, and direct access to the engineers and designers building your product.
            </p>

            {/* Included deliverables */}
            <div className="mt-12 pt-10 border-t border-line">
              <h3 className="heading-md mb-6">What&rsquo;s included</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {(currentService.includes || ['Custom Architecture & Delivery', 'Dedicated Post-Launch Support']).map((item, idx) => (
                  <div key={idx} className="card p-4 flex items-center gap-3">
                    <CheckCircle className="text-brand-rose shrink-0" size={18} />
                    <span className="font-medium text-ink text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual gallery */}
            <div className="grid sm:grid-cols-2 gap-6 mt-12">
              <img
                src={PHOTOS.serviceDetailsDiscovery}
                className="rounded-2xl shadow-soft aspect-[4/3] object-cover w-full"
                alt="Mobile and web product testing"
              />
              <img
                src={PHOTOS.serviceDetailsEngineering}
                className="rounded-2xl shadow-soft aspect-[4/3] object-cover w-full"
                alt="Collaborative software engineering review"
              />
            </div>

            {/* Expertise steps */}
            <div className="mt-14 pt-10 border-t border-line">
              <h3 className="heading-md mb-8">Our expertise in {currentService.title}</h3>
              {currentService.expertise && currentService.expertise.length > 0 ? (
                <div className="space-y-6">
                  {currentService.expertise.map((exp, idx) => (
                    <div key={idx} className="flex gap-5 items-start">
                      <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-navy text-white font-display font-bold text-sm shrink-0">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h4 className="font-display text-lg font-bold text-ink">{exp.title}</h4>
                        <p className="mt-1.5 text-ink-muted leading-relaxed">{exp.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-ink-subtle text-sm">Detailed breakdown available on request during discovery.</p>
              )}
            </div>
          </motion.div>

          {/* Sidebar */}
          <aside className="sticky top-28 space-y-6">
            {/* Services Navigation */}
            <div className="card p-6">
              <h3 className="font-display text-base font-bold text-ink mb-4">All services</h3>
              <nav aria-label="Services list" className="space-y-1.5">
                {allServices.map((s) => {
                  const active = s.id === currentService.id;
                  return (
                    <Link
                      key={s.id}
                      to={`/services/${s.id}`}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${active
                          ? 'bg-brand-navy text-white'
                          : 'text-ink-muted hover:bg-brand-light hover:text-ink'
                        }`}
                    >
                      <span>{s.title}</span>
                      <ArrowRight size={15} className={active ? 'text-brand-rose' : 'opacity-40'} />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Quote Request Form */}
            <div className="rounded-2xl bg-brand-navy text-white p-7 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-44 h-44 bg-brand-rose/25 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
              <div className="relative">
                <h3 className="font-display text-xl font-bold text-white">Request a quote</h3>
                <p className="mt-2 text-sm text-white/65">
                  Tell us about your project and we&rsquo;ll respond within one business day.
                </p>

                <form onSubmit={handleSubmit} className="space-y-3.5 mt-6">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name *"
                    required
                    className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/45 focus:outline-none focus:border-brand-rose"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Work email *"
                    required
                    className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/45 focus:outline-none focus:border-brand-rose"
                  />
                  <textarea
                    rows="3"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Brief project details *"
                    required
                    className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/45 focus:outline-none focus:border-brand-rose"
                  />

                  <div className="origin-left scale-[0.85]">
                    <ReCAPTCHA ref={captchaRef} sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} theme="dark" />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading' || status === 'success'}
                    className={`w-full py-3 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2 ${status === 'success'
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
                        <CheckCircle size={16} /> Request Sent
                      </>
                    ) : status === 'error' ? (
                      <>
                        <AlertCircle size={16} /> Failed
                      </>
                    ) : (
                      'Submit Request'
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Direct Phone Card */}
            <div className="card p-6 flex items-center gap-4">
              <span className="icon-tile shrink-0">
                <Phone size={20} />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-subtle">Direct line</p>
                <a href={COMPANY.phoneHref} className="font-display font-bold text-ink hover:text-brand-rose transition-colors">
                  {COMPANY.phone}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <CTASection />
    </div>
  );
};

export default ServiceDetails;
