import React, { useState, useRef } from 'react';
import { Phone, Mail, Clock, MapPin, Send, Loader2, CheckCircle, AlertCircle, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { submitContactMessage, fetchServices } from '../api';
import SEO from '../components/SEO';
import ReCAPTCHA from "react-google-recaptcha";
import toast from 'react-hot-toast';
import PageHeader from '../components/ui/PageHeader';
import { useCompany } from '../context/CompanyContext';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

const Contact = () => {
  const { company: COMPANY, formatAddress } = useCompany();
  // 1. State for Form Data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Select Service',
    message: ''
  });

  const captchaRef = useRef(null);

  const [services, setServices] = useState([]);
  // 2. State for Submission Status
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'

  React.useEffect(() => {
    fetchServices()
      .then(res => setServices(res.data))
      .catch(err => console.error("Error fetching services for contact form:", err));
  }, []);

  // 3. Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 4. Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // CHECK CAPTCHA
    const token = captchaRef.current.getValue();
    if (!token) {
      toast.error("Please verify that you are not a robot 🤖");
      return;
    }

    setStatus('loading');

    try {
      // Save to Backend API (also dispatches Zoho SMTP notifications)
      await submitContactMessage({
        ...formData,
        source: 'Contact Page',
      });

      setStatus('success');
      toast.success("Message sent successfully! We'll be in touch.");
      setFormData({ name: '', email: '', phone: '', service: 'Select Service', message: '' });
      captchaRef.current.reset();
      setTimeout(() => setStatus('idle'), 5000);

    } catch (error) {
      console.error("Error sending message:", error);
      setStatus('error');
      toast.error("Something went wrong. Please try again.");
    }
  };

  const contactItems = [
    { icon: <MapPin size={20} />, label: "Office", text: formatAddress() },
    { icon: <Phone size={20} />, label: "Phone", text: COMPANY.phone, href: COMPANY.phoneHref },
    { icon: <Mail size={20} />, label: "Email", text: COMPANY.email, href: `mailto:${COMPANY.email}` },
    { icon: <Clock size={20} />, label: "Business hours", text: COMPANY.hours },
  ];

  const submitClass =
    status === 'success'
      ? 'btn w-full py-4 bg-green-600 text-white cursor-default'
      : status === 'error'
        ? 'btn w-full py-4 bg-red-600 text-white hover:bg-red-700'
        : 'btn-primary w-full py-4';

  return (
    <div>
      <SEO
        title="Contact Us | Free Consultation & Quote | Nexora Creative Solutions"
        description="Ready to start your digital project? Contact Nexora Creative Solutions in Thika & Nairobi. Call +254 115 332 870 or email info@nexoracreatives.co.ke."
        url="/contact"
        image="/ncs.png"
        keywords={[
          "contact Nexora",
          "hire developers Kenya",
          "web design quote Nairobi",
          "app development consultation Thika"
        ]}
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "Contact Us", item: "/contact" }
        ]}
        schema={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contact Nexora Creative Solutions",
          "description": "Get in touch with Nexora Creative Solutions for software development inquiries and project quotes.",
          "url": "https://nexoracreatives.co.ke/contact",
          "mainEntity": {
            "@type": "ProfessionalService",
            "name": "Nexora Creative Solutions",
            "legalName": COMPANY.legalName,
            "telephone": "+254 115 332 870",
            "email": "info@nexoracreatives.co.ke",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Thika",
              "addressRegion": "Kiambu",
              "addressCountry": "KE"
            }
          }
        }}
      />

      <PageHeader
        eyebrow="Contact"
        title="Let’s talk about your project"
        description="Tell us what you’re building. Our team reviews every enquiry and responds within one business day."
        breadcrumbs={[{ label: 'Contact Us' }]}
      />

      <section className="section bg-white">
        <div className="container-site">
          <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">

            {/* Contact Info + Company details */}
            <motion.aside
              {...fadeUp}
              transition={{ duration: 0.5 }}
              className="space-y-6 lg:col-span-1"
            >
              <div className="card p-7 md:p-8">
                <span className="eyebrow">Get in touch</span>
                <h2 className="heading-md mt-3">Contact information</h2>
                <p className="mt-2 text-sm text-ink-muted">
                  Fill in the form and our team will get back to you within 24 hours.
                </p>

                <ul className="mt-7 space-y-5">
                  {contactItems.map((item) => (
                    <li key={item.label} className="flex items-start gap-4">
                      <span className="icon-tile w-10 h-10 shrink-0">{item.icon}</span>
                      <div className="min-w-0">
                        <span className="block text-xs font-semibold uppercase tracking-wider text-ink-subtle">{item.label}</span>
                        {item.href ? (
                          <a href={item.href} className="block break-words font-medium text-ink hover:text-brand-rose transition-colors">
                            {item.text}
                          </a>
                        ) : (
                          <p className="font-medium text-ink">{item.text}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company details */}
              <div className="rounded-2xl bg-brand-navy p-7 md:p-8 text-white">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
                    <Building2 size={20} />
                  </span>
                  <h3 className="font-display text-lg font-bold text-white">Company details</h3>
                </div>
                <dl className="mt-6 space-y-4 text-sm">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-white/50">Legal name</dt>
                    <dd className="mt-0.5 font-medium text-white">{COMPANY.legalName}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-white/50">Entity type</dt>
                    <dd className="mt-0.5 text-white/80">Private limited company incorporated in Kenya</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-white/50">Registered office</dt>
                    <dd className="mt-0.5 text-white/80">{formatAddress()}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-white/50">Email</dt>
                    <dd className="mt-0.5">
                      <a href={`mailto:${COMPANY.email}`} className="break-words text-white/80 hover:text-white transition-colors">{COMPANY.email}</a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-white/50">Phone</dt>
                    <dd className="mt-0.5">
                      <a href={COMPANY.phoneHref} className="text-white/80 hover:text-white transition-colors">{COMPANY.phone}</a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-white/50">Hours</dt>
                    <dd className="mt-0.5 text-white/80">{COMPANY.hours}</dd>
                  </div>
                </dl>
              </div>
            </motion.aside>

            {/* Contact Form */}
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card p-6 sm:p-8 md:p-10 lg:col-span-2"
            >
              <span className="eyebrow">Free quote</span>
              <h2 className="heading-lg mt-3">Request a free quote</h2>
              <p className="mt-3 text-ink-muted">Fill out the form below and we will get back to you shortly.</p>

              <form onSubmit={handleSubmit} className="mt-8 grid gap-5 md:grid-cols-2">

                <div>
                  <label htmlFor="contact-name" className="label">Full name *</label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    required
                    className="input"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="label">Email address *</label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jane@company.com"
                    required
                    className="input"
                  />
                </div>

                <div>
                  <label htmlFor="contact-phone" className="label">Phone number *</label>
                  <input
                    id="contact-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+254 7XX XXX XXX"
                    required
                    className="input"
                  />
                </div>

                <div>
                  <label htmlFor="contact-service" className="label">Service</label>
                  <select
                    id="contact-service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="input"
                  >
                    <option disabled>Select Service</option>
                    {services.map(s => (
                      <option key={s.id} value={s.title}>{s.title}</option>
                    ))}
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="contact-message" className="label">Message *</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your goals, timeline and budget."
                    rows="5"
                    required
                    className="input resize-y"
                  ></textarea>
                </div>

                <div className="md:col-span-2 overflow-x-auto">
                  <ReCAPTCHA
                    ref={captchaRef}
                    sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                  />
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={status === 'loading' || status === 'success'}
                    className={submitClass}
                  >
                    {status === 'loading' ? (
                      <><Loader2 size={18} className="animate-spin" /> Sending...</>
                    ) : status === 'success' ? (
                      <><CheckCircle size={18} /> Message Sent!</>
                    ) : status === 'error' ? (
                      <><AlertCircle size={18} /> Failed. Try Again.</>
                    ) : (
                      <>Send Message <Send size={16} /></>
                    )}
                  </button>
                  {status === 'success' && (
                    <p className="mt-3 text-center text-sm text-green-700">We've received your message and will contact you soon!</p>
                  )}
                  <p className="mt-4 text-xs text-ink-subtle">
                    By submitting this form you agree to {COMPANY.legalName} processing your details to respond to your enquiry.
                  </p>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Map Section */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative mt-12 md:mt-16 h-[320px] md:h-[420px] overflow-hidden rounded-2xl border border-line bg-brand-light shadow-soft"
          >
            <iframe
              title={`${COMPANY.brandName} location map`}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127672.27596009852!2d37.00844788358245!3d-1.040711132231267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f4e5b27c66117%3A0xb6f8a7e126152c26!2sThika!5e0!3m2!1sen!2ske!4v1709210000000!5m2!1sen!2ske"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale hover:grayscale-0 transition-all duration-700"
            ></iframe>

            <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="absolute w-4 h-4 rounded-full bg-brand-rose animate-ping"></div>
                <div className="w-4 h-4 rounded-full border-2 border-white bg-brand-rose shadow-lg"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
