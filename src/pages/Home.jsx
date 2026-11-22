import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Check, Star, Building2, Compass, PenTool, Code2, Rocket, Quote } from 'lucide-react';
import { fetchServices, fetchStats, fetchTestimonials, fetchBenefits, resolveMediaUrl } from '../api';
import SEO from '../components/SEO';
import LucideIcon from '../components/LucideIcon';
import SectionHeading from '../components/ui/SectionHeading';
import CTASection from '../components/ui/CTASection';
import { useCompany } from '../context/CompanyContext';
import { PHOTOS } from '../config/photos';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const fallbackServices = [
  { id: 'web', icon: 'Globe', title: 'Web Platforms', description: 'High-performance websites and web applications built for speed, SEO and conversion.' },
  { id: 'mobile', icon: 'Smartphone', title: 'Mobile Apps', description: 'Cross-platform iOS and Android apps with native-grade performance and polish.' },
  { id: 'software', icon: 'Cpu', title: 'Custom Software', description: 'Business systems, integrations and payment pipelines engineered around your operations.' },
];

const process = [
  { icon: Compass, title: 'Discover', text: 'We map your goals, users and constraints into a clear, costed scope of work.' },
  { icon: PenTool, title: 'Design', text: 'Wireframes and high-fidelity UI validated with you before a line of code ships.' },
  { icon: Code2, title: 'Engineer', text: 'Agile sprints, weekly demos and production-grade code reviewed at every step.' },
  { icon: Rocket, title: 'Launch & Scale', text: 'Deployment, monitoring and ongoing support as your product and team grow.' },
];

const techStack = ['React', 'Next.js', 'Flutter', 'Node.js', 'Django', 'PostgreSQL', 'Firebase', 'M-Pesa Daraja', 'AWS', 'Figma'];

