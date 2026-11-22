import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Calendar, User, ArrowRight, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import ReCAPTCHA from 'react-google-recaptcha';
import toast from 'react-hot-toast';
import { fetchBlogs, fetchBlogCategories, submitContactMessage, resolveMediaUrl } from '../api';
import SEO from '../components/SEO';
import PageHeader from '../components/ui/PageHeader';
import { useCompany } from '../context/CompanyContext';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const Blogs = () => {
  const { company: COMPANY } = useCompany();
  const [searchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('search') || '');
  const [activeCategory, setActiveCategory] = useState(() => searchParams.get('category') || 'All');

  const [formData, setFormData] = useState({ name: '', email: '' });
  const [status, setStatus] = useState('idle');
  const captchaRef = useRef(null);

  useEffect(() => {
    Promise.all([fetchBlogs(), fetchBlogCategories()])
      .then(([blogsRes, categoriesRes]) => {
        setBlogs(blogsRes.data || []);
        setDbCategories(categoriesRes.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching blogs and categories:', err);
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
        service: 'Blog Inquiry',
        message: 'Reader requested a consultation from the Insights sidebar.',
        source: 'Blogs Page',
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

  const categories = ['All', ...dbCategories.map((c) => c.name)];

  const getCategoryCount = (cat) =>
    cat === 'All' ? blogs.length : blogs.filter((b) => b.category === cat).length;

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = (blog.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || blog.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="overflow-hidden">
      <SEO
        title={`Insights & Software Engineering Blog | ${COMPANY.legalName}`}
        description={`Engineering perspectives, web architecture trends, Flutter tutorials, and digital strategy written by the team at ${COMPANY.legalName}.`}
        url="/blogs"
        image="/ncs.png"
        keywords={[
          'tech blog Kenya',
          'software tutorials',
          'Flutter development tutorials',
          'web design insights',
          'Nexora blog',
        ]}
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Insights', item: '/blogs' },
        ]}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: `${COMPANY.legalName} Insights & Engineering Blog`,
          description: `Articles, insights, and software engineering guides from ${COMPANY.legalName}.`,
          url: `${COMPANY.siteUrl}/blogs`,
          publisher: {
            '@type': 'Organization',
            name: COMPANY.legalName,
            logo: {
              '@type': 'ImageObject',
              url: `${COMPANY.siteUrl}/ncs.png`,
            },
          },
        }}
      />

      <PageHeader
        eyebrow="Insights"
        title={
          <>
            Perspectives on engineering, <span className="text-brand-rose">design &amp; growth</span>.
          </>
        }
        description={`Technical guides, product lessons, and industry notes from the engineers and designers at ${COMPANY.legalName}.`}
        breadcrumbs={[{ label: 'Insights' }]}
      />

      <section className="section bg-white">
        <div className="container-site grid lg:grid-cols-[1fr_340px] gap-12 lg:gap-16 items-start">
          {/* Article List */}
          <div className="space-y-8">
            {loading ? (
              <div className="space-y-6">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="card h-80 animate-pulse bg-brand-light" />
                ))}
              </div>
            ) : filteredBlogs.length > 0 ? (
              filteredBlogs.map((blog) => (
                <motion.article
                  key={blog.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="card-hover group overflow-hidden"
                >
                  <Link to={`/blogs/${blog.id}`} className="block relative aspect-[16/9] max-h-[340px] overflow-hidden bg-brand-navy/95">
                    {blog.image ? (
                      <img
                        src={resolveMediaUrl(blog.image)}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-grid-light flex items-end p-8">
                        <span className="font-display text-xl sm:text-2xl font-bold text-white/80 line-clamp-2">
                          {blog.title}
                        </span>
                      </div>
                    )}
                    {blog.category && (
                      <span className="absolute top-4 left-4 rounded-full bg-brand-navy/90 backdrop-blur text-white text-xs font-semibold px-3.5 py-1">
                        {blog.category}
                      </span>
                    )}
                  </Link>

                  <div className="p-7 md:p-8">
                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-ink-subtle mb-3">
                      {blog.date && (
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar size={13} className="text-brand-rose" /> {blog.date}
                        </span>
                      )}
                      {blog.author && (
                        <span className="inline-flex items-center gap-1.5">
                          <User size={13} className="text-brand-rose" /> {blog.author}
                        </span>
                      )}
                    </div>

                    <h2 className="heading-md group-hover:text-brand-rose transition-colors">
                      <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                    </h2>

                    {blog.excerpt && (
                      <p className="mt-3 text-ink-muted leading-relaxed line-clamp-2">{blog.excerpt}</p>
                    )}

                    <Link
                      to={`/blogs/${blog.id}`}
                      className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-rose"
                    >
                      Read article{' '}
                      <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </motion.article>
              ))
            ) : (
              <div className="card p-14 text-center">
                <h3 className="heading-md">No articles found</h3>
                <p className="mt-2 text-ink-muted">Try adjusting your search query or clearing the category filter.</p>
                {(searchTerm || activeCategory !== 'All') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('');
                      setActiveCategory('All');
                    }}
                    className="btn-outline mt-6"
                  >
                    Reset filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="sticky top-28 space-y-6">
            {/* Search */}
            <div className="card p-6">
              <label htmlFor="blog-search" className="font-display text-base font-bold text-ink block mb-3">
                Search insights
              </label>
              <div className="relative">
                <input
                  id="blog-search"
                  type="text"
                  placeholder="Search articles..."
                  className="input !pl-10 !py-2.5 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle" size={16} />
              </div>
            </div>

            {/* Categories */}
            <div className="card p-6">
              <h3 className="font-display text-base font-bold text-ink mb-4">Categories</h3>
              <ul className="space-y-1.5">
                {categories.map((cat, idx) => {
                  const active = activeCategory === cat;
                  return (
                    <li key={idx}>
                      <button
                        type="button"
                        onClick={() => setActiveCategory(cat)}
                        className={`w-full flex justify-between items-center px-3 py-2 rounded-lg text-sm transition-colors ${active
                            ? 'bg-brand-navy text-white font-semibold'
                            : 'text-ink-muted hover:bg-brand-light hover:text-ink'
                          }`}
                      >
                        <span>{cat}</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${active ? 'bg-white/15 text-white' : 'bg-brand-light text-ink-subtle'
                            }`}
                        >
                          {getCategoryCount(cat)}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Recent Posts */}
            {blogs.length > 0 && (
              <div className="card p-6">
                <h3 className="font-display text-base font-bold text-ink mb-4">Recent posts</h3>
                <div className="space-y-4">
                  {blogs.slice(0, 3).map((post) => (
                    <Link key={post.id} to={`/blogs/${post.id}`} className="flex gap-3.5 group">
                      {post.image ? (
                        <img
                          src={resolveMediaUrl(post.image)}
                          alt={post.title}
                          className="w-16 h-16 object-cover rounded-lg shrink-0 bg-brand-light"
                        />
                      ) : (
                        <span className="w-16 h-16 rounded-lg shrink-0 bg-brand-navy text-white font-display font-bold text-lg flex items-center justify-center">
                          {post.title?.charAt(0)}
                        </span>
                      )}
                      <div className="min-w-0">
                        <span className="text-xs text-ink-subtle block mb-1">{post.date}</span>
                        <h4 className="font-semibold text-sm text-ink group-hover:text-brand-rose transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Consultation Form */}
            <div className="rounded-2xl bg-brand-navy text-white p-7 relative overflow-hidden">
              <div
                className="absolute -top-20 -right-20 w-44 h-44 bg-brand-rose/25 rounded-full blur-3xl pointer-events-none"
                aria-hidden="true"
              />
              <div className="relative">
                <h3 className="font-display text-xl font-bold text-white">Have a project in mind?</h3>
                <p className="mt-2 text-sm text-white/65">
                  Request a free scoping call with our engineering team.
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
                      'Get Free Quote'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default Blogs;
