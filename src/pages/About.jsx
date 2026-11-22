import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, ShieldCheck, Handshake, Lightbulb, Gauge, Linkedin, Star, Quote } from 'lucide-react';
import { fetchTeamMembers, fetchStats, fetchTestimonials, resolveMediaUrl } from '../api';
import SEO from '../components/SEO';
import PageHeader from '../components/ui/PageHeader';
import SectionHeading from '../components/ui/SectionHeading';
import CTASection from '../components/ui/CTASection';
import { useCompany } from '../context/CompanyContext';
import { PHOTOS } from '../config/photos';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const values = [
  { icon: ShieldCheck, title: 'Integrity', text: 'Honest advice, transparent pricing and clear contracts - even when it means saying no.' },
  { icon: Gauge, title: 'Engineering excellence', text: 'Secure, maintainable, well-tested code that keeps performing long after launch.' },
  { icon: Handshake, title: 'Partnership', text: 'We embed with your team and measure our success by your business outcomes.' },
  { icon: Lightbulb, title: 'Pragmatic innovation', text: 'Modern technology applied where it creates real value - not for its own sake.' },
];

const techStack = ['React.js', 'Flutter & Dart', 'Python & Django', 'Node.js', 'Safaricom Daraja API', 'PostgreSQL', 'Firebase', 'AWS'];