const Home = () => {
  const { company: COMPANY } = useCompany();
  const [services, setServices] = useState([]);
  const [stats, setStats] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchServices(), fetchStats(), fetchTestimonials(), fetchBenefits()])
      .then(([servicesRes, statsRes, testimonialsRes, benefitsRes]) => {
        setServices(servicesRes.data || []);
        setStats(statsRes.data || []);
        setTestimonials(testimonialsRes.data || []);
        setBenefits(benefitsRes.data || []);
      })
      .catch((err) => console.error('Error fetching homepage data:', err))
      .finally(() => setLoading(false));
  }, []);

  const displayServices = services.length > 0 ? services : fallbackServices;

  const displayStats = stats.length > 0 ? stats : [
    { value: '200+', label: 'Systems deployed' },
    { value: '50+', label: 'Business clients' },
    { value: '10+', label: 'Specialists' },
    { value: '5+', label: 'Years of delivery' },
  ];

  const displayBenefits = benefits.length > 0 ? benefits : [
    { title: 'Accountable, registered company', description: `Contract directly with ${COMPANY.legalName} - formal agreements, invoices and clear ownership of IP.` },
    { title: 'Senior engineering team', description: 'Experienced designers and engineers who own outcomes, not just tickets.' },
    { title: 'Transparent delivery', description: 'Fixed scopes, weekly demos and a single point of contact from kickoff to launch.' },
    { title: 'Long-term support', description: 'Maintenance retainers, monitoring and responsive support after go-live.' },
  ];

  const displayTestimonials = testimonials.length > 0 ? testimonials : [
    { name: 'Sarah Johnson', role: 'CEO', company: 'TechStart', text: 'Nexora transformed our digital presence completely. Their team is professional, creative, and incredibly skilled.', rating: 5 },
    { name: 'Michael Chen', role: 'Founder', company: 'InnovateHQ', text: 'The best tech partner we have worked with. Their attention to detail and engineering excellence is unmatched.', rating: 5 },
  ];

  return (
    <div className="overflow-hidden">
      <SEO
        title={`${COMPANY.legalName} | Web, App & Software Development Company in Kenya`}
        description={`${COMPANY.legalName} is a Kenyan private limited technology company in Thika & Nairobi delivering custom software, web and mobile applications, M-Pesa Daraja integrations, UI/UX design and digital branding.`}
        url="/"
        keywords={[
          'Nexora Creative Solutions Ltd', 'Nexora Creative Solutions', 'Nexora', 'Nexora Creatives',
          'Web Design Kenya', 'App Development Nairobi', 'Software Development Company Kenya',
          'M-Pesa Daraja API Integration', 'Digital Agency Thika', 'UI UX Design Kenya', 'Custom Software Kenya',
        ]}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': `${COMPANY.siteUrl}/#webpage`,
          url: `${COMPANY.siteUrl}/`,
          name: `${COMPANY.legalName} | Web, App & Software Development Company in Kenya`,
          description: COMPANY.description,
          isPartOf: { '@id': `${COMPANY.siteUrl}/#website` },
          about: { '@id': `${COMPANY.siteUrl}/#organization` },
          inLanguage: 'en-KE',
          speakable: {
            '@type': 'SpeakableSpecification',
            cssSelector: ['h1', '.lead'],
          },
        }}
      />

      {/* ───────────────── Hero ───────────────── */}
      <section className="relative pt-32 md:pt-40 pb-20 md:pb-28 bg-white">
        <div className="absolute inset-0 bg-grid mask-fade-b" aria-hidden="true" />
        <div className="absolute top-20 -right-40 w-[560px] h-[560px] rounded-full bg-brand-rose/10 blur-[120px]" aria-hidden="true" />

        <div className="relative container-site grid lg:grid-cols-[1.1fr_1fr] gap-14 lg:gap-16 items-center">
          <motion.div initial="hidden" animate="visible" variants={stagger}>


            <motion.h1 variants={fadeUp} className="heading-xl mt-8">
              Digital products, <br className="hidden sm:block" />
              engineered for <span className="text-brand-rose">ambitious</span> businesses.
            </motion.h1>

            <motion.p variants={fadeUp} className="lead mt-6 max-w-xl">
              We partner with organisations across Kenya and beyond to design, build and scale websites, mobile apps and custom software that drive measurable growth.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-3">
              <Link to="/contact" className="btn-primary !px-7 !py-3.5">
                Start a project <ArrowRight size={16} />
              </Link>
              <Link to="/projects" className="btn-outline !px-7 !py-3.5">
                See our work
              </Link>
            </motion.div>

            <motion.ul variants={fadeUp} className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-ink-muted">
              {['Registered Kenyan company', 'Fixed-scope proposals', 'Post-launch support'].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="inline-flex w-5 h-5 items-center justify-center rounded-full bg-brand-rose-light text-brand-rose">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {t}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-lift aspect-[4/5] sm:aspect-[5/5] lg:aspect-[4/5]">
              <img
                src={PHOTOS.homeHero}
                alt="Nexora Creative Solutions Ltd designers and engineers mapping a product architecture"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-xs uppercase tracking-[0.18em] text-white/70">Thika · Nairobi · Remote</p>
                <p className="mt-1 font-display text-xl font-semibold">Strategy, design & engineering under one roof.</p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="hidden sm:flex absolute -left-8 top-10 card px-5 py-4 items-center gap-4"
            >
              <span className="font-display text-3xl font-extrabold text-brand-rose">{displayStats[0]?.value}</span>
              <span className="text-sm leading-tight text-ink-muted">{displayStats[0]?.label}</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.75, duration: 0.5 }}
              className="hidden sm:block absolute -right-6 bottom-28 card px-5 py-4"
            >
              <div className="flex gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <p className="mt-1 text-sm font-semibold text-ink">Rated 5.0 by clients</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ───────────────── Tech strip ───────────────── */}
      <section className="border-y border-line bg-brand-light/60">
        <div className="container-site py-8 flex flex-col md:flex-row md:items-center gap-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-subtle shrink-0">Built with</p>
          <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <motion.div
              className="flex gap-12 whitespace-nowrap w-max"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            >
              {[...techStack, ...techStack].map((t, i) => (
                <span key={i} className="font-display text-lg font-semibold text-ink/40">{t}</span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───────────────── Services ───────────────── */}
      <section className="section bg-white">
        <div className="container-site">
          <SectionHeading
            eyebrow="What we do"
            title="End-to-end digital capability"
            description="From first idea to production at scale - one accountable team for strategy, design and engineering."
            action={<Link to="/services" className="btn-outline">All services <ArrowRight size={16} /></Link>}
          />

          {loading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[0, 1, 2].map((i) => <div key={i} className="card h-64 animate-pulse bg-brand-light" />)}
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {displayServices.slice(0, 6).map((service, idx) => (
                <motion.div key={service.id ?? idx} variants={fadeUp}>
                  <Link
                    to={services.length > 0 ? `/services/${service.id}` : '/services'}
                    className="card-hover group flex h-full flex-col p-8"
                  >
                    <div className="flex items-start justify-between">
                      <span className="icon-tile"><LucideIcon name={service.icon} size={22} /></span>
                      <span className="font-display text-sm font-semibold text-ink-subtle">0{idx + 1}</span>
                    </div>
                    <h3 className="heading-md mt-8">{service.title}</h3>
                    <p className="mt-3 text-ink-muted leading-relaxed line-clamp-3 flex-1">{service.description}</p>
                    <span className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-rose">
                      Learn more <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ───────────────── Stats band ───────────────── */}
      <section className="relative bg-brand-navy text-white">
        <div className="absolute inset-0 bg-grid-light" aria-hidden="true" />
        <div className="relative container-site py-16 md:py-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 lg:grid-cols-4 gap-y-10"
          >
            {displayStats.slice(0, 4).map((stat, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                className={`px-6 ${idx % 2 === 1 ? 'border-l border-white/10' : ''} ${idx === 2 ? 'lg:border-l lg:border-white/10' : ''}`}
              >
                <p className="font-display text-4xl md:text-5xl font-extrabold tracking-tight">{stat.value}</p>
                <p className="mt-2 text-sm text-white/60">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───────────────── Process ───────────────── */}
      <section className="section bg-white">
        <div className="container-site">
          <SectionHeading
            align="center"
            eyebrow="How we work"
            title="A delivery process built on clarity"
            description="Every engagement follows a proven, transparent framework so you always know what is happening and why."
          />
          <motion.ol
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {process.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <motion.li key={step.title} variants={fadeUp} className="relative card p-7">
                  <span className="absolute top-7 right-7 font-display text-sm font-semibold text-ink-subtle">Step {idx + 1}</span>
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-navy text-white">
                    <StepIcon size={20} />
                  </span>
                  <h3 className="mt-6 font-display text-lg font-bold text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed">{step.text}</p>
                </motion.li>
              );
            })}
          </motion.ol>
        </div>
      </section>

      {/* ───────────────── Why Nexora ───────────────── */}
      <section className="section bg-brand-light">
        <div className="container-site grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <img
              src={PHOTOS.homeWhyNexora}
              alt="Product leaders reviewing a client roadmap"
              className="rounded-3xl shadow-lift w-full aspect-[5/4] object-cover"
            />
            <div className="absolute -bottom-8 left-8 right-8 sm:right-auto sm:max-w-xs card p-6">
              <div className="flex items-center gap-3">
                <span className="icon-tile !w-10 !h-10"><Building2 size={18} /></span>
                <div>
                  <p className="text-sm font-semibold text-ink">{COMPANY.legalName}</p>
                  <p className="text-xs text-ink-subtle">Private limited company · Kenya</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="pt-8 lg:pt-0">
            <SectionHeading
              className="!mb-10"
              eyebrow="Why Nexora"
              title="A partner you can hold accountable"
              description="Our incorporation as a private limited company formalises what clients have always valued: structure, governance and long-term commitment."
            />
            <motion.ul
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid sm:grid-cols-2 gap-x-8 gap-y-8"
            >
              {displayBenefits.slice(0, 4).map((item, idx) => (
                <motion.li key={idx} variants={fadeUp}>
                  <span className="inline-flex w-8 h-8 items-center justify-center rounded-full bg-brand-rose text-white">
                    <Check size={16} strokeWidth={3} />
                  </span>
                  <h3 className="mt-4 font-display text-base font-bold text-ink">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed">{item.description || item.desc}</p>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>
      </section>

      {/* ───────────────── Testimonials ───────────────── */}
      <section className="section bg-white">
        <div className="container-site">
          <SectionHeading
            align="center"
            eyebrow="Client voices"
            title="Trusted by teams that ship"
          />
          <div className="grid md:grid-cols-2 gap-6">
            {displayTestimonials.slice(0, 4).map((item, idx) => (
              <motion.figure
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="card p-8 md:p-10 flex flex-col"
              >
                <Quote size={28} className="text-brand-rose/30" />
                <blockquote className="mt-4 text-lg leading-relaxed text-ink flex-1">“{item.text}”</blockquote>
                <figcaption className="mt-8 pt-6 border-t border-line flex items-center gap-4">
                  {item.image ? (
                    <img src={resolveMediaUrl(item.image)} alt={item.name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <span className="inline-flex w-12 h-12 items-center justify-center rounded-full bg-brand-navy text-white font-display font-bold">
                      {item.name?.charAt(0)}
                    </span>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-ink">{item.name}</p>
                    <p className="text-sm text-ink-subtle">{[item.role, item.company].filter(Boolean).join(', ')}</p>
                  </div>
                  <div className="hidden sm:flex gap-0.5 text-amber-400">
                    {[...Array(item.rating || 5)].map((_, s) => <Star key={s} size={14} fill="currentColor" />)}
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
};

export default Home;
