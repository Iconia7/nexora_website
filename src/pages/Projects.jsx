import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Github, Star, GitFork, Loader2, CheckCircle, AlertCircle, Globe, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReCAPTCHA from 'react-google-recaptcha';
import toast from 'react-hot-toast';
import { fetchProjects, fetchServices, submitContactMessage, resolveMediaUrl } from '../api';
import newton from '../assets/newton.jpeg';
import SEO from '../components/SEO';
import PageHeader from '../components/ui/PageHeader';
import { useCompany } from '../context/CompanyContext';
import { PHOTOS } from '../config/photos';

const Projects = () => {
  const { company: COMPANY } = useCompany();
  const [filter, setFilter] = useState('All');
  const [githubRepos, setGithubRepos] = useState([]);
  const [apiProjects, setApiProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const captchaRef = useRef(null);

  const [formData, setFormData] = useState({ name: '', email: '' });
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [projectsRes, servicesRes] = await Promise.all([fetchProjects(), fetchServices()]);
        setApiProjects(projectsRes.data || []);
        setServices(servicesRes.data || []);
      } catch (err) {
        console.error('Error fetching projects/services:', err);
      }
    };

    const fetchRepos = async () => {
      try {
        const response = await fetch('https://api.github.com/users/Iconia7/repos?sort=updated&per_page=6');
        const data = await response.json();

        if (Array.isArray(data)) {
          const formattedRepos = data.map((repo) => ({
            id: `gh-${repo.id}`,
            title: repo.name.replace(/-/g, ' '),
            category: 'GitHub',
            image: PHOTOS.projectsGithubFallback,
            description: repo.description || 'Open-source repository from our engineering team.',
            link: repo.html_url,
            isExternal: true,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language,
          }));
          setGithubRepos(formattedRepos);
        }
      } catch (error) {
        console.error('Error fetching GitHub repos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    fetchRepos();
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
        service: 'Project Consultation',
        message: 'User viewed Projects page and requested a consultation.',
        source: 'Projects Page',
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

  const allProjects = [...apiProjects, ...githubRepos];
  const categories = ['All', ...services.map((s) => s.title), 'GitHub'];

  const filteredProjects =
    filter === 'All'
      ? allProjects
      : allProjects.filter((p) => {
          if (Array.isArray(p.categories)) {
            return p.categories.includes(filter);
          }
          return p.category === filter;
        });

  return (
    <div className="overflow-hidden">
      <SEO
        title={`Project Portfolio | Software, Web & Mobile Case Studies | ${COMPANY.legalName}`}
        description={`Explore ${COMPANY.legalName}'s portfolio of custom software, mobile apps, and high-performance websites built for businesses in Kenya and globally.`}
        url="/projects"
        image="/ncs.png"
        keywords={[
          'Nexora portfolio',
          'web development projects Kenya',
          'mobile app portfolio Nairobi',
          'software case studies',
          'tech projects Kenya',
        ]}
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Projects', item: '/projects' },
        ]}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: `${COMPANY.legalName} Project Portfolio`,
          description: `Showcase of deployed software applications, websites, and mobile platforms by ${COMPANY.legalName}.`,
          url: `${COMPANY.siteUrl}/projects`,
        }}
      />

      <PageHeader
        eyebrow="Selected work"
        title={
          <>
            Products shipped for <span className="text-brand-rose">real-world scale</span>.
          </>
        }
        description="Browse our client deployments, production systems, and open-source engineering contributions."
        breadcrumbs={[{ label: 'Projects' }]}
      />

      {/* Portfolio Filter & Grid */}
      <section className="section bg-white">
        <div className="container-site">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2.5 mb-12" role="tablist" aria-label="Filter projects by category">
            {categories.map((cat) => {
              const active = filter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    active
                      ? 'bg-brand-navy text-white'
                      : 'border border-line bg-white text-ink-muted hover:border-ink hover:text-ink'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="card h-96 animate-pulse bg-brand-light" />
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="card p-14 text-center">
              <p className="heading-md">No projects in this category yet</p>
              <p className="mt-2 text-ink-muted">Try selecting another category to explore our work.</p>
              <button type="button" onClick={() => setFilter('All')} className="btn-outline mt-6">
                Show all projects
              </button>
            </div>
          ) : (
            <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project) => {
                  const categoryLabel = Array.isArray(project.categories)
                    ? project.categories.join(' · ')
                    : project.category;

                  return (
                    <motion.article
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.3 }}
                      key={project.id}
                      className="card-hover group flex flex-col overflow-hidden"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-brand-navy/95 flex items-center justify-center">
                        {project.image ? (
                          <img
                            src={resolveMediaUrl(project.image)}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-grid-light flex items-center justify-center p-6 text-center">
                            <span className="font-display text-2xl font-extrabold text-white/80">
                              {project.title}
                            </span>
                          </div>
                        )}
                        <div className="absolute top-3 right-3 flex gap-1.5">
                          {!project.isExternal && project.live_url && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur px-2.5 py-1 text-[11px] font-semibold text-ink shadow-sm">
                              <Globe size={11} className="text-brand-rose" /> Live
                            </span>
                          )}
                          {!project.isExternal && project.playstore_url && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur px-2.5 py-1 text-[11px] font-semibold text-ink shadow-sm">
                              <Smartphone size={11} className="text-brand-rose" /> App
                            </span>
                          )}
                          {project.isExternal && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-brand-navy/90 backdrop-blur px-2.5 py-1 text-[11px] font-semibold text-white">
                              <Github size={11} /> Open Source
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-6 flex flex-col flex-1">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-rose">
                          {categoryLabel}
                        </p>
                        <h3 className="mt-2 font-display text-xl font-bold text-ink line-clamp-2 capitalize">
                          {project.title}
                        </h3>
                        {(project.description || project.challenge || project.solution) && (
                          <p className="mt-2.5 text-sm text-ink-muted line-clamp-2 leading-relaxed flex-1">
                            {project.description || project.challenge || project.solution}
                          </p>
                        )}

                        {project.isExternal && (
                          <div className="mt-4 flex items-center gap-4 text-xs text-ink-subtle">
                            <span className="inline-flex items-center gap-1">
                              <Star size={13} className="text-amber-500" /> {project.stars}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <GitFork size={13} /> {project.forks}
                            </span>
                            {project.language && <span className="font-mono text-ink">{project.language}</span>}
                          </div>
                        )}

                        <div className="mt-6 pt-5 border-t border-line">
                          {project.isExternal ? (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink hover:text-brand-rose transition-colors"
                            >
                              <Github size={16} /> View repository <ArrowUpRight size={15} />
                            </a>
                          ) : (
                            <Link
                              to={`/projects/${project.id}`}
                              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-rose"
                            >
                              Read case study{' '}
                              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Consultation Form Band */}
      <section className="section bg-brand-light">
        <div className="container-site">
          <div className="relative overflow-hidden rounded-3xl bg-brand-navy text-white p-8 md:p-14 lg:p-16">
            <div className="absolute inset-0 bg-grid-light" aria-hidden="true" />
            <div
              className="absolute -top-32 -right-24 w-[440px] h-[440px] rounded-full bg-brand-rose/25 blur-[120px] pointer-events-none"
              aria-hidden="true"
            />

            <div className="relative grid lg:grid-cols-[1.3fr_0.7fr] gap-12 items-center">
              <div>
                <span className="eyebrow !text-white/70">Start a conversation</span>
                <h2 className="heading-lg !text-white mt-4">Planning your next digital product?</h2>
                <p className="mt-4 text-white/70 max-w-xl leading-relaxed">
                  Leave your details for a complimentary scoping consultation with {COMPANY.legalName}.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4 max-w-lg">
                  <div className="grid sm:grid-cols-2 gap-3.5">
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
                  </div>

                  <div className="overflow-x-auto">
                    <ReCAPTCHA ref={captchaRef} sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} theme="dark" />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading' || status === 'success'}
                    className={`px-7 py-3.5 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2 ${
                      status === 'success'
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-brand-rose text-white hover:bg-brand-rose-dark'
                    }`}
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="animate-spin" size={16} /> Sending...
                      </>
                    ) : status === 'success' ? (
                      <>
                        <CheckCircle size={16} /> Consultation Requested
                      </>
                    ) : (
                      <>
                        Request Free Consultation <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                  {status === 'error' && (
                    <p className="text-red-300 text-sm flex items-center gap-1.5">
                      <AlertCircle size={14} /> Something went wrong. Please try again.
                    </p>
                  )}
                </form>
              </div>

              <div className="hidden lg:flex flex-col items-center text-center">
                <div className="relative">
                  <img
                    src={newton}
                    alt="Newton Mwangi, Founder & Managing Director"
                    className="w-56 h-56 object-cover rounded-2xl border border-white/15 shadow-lift"
                  />
                </div>
                <p className="mt-5 font-display font-bold text-white">Newton Mwangi</p>
                <p className="text-xs text-white/60">Founder &amp; Managing Director, {COMPANY.legalName}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