const About = () => {
  const { company: COMPANY, formatAddress } = useCompany();
  const [team, setTeam] = useState([]);
  const [stats, setStats] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchTeamMembers(), fetchStats(), fetchTestimonials()])
      .then(([teamRes, statsRes, testimonialsRes]) => {
        setTeam(teamRes.data || []);
        setStats(statsRes.data || []);
        setTestimonials(testimonialsRes.data || []);
      })
      .catch((err) => console.error('Error fetching about page data:', err))
      .finally(() => setLoading(false));
  }, []);

  const displayStats = stats.length > 0 ? stats : [
    { value: '200+', label: 'Systems deployed' },
    { value: '50+', label: 'Business clients' },
    { value: '5+', label: 'Years of delivery' },
  ];

  const displayTestimonials = testimonials.length > 0 ? testimonials : [
    { name: 'Director of Operations', company: 'Tech Logistics Africa', text: "Nexora didn't just build us a website; they architected a complete digital platform. Their understanding of backend systems and APIs transformed how we do business online.", rating: 5 },
    { name: 'Lead Engineer', company: 'FinTech Solutions', text: "Exceptional engineering and attention to detail. The integration with Safaricom's Daraja API was seamless and secure.", rating: 5 },
  ];

  const companyFacts = [
    { label: 'Registered name', value: COMPANY.legalName },
    { label: 'Company type', value: COMPANY.legalForm },
    { label: 'Jurisdiction', value: `${COMPANY.jurisdiction} · Companies Act, 2015` },
    ...(COMPANY.registrationNumber ? [{ label: 'Registration No.', value: COMPANY.registrationNumber }] : []),
    ...(COMPANY.kraPin ? [{ label: 'KRA PIN', value: COMPANY.kraPin }] : []),
    { label: 'Registered office', value: formatAddress() },
  ];

  return (
    <div className="overflow-hidden">
      <SEO
        title={`About Us | ${COMPANY.legalName} | Technology Company in Kenya`}
        description={`Learn about ${COMPANY.legalName}, a Kenyan private limited company engineering scalable web platforms, fintech integrations and mobile apps for growing businesses.`}
        url="/about"
        image="/ncs.png"
        keywords={['about Nexora', 'Nexora Creative Solutions Ltd', 'software company Kenya', 'tech company Kenya', 'software engineers Nairobi']}
        breadcrumbs={[{ name: 'Home', item: '/' }, { name: 'About Us', item: '/about' }]}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: `About ${COMPANY.legalName}`,
          description: COMPANY.description,
          url: `${COMPANY.siteUrl}/about`,
          mainEntity: { '@id': `${COMPANY.siteUrl}/#organization` },
        }}
      />

      <PageHeader
        eyebrow="About us"
        title={<>Built to be your long-term <span className="text-brand-rose">technology partner</span>.</>}
        description={`${COMPANY.brandName} has grown from an independent studio into ${COMPANY.legalName} - a registered private limited company with the structure, governance and team to deliver at scale.`}
        breadcrumbs={[{ label: 'About' }]}
      />

      {/* ───────── Story ───────── */}
      <section className="section bg-white">
        <div className="container-site grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.span variants={fadeUp} className="eyebrow">Our story</motion.span>
            <motion.h2 variants={fadeUp} className="heading-lg mt-4">
              From creative studio to incorporated company
            </motion.h2>
            <motion.p variants={fadeUp} className="lead mt-6">
              We started with a simple belief: businesses in Kenya deserve world-class digital products. Over the years we have engineered fintech pipelines, e-commerce platforms, mobile apps and brand systems for clients across the region.
            </motion.p>
            <motion.p variants={fadeUp} className="mt-4 leading-relaxed">
              Incorporating as <strong className="text-ink">{COMPANY.legalName}</strong> is the next step in that journey. It gives our clients a formal contracting entity, clearer accountability and the confidence that we are here for the long term - while our team, our standards and our commitment to craft stay exactly the same.
            </motion.p>

            <motion.dl variants={fadeUp} className="mt-10 grid grid-cols-3 gap-6 border-t border-line pt-8">
              {displayStats.slice(0, 3).map((s, i) => (
                <div key={i}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="font-display text-3xl md:text-4xl font-extrabold text-ink">{s.value}</dd>
                  <p className="mt-1 text-sm text-ink-subtle">{s.label}</p>
                </div>
              ))}
            </motion.dl>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            <img src={PHOTOS.aboutStoryLeft} className="rounded-2xl shadow-soft mt-10 aspect-[4/5] object-cover object-right" alt="Software engineer coding on a dual-monitor workstation" />
            <img src={PHOTOS.aboutStoryRight} className="rounded-2xl shadow-soft aspect-[4/5] object-cover" alt="Modern sunlit Nexora Creative Solutions Ltd studio" />
          </motion.div>
        </div>
      </section>

      {/* ───────── Mission / Vision ───────── */}
      <section className="section bg-brand-light">
        <div className="container-site grid md:grid-cols-2 gap-6">
          {[
            { icon: Target, label: 'Mission', text: COMPANY.mission || 'To help organisations grow by designing and engineering secure, scalable and beautifully crafted digital products.' },
            { icon: Eye, label: 'Vision', text: COMPANY.vision || 'To be East Africa’s most trusted technology partner for businesses building the digital economy.' },
          ].map((item) => {
            const CardIcon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="card p-8 md:p-10"
              >
                <span className="icon-tile"><CardIcon size={22} /></span>
                <h3 className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-ink-subtle">Our {item.label}</h3>
                <p className="mt-3 font-display text-xl md:text-2xl font-semibold text-ink leading-snug">{item.text}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ───────── Values ───────── */}
      <section className="section bg-white">
        <div className="container-site">
          <SectionHeading align="center" eyebrow="Our values" title="The principles behind every engagement" />
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {values.map((item) => {
              const ValueIcon = item.icon;
              return (
                <motion.div key={item.title} variants={fadeUp} className="card p-7">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-navy text-white"><ValueIcon size={20} /></span>
                  <h3 className="mt-6 font-display text-lg font-bold text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed">{item.text}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ───────── Corporate information ───────── */}
      <section className="relative bg-brand-navy text-white">
        <div className="absolute inset-0 bg-grid-light" aria-hidden="true" />
        <div className="relative container-site section grid lg:grid-cols-[1fr_1.2fr] gap-14 items-start">
          <div>
            <span className="eyebrow !text-white/70">Corporate information</span>
            <h2 className="heading-lg !text-white mt-4">{COMPANY.legalName}</h2>
            <p className="mt-5 text-white/70 text-lg leading-relaxed">
              {COMPANY.incorporationStatement} All client agreements, proposals and invoices are issued by the company.
            </p>
          </div>
          <dl className="rounded-2xl border border-white/10 bg-white/[0.03] divide-y divide-white/10">
            {companyFacts.map((f) => (
              <div key={f.label} className="grid sm:grid-cols-[180px_1fr] gap-1 sm:gap-6 px-6 py-5">
                <dt className="text-sm text-white/50">{f.label}</dt>
                <dd className="font-medium text-white">{f.value}</dd>
              </div>
            ))}
            <div className="grid sm:grid-cols-[180px_1fr] gap-1 sm:gap-6 px-6 py-5">
              <dt className="text-sm text-white/50">Directors</dt>
              <dd className="space-y-1">
                {COMPANY.directors.map((d) => (
                  <p key={d.name} className="font-medium text-white">
                    {d.name} <span className="text-white/50 font-normal">· {d.role}</span>
                  </p>
                ))}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ───────── Leadership ───────── */}
      <section className="section bg-white">
        <div className="container-site">
          <SectionHeading
            eyebrow="Leadership"
            title="The people accountable for your project"
            description="Our leadership team brings together engineering depth, design craft and commercial experience."
          />

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0, 1, 2].map((i) => <div key={i} className="card h-[420px] animate-pulse bg-brand-light" />)}
            </div>
          ) : team.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map((member, idx) => (
                <motion.article
                  key={member.id ?? idx}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.5 }}
                  className="card overflow-hidden group"
                >
                  <div className="aspect-[4/4] overflow-hidden bg-brand-light flex items-center justify-center">
                    {member.image ? (
                      <img src={resolveMediaUrl(member.image)} alt={member.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                    ) : (
                      <span className="inline-flex w-20 h-20 items-center justify-center rounded-full bg-brand-navy text-white font-display text-3xl font-bold">
                        {member.name?.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-lg font-bold text-ink">{member.name}</h3>
                        <p className="text-sm font-medium text-brand-rose">{member.role}</p>
                      </div>
                      {member.linkedin && (
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on LinkedIn`} className="text-ink-subtle hover:text-brand-rose">
                          <Linkedin size={18} />
                        </a>
                      )}
                    </div>
                    {member.bio && <p className="mt-3 text-sm leading-relaxed line-clamp-3">{member.bio}</p>}
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

      {/* ───────── Tech stack ───────── */}
      <section className="border-y border-line bg-brand-light/60">
        <div className="container-site py-10 flex flex-col md:flex-row md:items-center gap-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-subtle shrink-0">Our toolkit</p>
          <ul className="flex flex-wrap gap-2">
            {techStack.map((t) => (
              <li key={t} className="rounded-full border border-line bg-white px-4 py-1.5 text-sm font-medium text-ink">{t}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────── Testimonials ───────── */}
      <section className="section bg-white">
        <div className="container-site">
          <SectionHeading align="center" eyebrow="Client voices" title="What our clients say" />
          <div className="grid md:grid-cols-2 gap-6">
            {displayTestimonials.slice(0, 4).map((item, idx) => (
              <figure key={idx} className="card p-8 md:p-10 flex flex-col">
                <Quote size={28} className="text-brand-rose/30" />
                <blockquote className="mt-4 text-lg leading-relaxed text-ink flex-1">“{item.text}”</blockquote>
                <figcaption className="mt-8 pt-6 border-t border-line flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-ink">{item.name}</p>
                    <p className="text-sm text-ink-subtle">{[item.role, item.company].filter(Boolean).join(', ')}</p>
                  </div>
                  <div className="flex gap-0.5 text-amber-400">
                    {[...Array(item.rating || 5)].map((_, s) => <Star key={s} size={14} fill="currentColor" />)}
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Work with a registered, accountable technology partner."
        secondary={{ label: 'Meet the team', to: '/team' }}
      />
    </div>
  );
};

export default About;
