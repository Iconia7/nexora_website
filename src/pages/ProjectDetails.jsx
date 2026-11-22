import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle,
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Calendar,
  User,
  Star,
  Loader2,
  AlertCircle,
  Globe,
  Smartphone,
  Palette,
  Share2,
  Play,
  X,
  Layers,
  Quote,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReCAPTCHA from 'react-google-recaptcha';
import toast from 'react-hot-toast';
import { fetchProjectById, fetchProjects, submitContactMessage, resolveMediaUrl } from '../api';
import SEO from '../components/SEO';
import PageHeader from '../components/ui/PageHeader';
import { useCompany } from '../context/CompanyContext';

const ProjectDetails = () => {
  const { company: COMPANY } = useCompany();
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [otherProjects, setOtherProjects] = useState([]);
  const [loadedId, setLoadedId] = useState(null);
  const loading = loadedId !== id;
  const captchaRef = useRef(null);

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    let active = true;
    Promise.all([fetchProjectById(id), fetchProjects()])
      .then(([detailRes, listRes]) => {
        if (!active) return;
        setProject(detailRes.data);
        setOtherProjects((listRes.data || []).filter((p) => p.id !== detailRes.data.id).slice(0, 2));
        setLoadedId(id);
      })
      .catch((err) => {
        if (!active) return;
        console.error('Error fetching project details:', err);
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
        service: `Similar to: ${project.title}`,
        message: formData.message || `Interested in a project similar to ${project.title}.`,
        source: 'Project Details Page',
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

  if (!project) {
    return (
      <div className="min-h-[60vh] pt-36 pb-20 container-site text-center">
        <h1 className="heading-lg">Project not found</h1>
        <p className="mt-3 text-ink-muted">This case study could not be found.</p>
        <Link to="/projects" className="btn-primary mt-8">
          Back to Projects
        </Link>
      </div>
    );
  }

  const hasResources =
    project.live_url || project.playstore_url || project.figma_url || project.social_url || project.video_url;

  return (
    <div className="overflow-hidden">
      <SEO
        title={`${project.title} | Case Study | ${COMPANY.legalName}`}
        description={`Discover how ${COMPANY.legalName} built ${project.title}, featuring ${
          Array.isArray(project.tech_stack) ? project.tech_stack.join(', ') : 'modern software architecture'
        }.`}
        url={`/projects/${project.id}`}
        image={project.image || '/ncs.png'}
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Projects', item: '/projects' },
          { name: project.title, item: `/projects/${project.id}` },
        ]}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: project.title,
          description: project.description || `Case study of ${project.title} by ${COMPANY.legalName}.`,
          author: {
            '@type': 'Organization',
            name: COMPANY.legalName,
            url: COMPANY.siteUrl,
          },
        }}
      />

      <PageHeader
        eyebrow={project.categories?.join(' · ') || 'Case study'}
        title={project.title}
        description={project.description || project.challenge || project.solution}
        breadcrumbs={[
          { label: 'Projects', to: '/projects' },
          { label: project.title },
        ]}
      />

      <section className="section bg-white">
        <div className="container-site">
          {/* Hero Showcase Image */}
          {project.image && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl overflow-hidden shadow-lift mb-14 aspect-[16/9] max-h-[540px] bg-brand-light"
            >
              <img src={resolveMediaUrl(project.image)} alt={project.title} className="w-full h-full object-cover" />
            </motion.div>
          )}

          <div className="grid lg:grid-cols-[1fr_360px] gap-12 lg:gap-16 items-start">
            {/* Case Study Narrative */}
            <div className="space-y-12">
              {project.challenge && (
                <div>
                  <span className="eyebrow">01 · Context</span>
                  <h2 className="heading-md mt-3 mb-4">The challenge</h2>
                  <p className="text-ink-muted leading-relaxed text-base sm:text-lg">{project.challenge}</p>
                </div>
              )}

              {project.solution && (
                <div className="pt-8 border-t border-line">
                  <span className="eyebrow">02 · Architecture</span>
                  <h2 className="heading-md mt-3 mb-4">The solution</h2>
                  <p className="text-ink-muted leading-relaxed text-base sm:text-lg">{project.solution}</p>
                </div>
              )}

              {project.tech_stack?.length > 0 && (
                <div className="pt-8 border-t border-line">
                  <h3 className="heading-md mb-5">Technology stack</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {project.tech_stack.map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-2 rounded-full border border-line bg-brand-light px-4 py-2 text-sm font-medium text-ink"
                      >
                        <CheckCircle className="text-brand-rose" size={14} /> {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery */}
              {project.gallery?.length > 0 && (
                <div className="pt-8 border-t border-line">
                  <h3 className="heading-md mb-6">Project gallery</h3>
                  <div className="grid sm:grid-cols-2 gap-5">
                    {project.gallery.map((img, idx) => (
                      <button
                        type="button"
                        key={img.id ?? idx}
                        onClick={() => setSelectedImage(resolveMediaUrl(img.image))}
                        className="relative group overflow-hidden rounded-2xl border border-line text-left cursor-zoom-in"
                      >
                        <img
                          src={resolveMediaUrl(img.image)}
                          alt={img.caption || `${project.title} screen ${idx + 1}`}
                          className="w-full h-60 object-cover transition duration-500 group-hover:scale-105"
                        />
                        {img.caption && (
                          <div className="p-3 bg-white border-t border-line">
                            <p className="text-xs font-medium text-ink">{img.caption}</p>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {project.impact && (
                <div className="pt-8 border-t border-line">
                  <span className="eyebrow">03 · Results</span>
                  <h2 className="heading-md mt-3 mb-4">The impact</h2>
                  <p className="text-ink-muted leading-relaxed text-base sm:text-lg">{project.impact}</p>
                </div>
              )}

              {/* Testimonial */}
              {(project.testimonial_text || project.testimonial_author) && (
                <figure className="card p-8 bg-brand-light/70">
                  <Quote size={26} className="text-brand-rose/40" />
                  <blockquote className="mt-4 text-lg text-ink leading-relaxed">
                    &ldquo;
                    {project.testimonial_text ||
                      `Working with ${COMPANY.legalName} was a turning point. They understood our goals and delivered reliably.`}
                    &rdquo;
                  </blockquote>
                  <figcaption className="mt-6 pt-5 border-t border-line flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-ink">{project.testimonial_author || 'Client Partner'}</p>
                      {project.client && <p className="text-sm text-ink-subtle">{project.client}</p>}
                    </div>
                    <div className="flex gap-0.5 text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={14} fill="currentColor" />
                      ))}
                    </div>
                  </figcaption>
                </figure>
              )}
            </div>

            {/* Sidebar */}
            <aside className="sticky top-28 space-y-6">
              {/* Metadata Card */}
              <div className="card p-7">
                <h3 className="font-display text-lg font-bold text-ink pb-4 border-b border-line">Project overview</h3>
                <dl className="mt-5 space-y-4 text-sm">
                  {project.client && (
                    <div className="flex items-start gap-3">
                      <User size={16} className="text-brand-rose mt-0.5 shrink-0" />
                      <div>
                        <dt className="text-ink-subtle text-xs">Client</dt>
                        <dd className="font-semibold text-ink">{project.client}</dd>
                      </div>
                    </div>
                  )}
                  {project.date && (
                    <div className="flex items-start gap-3">
                      <Calendar size={16} className="text-brand-rose mt-0.5 shrink-0" />
                      <div>
                        <dt className="text-ink-subtle text-xs">Completed</dt>
                        <dd className="font-semibold text-ink">{project.date}</dd>
                      </div>
                    </div>
                  )}
                  {project.location && (
                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="text-brand-rose mt-0.5 shrink-0" />
                      <div>
                        <dt className="text-ink-subtle text-xs">Location</dt>
                        <dd className="font-semibold text-ink">{project.location}</dd>
                      </div>
                    </div>
                  )}
                  {project.categories?.length > 0 && (
                    <div className="flex items-start gap-3">
                      <Layers size={16} className="text-brand-rose mt-0.5 shrink-0" />
                      <div>
                        <dt className="text-ink-subtle text-xs">Disciplines</dt>
                        <dd className="font-semibold text-ink">{project.categories.join(', ')}</dd>
                      </div>
                    </div>
                  )}
                </dl>

                {hasResources && (
                  <div className="mt-6 pt-6 border-t border-line space-y-2.5">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-subtle mb-3">
                      Project links
                    </p>
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary w-full justify-between"
                      >
                        <span className="inline-flex items-center gap-2">
                          <Globe size={16} /> Visit Live Website
                        </span>
                        <ArrowUpRight size={15} />
                      </a>
                    )}
                    {project.playstore_url && (
                      <a
                        href={project.playstore_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-dark w-full justify-between"
                      >
                        <span className="inline-flex items-center gap-2">
                          <Smartphone size={16} /> Google Play Store
                        </span>
                        <ArrowUpRight size={15} />
                      </a>
                    )}
                    {project.figma_url && (
                      <a
                        href={project.figma_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline w-full justify-between"
                      >
                        <span className="inline-flex items-center gap-2">
                          <Palette size={16} /> Figma Prototype
                        </span>
                        <ArrowUpRight size={15} />
                      </a>
                    )}
                    {project.social_url && (
                      <a
                        href={project.social_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline w-full justify-between"
                      >
                        <span className="inline-flex items-center gap-2">
                          <Share2 size={16} /> Social Showcase
                        </span>
                        <ArrowUpRight size={15} />
                      </a>
                    )}
                    {project.video_url && (
                      <a
                        href={project.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline w-full justify-between"
                      >
                        <span className="inline-flex items-center gap-2">
                          <Play size={16} /> Watch Demo
                        </span>
                        <ArrowUpRight size={15} />
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Start Similar Project Form */}
              <div className="rounded-2xl bg-brand-navy text-white p-7 relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-44 h-44 bg-brand-rose/25 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
                <div className="relative">
                  <h4 className="font-display text-lg font-bold text-white">Want to build something similar?</h4>
                  <p className="mt-1.5 text-sm text-white/65">
                    Share your brief and our engineering team will reply with an approach and estimate.
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-3 mt-5">
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
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Project goals or timeline..."
                      className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/45 focus:outline-none focus:border-brand-rose"
                    />

                    <div className="origin-left scale-[0.85]">
                      <ReCAPTCHA ref={captchaRef} sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} theme="dark" />
                    </div>

                    <button
                      type="submit"
                      disabled={status === 'loading' || status === 'success'}
                      className={`w-full py-3 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2 ${
                        status === 'success'
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
                        'Get a Quote'
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </aside>
          </div>

          {/* Related Projects */}
          {otherProjects.length > 0 && (
            <div className="mt-24 pt-14 border-t border-line">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                <div>
                  <span className="eyebrow">More work</span>
                  <h2 className="heading-lg mt-3">Other case studies</h2>
                </div>
                <Link to="/projects" className="btn-outline w-fit">
                  View all projects <ArrowRight size={16} />
                </Link>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {otherProjects.map((p) => (
                  <Link
                    to={`/projects/${p.id}`}
                    key={p.id}
                    className="card-hover group overflow-hidden flex flex-col"
                  >
                    <div className="aspect-[16/9] overflow-hidden bg-brand-navy/95 flex items-center justify-center">
                      {p.image ? (
                        <img
                          src={resolveMediaUrl(p.image)}
                          alt={p.title}
                          className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <span className="font-display text-xl font-bold text-white/75 px-6 text-center">{p.title}</span>
                      )}
                    </div>
                    <div className="p-6 flex items-center justify-between gap-4">
                      <h3 className="font-display text-lg font-bold text-ink group-hover:text-brand-rose transition-colors">
                        {p.title}
                      </h3>
                      <ArrowRight size={18} className="text-brand-rose shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] bg-brand-navy/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10"
          >
            <button
              type="button"
              aria-label="Close image preview"
              className="absolute top-6 right-6 inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/10 text-white hover:bg-brand-rose transition-colors z-[110]"
              onClick={() => setSelectedImage(null)}
            >
              <X size={24} />
            </button>

            <motion.img
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              src={selectedImage}
              alt="Project full view"
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-full object-contain rounded-xl shadow-lift"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetails;
