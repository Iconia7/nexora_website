import React, { useState, useEffect } from 'react';
import { fetchBlogs, fetchBlogCategories } from '../api';
import { Search, Calendar, User, ArrowRight, ChevronRight, Loader2, CheckCircle, AlertCircle, CheckIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import picture from '../assets/pattern.png';
import SEO from '../components/SEO';
import { useRef } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import toast from 'react-hot-toast';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // --- SIDEBAR FORM LOGIC ---
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [status, setStatus] = useState('idle');

    const captchaRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchBlogs(), fetchBlogCategories()])
      .then(([blogsRes, categoriesRes]) => {
        setBlogs(blogsRes.data);
        setDbCategories(categoriesRes.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching blogs and categories:", err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.name || !formData.email) {
        toast.error("Please fill in all required fields.");
        return;
    }

const token = captchaRef.current.getValue();
if (!token) {
    toast.error("Please verify that you are not a robot 🤖");
    return;
}

    setStatus('loading');

    try {
        // --- NOTE: Firebase log removed ---

        // 2. EmailJS Logic
        const serviceID = "service_nhwsclu"; 
        const templateID = "template_61eywtf"; 
        const publicKey = "ctUKvg88_0Th5sfKn";

        const adminParams = {
            to_email: "info@nexoracreatives.co.ke",
            from_name: "Nexora Blog Sidebar",
            reply_to: formData.email,
            subject: `Consultation Request: ${formData.name}`,
            message_body: `Name: ${formData.name}\nEmail: ${formData.email}\n\nSource: Blog Sidebar Form`
        };

        const clientParams = {
            to_email: formData.email,
            from_name: "Nexora Creative Solutions",
            reply_to: "info@nexoracreatives.co.ke",
            subject: `Let's discuss your ideas!`,
            message_body: `Hi ${formData.name},\n\nThanks for reaching out while reading our blog. We'd love to help bring your ideas to life. A member of our team will contact you shortly to schedule a free consultation.\n\nBest Regards,\nThe Nexora Team`
        };

        await Promise.all([
            emailjs.send(serviceID, templateID, adminParams, publicKey),
            emailjs.send(serviceID, templateID, clientParams, publicKey)
        ]);

        setStatus('success');
        toast.success("Message sent successfully! We'll be in touch.");
        setFormData({ name: '', email: '' });
        captchaRef.current.reset();
        setTimeout(() => setStatus('idle'), 5000);

    } catch (error) {
        console.error("Error:", error);
        setStatus('error');
        toast.error("Something went wrong. Please try again.");
    }
  };

  const categories = ['All', ...dbCategories.map(c => c.name)];

  // Filter Logic
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || blog.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-20">
        <SEO 
          title="Tech Insights & Software Engineering Blog | Nexora"
          description="Stay ahead with the latest web development trends, Flutter tutorials, cloud architectures, and digital marketing insights written by Nexora developers."
          url="/blogs"
          image="/ncs.png"
          keywords={[
            "tech blog Kenya",
            "software tutorials",
            "Flutter development tutorials",
            "web design insights",
            "Nexora blog"
          ]}
          breadcrumbs={[
            { name: "Home", item: "/" },
            { name: "Blogs", item: "/blogs" }
          ]}
          schema={{
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Nexora Tech Insights & Engineering Blog",
            "description": "Articles, insights, and software engineering guides from Nexora Creative Solutions.",
            "url": "https://nexoracreatives.co.ke/blogs",
            "publisher": {
              "@type": "Organization",
              "name": "Nexora Creative Solutions",
              "logo": {
                "@type": "ImageObject",
                "url": "https://nexoracreatives.co.ke/ncs.png"
              }
            }
          }}
        />
      
      {/* 1. Header Section */}
      <section className="relative py-24 text-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={picture} alt="Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-brand-charcoal/55"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-creative">Latest News & Blogs</h1>
          <div className="flex justify-center gap-2 text-gray-300 text-sm font-medium">
            <Link to="/" className="hover:text-white transition-colors">Home</Link> / 
            <span className="text-brand-rose">Blogs</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* 2. Main Content: Blog List */}
          <div className="lg:col-span-2 space-y-12">
             {loading ? (
                 <div className="flex justify-center py-20">
                     <Loader2 size={48} className="animate-spin text-brand-rose opacity-20" />
                 </div>
             ) : (
                <>
                {filteredBlogs.length > 0 ? (
                    filteredBlogs.map((blog) => (
                        <motion.div 
                            key={blog.id} 
                            initial="hidden" 
                            whileInView="visible" 
                            viewport={{ once: true }} 
                            variants={fadeInUp}
                            className="group"
                        >
                            <div className="overflow-hidden rounded-2xl h-[300px] mb-6 relative">
                                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute top-4 left-4 bg-brand-rose text-white text-xs font-bold px-3 py-1 rounded-full">
                                    {blog.category}
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                <span className="flex items-center gap-1"><Calendar size={14} className="text-brand-rose"/> {blog.date}</span>
                                <span className="flex items-center gap-1"><User size={14} className="text-brand-rose"/> {blog.author}</span>
                            </div>

                            <h2 className="text-2xl font-bold text-brand-charcoal mb-3 group-hover:text-brand-rose transition-colors">
                                <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                            </h2>
                            <p className="text-gray-600 mb-4 line-clamp-2">{blog.excerpt}</p>
                            
                            <Link to={`/blogs/${blog.id}`} className="inline-flex items-center gap-2 text-brand-charcoal font-bold hover:text-brand-rose transition">
                                Read More <ArrowRight size={18}/>
                            </Link>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-20">
                        <h3 className="text-xl font-bold text-gray-400">No blogs found matching your criteria.</h3>
                    </div>
                )}
                </>
             )}
             
             {/* Pagination (Static for now) */}
             {!loading && filteredBlogs.length > 0 && (
                <div className="flex gap-2 pt-10">
                    <button className="w-10 h-10 rounded-full bg-brand-rose text-white font-bold">1</button>
                    <button className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 font-bold hover:bg-gray-200">2</button>
                    <button className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 font-bold hover:bg-gray-200">3</button>
                    <button className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200"><ChevronRight size={18}/></button>
                </div>
             )}
          </div>

          {/* 3. Sidebar */}
          <div className="lg:col-span-1 space-y-10">
              
              {/* Search Widget */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                 <h3 className="font-bold text-xl text-brand-charcoal mb-4">Search</h3>
                 <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="w-full p-3 pl-10 rounded-lg border border-gray-200 focus:outline-none focus:border-brand-rose"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
                 </div>
              </div>

              {/* Categories Widget */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                 <h3 className="font-bold text-xl text-brand-charcoal mb-4">Categories</h3>
                 <ul className="space-y-3">
                    {categories.map((cat, idx) => (
                        <li key={idx}>
                            <button 
                                onClick={() => setActiveCategory(cat)}
                                className={`w-full flex justify-between items-center text-left ${activeCategory === cat ? 'text-brand-rose font-bold' : 'text-gray-600 hover:text-brand-rose'}`}
                            >
                                <span>{cat}</span>
                                <span className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded-full text-gray-400">{Math.floor(Math.random() * 10) + 1}</span>
                            </button>
                        </li>
                    ))}
                 </ul>
              </div>

              {/* Recent Posts Widget */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                 <h3 className="font-bold text-xl text-brand-charcoal mb-4">Recent Posts</h3>
                 <div className="space-y-4">
                    {blogs.slice(0, 3).map(post => (
                        <div key={post.id} className="flex gap-4 group cursor-pointer">
                            <img src={post.image} alt="thumb" className="w-20 h-20 object-cover rounded-lg" />
                            <div>
                                <span className="text-xs text-gray-400 flex items-center gap-1 mb-1"><Calendar size={10}/> {post.date}</span>
                                <h4 className="font-bold text-sm text-brand-charcoal group-hover:text-brand-rose transition line-clamp-2">
                                    <Link to={`/blogs/${post.id}`}>{post.title}</Link>
                                </h4>
                            </div>
                        </div>
                    ))}
                 </div>
              </div>

              {/* Functional CTA / Contact Widget */}
              <div className="bg-brand-charcoal text-white p-8 rounded-2xl relative overflow-hidden text-center">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-rose/20 rounded-full -mr-10 -mt-10 blur-xl"></div>
                  <h3 className="text-2xl font-bold mb-2">Let's Bring Your Ideas to Life!</h3>
                  <p className="text-gray-400 text-sm mb-6">Contact us today for a free consultation.</p>
                  
                  <form onSubmit={handleSubmit} className="space-y-3 relative z-10">
                      <input 
                          type="text" name="name" value={formData.name} onChange={handleChange}
                          placeholder="Your Name" 
                          className="w-full p-3 rounded bg-white/10 border border-white/20 focus:outline-none focus:border-brand-rose text-white placeholder-gray-400 text-sm"
                      />
                      <input 
                          type="email" name="email" value={formData.email} onChange={handleChange}
                          placeholder="Your Email" 
                          className="w-full p-3 rounded bg-white/10 border border-white/20 focus:outline-none focus:border-brand-rose text-white placeholder-gray-400 text-sm"
                      />

                      <div className="flex justify-center mb-4">
    <ReCAPTCHA
        ref={captchaRef}
        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
    />
</div>
                      <button 
                          type="submit"
                          disabled={status === 'loading' || status === 'success'}
                          className={`w-full py-3 rounded font-bold transition flex items-center justify-center gap-2 text-sm ${
                              status === 'success' ? 'bg-green-500 text-white cursor-default' : 
                              status === 'error' ? 'bg-red-500 text-white' : 
                              'bg-brand-rose hover:bg-white hover:text-brand-charcoal'
                          }`}
                      >
                          {status === 'loading' ? <Loader2 className="animate-spin" size={16}/> : 
                           status === 'success' ? <><CheckIcon size={16}/> Request Sent</> : 
                           status === 'error' ? <><AlertCircle size={16}/> Failed</> : 
                           'Get Free Quote'}
                      </button>
                  </form>
              </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Blogs;