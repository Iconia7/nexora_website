import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, Briefcase, Loader2, CheckCircle, AlertCircle, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import ReCAPTCHA from 'react-google-recaptcha';
import toast from 'react-hot-toast';
import { fetchTeamMemberById, submitContactMessage, resolveMediaUrl } from '../api';
import SEO from '../components/SEO';
import PageHeader from '../components/ui/PageHeader';
import { useCompany } from '../context/CompanyContext';

const SocialIconMap = {
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
};

const TeamDetails = () => {
  const { company: COMPANY } = useCompany();
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loadedId, setLoadedId] = useState(null);
  const loading = loadedId !== id;
  const captchaRef = useRef(null);

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    let active = true;
    fetchTeamMemberById(id)
      .then((res) => {
        if (!active) return;
        setMember(res.data);
        setLoadedId(id);
      })
      .catch((err) => {
        if (!active) return;
        console.error('Error fetching team member:', err);
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
        service: `Direct Message for ${member.name}`,
        message: formData.message,
        source: 'Team Profile Page',
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

  if (!member) {
    return (
      <div className="min-h-[60vh] pt-36 pb-20 container-site text-center">
        <h1 className="heading-lg">Team member not found</h1>
        <p className="mt-3 text-ink-muted">This profile could not be found.</p>
        <Link to="/team" className="btn-primary mt-8">
          Back to Team
        </Link>
      </div>
    );
  }

  const socialEntries = member.socials
    ? Object.entries(member.socials)
    : ['facebook', 'twitter', 'linkedin', 'instagram']
      .filter((k) => member[k])
      .map((k) => [k, member[k]]);

  return (
    <div className="overflow-hidden">
      <SEO
        title={`${member.name} — ${member.role} | ${COMPANY.legalName}`}
        description={`Meet ${member.name}, ${member.role} at ${COMPANY.legalName}. Dedicated to engineering and design excellence.`}
        url={`/team/${member.id}`}
        image={member.image ? resolveMediaUrl(member.image) : undefined}
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Our Team', item: '/team' },
          { name: member.name, item: `/team/${member.id}` },
        ]}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: member.name,
          jobTitle: member.role,
          description: member.bio || `${member.role} at ${COMPANY.legalName}`,
          url: `${COMPANY.siteUrl}/team/${member.id}`,
          ...(member.image ? { image: resolveMediaUrl(member.image) } : {}),
          worksFor: { '@id': `${COMPANY.siteUrl}/#organization` },
          ...(Array.isArray(member.skills) && member.skills.length > 0
            ? { knowsAbout: member.skills.map((s) => s.name) }
            : {}),
          sameAs: socialEntries.map(([, url]) => url).filter(Boolean),
        }}
      />

      <PageHeader
        eyebrow={member.role || 'Team profile'}
        title={member.name}
        breadcrumbs={[
          { label: 'Team', to: '/team' },
          { label: member.name },
        ]}
      />

      <section className="section bg-white">
        <div className="container-site grid lg:grid-cols-[340px_1fr] gap-12 lg:gap-16 items-start">
          {/* Profile Card */}
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card overflow-hidden sticky top-28"
          >
            <div className="aspect-[4/4] bg-brand-light overflow-hidden flex items-center justify-center">
              {member.image ? (
                <img src={resolveMediaUrl(member.image)} alt={member.name} className="w-full h-full object-cover" />
              ) : (
                <span className="inline-flex w-24 h-24 items-center justify-center rounded-full bg-brand-navy text-white font-display text-4xl font-bold">
                  {member.name?.charAt(0)}
                </span>
              )}
            </div>
            <div className="p-7">
              <h2 className="font-display text-xl font-bold text-ink">{member.name}</h2>
              <p className="text-sm font-medium text-brand-rose mt-0.5">{member.role}</p>

              <div className="mt-6 pt-6 border-t border-line space-y-3 text-sm text-ink-muted">
                {member.email && (
                  <a href={`mailto:${member.email}`} className="flex items-center gap-3 hover:text-brand-rose transition-colors">
                    <Mail size={16} className="text-brand-rose shrink-0" />
                    <span className="truncate">{member.email}</span>
                  </a>
                )}
                {member.phone && (
                  <a href={`tel:${member.phone}`} className="flex items-center gap-3 hover:text-brand-rose transition-colors">
                    <Phone size={16} className="text-brand-rose shrink-0" />
                    <span>{member.phone}</span>
                  </a>
                )}
                {member.experience && (
                  <div className="flex items-center gap-3">
                    <Briefcase size={16} className="text-brand-rose shrink-0" />
                    <span>{member.experience} Experience</span>
                  </div>
                )}
              </div>

              {socialEntries.length > 0 && (
                <div className="mt-6 pt-6 border-t border-line flex gap-2">
                  {socialEntries.map(([platform, url]) => {
                    const Icon = SocialIconMap[platform];
                    return Icon && url ? (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} on ${platform}`}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-line text-ink-muted hover:border-brand-rose hover:text-brand-rose transition-colors"
                      >
                        <Icon size={15} />
                      </a>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          </motion.aside>

          {/* Bio, Skills & Direct Message */}
          <div className="space-y-12">
            <div>
              <span className="eyebrow">Biography</span>
              <h2 className="heading-lg mt-3 mb-5">About {member.name}</h2>
              {member.bio && <p className="lead">{member.bio}</p>}
              <p className="mt-4 text-ink-muted leading-relaxed">
                As part of {COMPANY.legalName}, {member.name} partners closely with clients from discovery through launch to deliver reliable, well-crafted digital systems.
              </p>
            </div>

            {Array.isArray(member.skills) && member.skills.length > 0 && (
              <div className="pt-10 border-t border-line">
                <h3 className="heading-md mb-6">Core competencies</h3>
                <div className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
                  {member.skills.map((skill, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between mb-2 text-sm font-semibold text-ink">
                        <span>{skill.name}</span>
                        <span className="text-ink-subtle">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-brand-light rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className="bg-brand-rose h-full rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Direct Contact Form */}
            <div className="rounded-2xl bg-brand-navy text-white p-8 md:p-10 relative overflow-hidden">
              <div
                className="absolute -top-24 -right-24 w-64 h-64 bg-brand-rose/25 rounded-full blur-3xl pointer-events-none"
                aria-hidden="true"
              />
              <div className="relative">
                <span className="eyebrow !text-white/70">Direct message</span>
                <h3 className="heading-md !text-white mt-3">Contact {member.name}</h3>

                <form onSubmit={handleSubmit} className="mt-7 grid sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name *"
                    required
                    className="rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/45 focus:outline-none focus:border-brand-rose"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Work email *"
                    required
                    className="rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/45 focus:outline-none focus:border-brand-rose"
                  />
                  <div className="sm:col-span-2">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Write your message *"
                      required
                      className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/45 focus:outline-none focus:border-brand-rose"
                    />
                  </div>

                  <div className="sm:col-span-2 overflow-x-auto">
                    <ReCAPTCHA ref={captchaRef} sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} theme="dark" />
                  </div>

                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      disabled={status === 'loading' || status === 'success'}
                      className={`w-full sm:w-auto px-7 py-3.5 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2 ${status === 'success'
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
                          <CheckCircle size={16} /> Message Sent
                        </>
                      ) : status === 'error' ? (
                        <>
                          <AlertCircle size={16} /> Failed — Try Again
                        </>
                      ) : (
                        <>
                          Send Message <Send size={15} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TeamDetails;
