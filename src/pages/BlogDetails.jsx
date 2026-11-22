import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Facebook, Twitter, Linkedin, Share2, ArrowRight, ChevronRight, Loader2, CheckCircle, AlertCircle, User, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import ReCAPTCHA from 'react-google-recaptcha';
import toast from 'react-hot-toast';
import { fetchBlogById, fetchBlogs, fetchBlogCategories, submitContactMessage, resolveMediaUrl } from '../api';
import SEO from '../components/SEO';
import PageHeader from '../components/ui/PageHeader';
import { useCompany } from '../context/CompanyContext';
import { PHOTOS } from '../config/photos';

const BlogDetails = () => {
  const { company: COMPANY } = useCompany();
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [otherBlogs, setOtherBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadedId, setLoadedId] = useState(null);
  const loading = loadedId !== id;

  const [formData, setFormData] = useState({ name: '', email: '' });
  const [status, setStatus] = useState('idle');
  const captchaRef = useRef(null);

  useEffect(() => {
    let active = true;
    window.scrollTo(0, 0);

    Promise.all([fetchBlogById(id), fetchBlogs(), fetchBlogCategories()])
      .then(([detailRes, listRes, catRes]) => {
        if (!active) return;
        setBlog(detailRes.data);
        setOtherBlogs((listRes.data || []).filter((b) => b.id !== detailRes.data.id));
        setCategories(catRes.data || []);
        setLoadedId(id);
      })
      .catch((err) => {
        if (!active) return;
        console.error('Error fetching blog details:', err);
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
        service: 'Blog Reader Inquiry',
        message: `Reader requested a consultation while reading "${blog?.title}".`,
        source: 'Blog Details Page',
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

  if (loading) {
    return (
      <div className="min-h-[60vh] pt-36 pb-20 flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-brand-rose" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-[60vh] pt-36 pb-20 container-site text-center">
        <h1 className="heading-lg">Article not found</h1>
        <p className="mt-3 text-ink-muted">The article you requested could not be found.</p>
        <Link to="/blogs" className="btn-primary mt-8">
          Return to Insights
        </Link>
      </div>
    );
  }

  const shareUrl = encodeURIComponent(`${COMPANY.siteUrl}/blogs/${blog.id}`);
  const shareTitle = encodeURIComponent(blog.title || '');

  return (
    <div className="overflow-hidden">
      <SEO
        title={`${blog.title} | ${COMPANY.legalName}`}
        description={
          blog.excerpt ||
          blog.intro ||
          `Read ${blog.title}. Software engineering and digital insights from ${COMPANY.legalName}.`
        }
        url={`/blogs/${blog.id}`}
        image={blog.image || '/ncs.png'}
        type="article"
        author={blog.author || COMPANY.legalName}
        publishedTime={blog.created_at || blog.date}
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Insights', item: '/blogs' },
          { name: blog.title, item: `/blogs/${blog.id}` },
        ]}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: blog.title,
          description: blog.summary || blog.title,
          image: blog.image
            ? blog.image.startsWith('http')
              ? blog.image
              : `${COMPANY.siteUrl}${blog.image}`
            : `${COMPANY.siteUrl}/ncs.png`,
          author: {
            '@type': 'Person',
            name: blog.author || COMPANY.legalName,
          },
          publisher: {
            '@type': 'Organization',
            name: COMPANY.legalName,
            logo: {
              '@type': 'ImageObject',
              url: `${COMPANY.siteUrl}/ncs.png`,
            },
          },
          datePublished: blog.created_at || blog.date || '2026-01-01',
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${COMPANY.siteUrl}/blogs/${blog.id}`,
          },
        }}
      />

      <PageHeader
        eyebrow={blog.category || 'Insights'}
        title={blog.title}
        breadcrumbs={[
          { label: 'Insights', to: '/blogs' },
          { label: blog.title },
        ]}
      >
        <div className="flex flex-wrap items-center gap-5 text-sm text-white/75">
          {blog.author && (
            <span className="inline-flex items-center gap-2">
              <User size={15} className="text-brand-rose" /> {blog.author}
            </span>
          )}
          {blog.date && (
            <span className="inline-flex items-center gap-2">
              <Calendar size={15} className="text-brand-rose" /> {blog.date}
            </span>
          )}
        </div>
      </PageHeader>

      <section className="section bg-white">
        <div className="container-site">
          <div className="grid lg:grid-cols-[1fr_340px] gap-12 lg:gap-16 items-start">
            {/* Article Content */}
            <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {blog.image && (
                <div className="rounded-3xl overflow-hidden shadow-soft mb-10 aspect-[16/9] max-h-[440px] bg-brand-light">
                  <img src={resolveMediaUrl(blog.image)} alt={blog.title} className="w-full h-full object-cover" />
                </div>
              )}

              {blog.intro && <p className="lead text-ink mb-8">{blog.intro}</p>}

              <div className="space-y-8">
                {blog.sections?.map((section, idx) => (
                  <div key={idx}>
                    <h2 className="heading-md mb-3">{section.title}</h2>
                    <p className="text-ink-muted leading-relaxed text-base sm:text-lg">{section.text}</p>
                  </div>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-5 my-12">
                <img
                  src={PHOTOS.blogVisualLeft}
                  className="rounded-2xl shadow-soft aspect-[4/3] object-cover w-full"
                  alt="Software engineering workflow"
                />
                <img
                  src={PHOTOS.blogVisualRight}
                  className="rounded-2xl shadow-soft aspect-[4/3] object-cover w-full"
                  alt="Technical architecture discussion"
                />
              </div>

              {/* Callout Quote */}
              <figure className="rounded-2xl bg-brand-navy text-white p-8 md:p-10 my-12 relative overflow-hidden">
                <Quote size={32} className="text-brand-rose/60 mb-4" />
                <blockquote className="font-display text-xl md:text-2xl font-medium leading-snug text-white">
                  &ldquo;Great software is rarely about complexity — it is about clarity, reliability, and solving real human and business problems.&rdquo;
                </blockquote>
                <figcaption className="mt-4 text-sm text-white/60">
                  — Engineering Desk, {COMPANY.legalName}
                </figcaption>
              </figure>

              {/* Best Practices */}
              {blog.practices?.length > 0 && (
                <div className="mb-12">
                  <h3 className="heading-md mb-6">Key takeaways</h3>
                  <div className="grid sm:grid-cols-3 gap-5">
                    {blog.practices.map((practice, idx) => (
                      <div key={idx} className="card p-6">
                        <span className="inline-flex w-9 h-9 rounded-lg bg-brand-rose-light text-brand-rose items-center justify-center font-display font-bold text-sm mb-4">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <h4 className="font-display font-bold text-ink mb-2">{practice.title}</h4>
                        <p className="text-sm text-ink-muted leading-relaxed">{practice.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags & Share */}
              <div className="border-y border-line py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-subtle mr-1">Tags:</span>
                  {['Technology', 'Engineering', 'Strategy'].map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium bg-brand-light border border-line text-ink px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-subtle inline-flex items-center gap-1.5">
                    <Share2 size={14} /> Share
                  </span>
                  <div className="flex gap-2">
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Share on Facebook"
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-line text-ink-muted hover:border-brand-rose hover:text-brand-rose transition-colors"
                    >
                      <Facebook size={15} />
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Share on X"
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-line text-ink-muted hover:border-brand-rose hover:text-brand-rose transition-colors"
                    >
                      <Twitter size={15} />
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Share on LinkedIn"
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-line text-ink-muted hover:border-brand-rose hover:text-brand-rose transition-colors"
                    >
                      <Linkedin size={15} />
                    </a>
                  </div>
                </div>
              </div>
            </motion.article>

            {/* Sidebar */}
            <aside className="sticky top-28 space-y-6">
              <div className="card p-6">
                <h3 className="font-display text-base font-bold text-ink mb-4">Topics</h3>
                <ul className="divide-y divide-line">
                  {(categories.length > 0
                    ? categories.map((c) => c.name)
                    : ['Software Engineering', 'Digital Strategy', 'UI/UX Design']
                  ).map((cat) => (
                    <li key={cat}>
                      <Link
                        to={`/blogs?category=${encodeURIComponent(cat)}`}
                        className="flex justify-between items-center py-2.5 text-sm text-ink-muted hover:text-brand-rose transition-colors"
                      >
                        <span>{cat}</span>
                        <ChevronRight size={14} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {otherBlogs.length > 0 && (
                <div className="card p-6">
                  <h3 className="font-display text-base font-bold text-ink mb-4">Recent insights</h3>
                  <div className="space-y-4">
                    {otherBlogs.slice(0, 3).map((post) => (
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
                          <span className="text-xs text-brand-rose font-semibold block mb-1">{post.date}</span>
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
                  <h3 className="font-display text-xl font-bold text-white">Bring your idea to life</h3>
                  <p className="mt-2 text-sm text-white/65">
                    Contact {COMPANY.legalName} for a free technical consultation.
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

          {/* Related Articles */}
          {otherBlogs.length > 0 && (
            <div className="mt-20 pt-14 border-t border-line">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                <div>
                  <span className="eyebrow">Keep reading</span>
                  <h2 className="heading-lg mt-3">Related insights</h2>
                </div>
                <Link to="/blogs" className="btn-outline w-fit">
                  All articles <ArrowRight size={16} />
                </Link>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {otherBlogs.slice(0, 3).map((post) => (
                  <article key={post.id} className="card-hover group overflow-hidden flex flex-col">
                    <Link to={`/blogs/${post.id}`} className="block aspect-[16/10] overflow-hidden bg-brand-navy/95">
                      {post.image ? (
                        <img
                          src={resolveMediaUrl(post.image)}
                          alt={post.title}
                          className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-grid-light flex items-end p-5">
                          <span className="font-display font-bold text-white/80 line-clamp-2">{post.title}</span>
                        </div>
                      )}
                    </Link>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-3 text-xs text-ink-subtle mb-2.5">
                        <span className="inline-flex items-center gap-1">
                          <Calendar size={12} /> {post.date}
                        </span>
                        {post.category && <span className="text-brand-rose font-semibold">{post.category}</span>}
                      </div>
                      <h3 className="font-display font-bold text-lg text-ink group-hover:text-brand-rose transition-colors line-clamp-2 flex-1">
                        <Link to={`/blogs/${post.id}`}>{post.title}</Link>
                      </h3>
                      <Link
                        to={`/blogs/${post.id}`}
                        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-rose"
                      >
                        Read more <ArrowRight size={14} />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogDetails;
