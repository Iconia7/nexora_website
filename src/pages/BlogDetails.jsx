import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchBlogById, fetchBlogs } from '../api';
import { Calendar, Facebook, Twitter, Linkedin, Share2, ArrowRight, ChevronRight, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import picture from '../assets/pattern.png';
import SEO from '../components/SEO';
import { useRef } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import toast from 'react-hot-toast';

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [otherBlogs, setOtherBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- FORM LOGIC ---
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [status, setStatus] = useState('idle');

  const captchaRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    
    Promise.all([
        fetchBlogById(id),
        fetchBlogs()
    ])
    .then(([detailRes, listRes]) => {
        setBlog(detailRes.data);
        setOtherBlogs(listRes.data.filter(b => b.id !== detailRes.data.id));
        setLoading(false);
    })
    .catch(err => {
        console.error("Error fetching blog details:", err);
        setLoading(false);
    });
  }, [id]);

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
        // --- NOTE: Firebase contact_messages log removed ---

        // 2. EmailJS Logic
        const serviceID = "service_nhwsclu"; 
        const templateID = "template_61eywtf"; 
        const publicKey = "ctUKvg88_0Th5sfKn";

        const adminParams = {
            to_email: "info@nexoracreatives.co.ke",
            from_name: "Nexora Blog Reader",
            reply_to: formData.email,
            subject: `Lead from Blog: ${blog?.title}`,
            message_body: `Name: ${formData.name}\nEmail: ${formData.email}\nReading: ${blog?.title}\n\nSource: Sidebar Form`
        };

        const clientParams = {
            to_email: formData.email,
            from_name: "Nexora Creative Solutions",
            reply_to: "info@nexoracreatives.co.ke",
            subject: `Let's discuss your ideas!`,
            message_body: `Hi ${formData.name},\n\nThanks for reaching out while reading "${blog?.title}". We'd love to help bring your ideas to life. A member of our team will contact you shortly.\n\nBest Regards,\nThe Nexora Team`
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

  if (loading) {
      return (
          <div className="pt-40 pb-20 flex justify-center">
              <Loader2 size={48} className="animate-spin text-brand-rose opacity-20" />
          </div>
      );
  }

  if (!blog) {
    return (
      <div className="pt-40 text-center">
        <h2 className="text-3xl font-bold text-brand-charcoal">Blog Post Not Found</h2>
        <Link to="/blogs" className="text-brand-rose font-bold mt-4 inline-block hover:underline">Return to Blogs</Link>
      </div>
    );
  }

  return (
    <div className="pt-20">
        <SEO 
          title={`${blog.title} | Nexora Insights`}
          description={blog.summary || `Read ${blog.title}. In-depth insights on software development and tech from Nexora Creative Solutions.`}
          url={`/blogs/${blog.id}`}
          image={blog.image || "/ncs.png"}
          type="article"
          author={blog.author || "Nexora Team"}
          publishedTime={blog.created_at || blog.date}
          breadcrumbs={[
            { name: "Home", item: "/" },
            { name: "Blogs", item: "/blogs" },
            { name: blog.title, item: `/blogs/${blog.id}` }
          ]}
          schema={{
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": blog.title,
            "description": blog.summary || blog.title,
            "image": blog.image ? (blog.image.startsWith("http") ? blog.image : `https://nexoracreatives.co.ke${blog.image}`) : "https://nexoracreatives.co.ke/ncs.png",
            "author": {
              "@type": "Person",
              "name": blog.author || "Nexora Team"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Nexora Creative Solutions",
              "logo": {
                "@type": "ImageObject",
                "url": "https://nexoracreatives.co.ke/ncs.png"
              }
            },
            "datePublished": blog.created_at || blog.date || "2026-01-01",
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://nexoracreatives.co.ke/blogs/${blog.id}`
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-creative">Blog Details</h1>
          <div className="flex justify-center gap-2 text-gray-300 text-sm font-medium">
            <Link to="/" className="hover:text-white transition-colors">Home</Link> / 
            <Link to="/blogs" className="hover:text-white">Blogs</Link> / 
            <span className="text-brand-rose truncate max-w-[200px]">{blog.title}</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-3 gap-12">
            
            {/* 2. Main Blog Content */}
            <div className="lg:col-span-2">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="rounded-3xl overflow-hidden mb-8 h-[400px]">
                        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-500 mb-4 border-b border-gray-100 pb-4">
                        <div className="flex items-center gap-2">
                            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Author" className="w-8 h-8 rounded-full"/>
                            <span className="font-bold text-brand-charcoal">By {blog.author}</span>
                        </div>
                        <span className="flex items-center gap-1"><Calendar size={16} className="text-brand-rose"/> {blog.date}</span>
                        <span className="ml-auto bg-blue-50 text-brand-charcoal px-3 py-1 rounded-full text-xs font-bold">{blog.category}</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-brand-charcoal mb-6">{blog.title}</h2>
                    
                    <p className="text-gray-600 mb-8 text-lg leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:text-brand-rose first-letter:float-left first-letter:mr-3">
                        {blog.intro}
                    </p>

                    {/* Dynamic Sections */}
                    {blog.sections?.map((section, idx) => (
                        <div key={idx} className="mb-8">
                            <h3 className="text-2xl font-bold text-brand-charcoal mb-3">{section.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{section.text}</p>
                        </div>
                    ))}

                    {/* Visual Grid */}
                    <div className="grid md:grid-cols-2 gap-6 my-10">
                        <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80" className="rounded-2xl shadow-lg" alt="working"/>
                        <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80" className="rounded-2xl shadow-lg" alt="meeting"/>
                    </div>

                    {/* Quote Box */}
                    <div className="bg-brand-charcoal text-white p-8 rounded-2xl my-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 text-9xl font-serif text-white opacity-5 -mt-8 -mr-4">"</div>
                        <p className="text-xl italic relative z-10">"Innovation distinguishes between a leader and a follower. The web is not just about code; it's about connecting people."</p>
                        <p className="mt-4 font-bold text-brand-rose">- Steve Jobs (Inspired)</p>
                    </div>

                    {/* Best Practices */}
                    {blog.practices?.length > 0 && (
                        <div className="mb-10">
                            <h3 className="text-2xl font-bold text-brand-charcoal mb-6">Best Practices</h3>
                            <div className="grid md:grid-cols-3 gap-6">
                                {blog.practices.map((practice, idx) => (
                                    <div key={idx} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition">
                                        <div className="w-10 h-10 rounded-full bg-brand-rose text-white flex items-center justify-center font-bold mb-4">0{idx+1}</div>
                                        <h4 className="font-bold text-brand-charcoal mb-2">{practice.title}</h4>
                                        <p className="text-sm text-gray-600">{practice.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Bottom Meta */}
                    <div className="border-t border-b border-gray-100 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-brand-charcoal">Tags:</span>
                            {['Technology', 'Business', 'Innovation'].map(tag => (
                                <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full hover:bg-brand-rose hover:text-white transition cursor-pointer">{tag}</span>
                            ))}
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="font-bold text-brand-charcoal flex items-center gap-2"><Share2 size={16}/> Share:</span>
                            <div className="flex gap-2 text-gray-400">
                                <Facebook size={18} className="hover:text-brand-rose cursor-pointer"/>
                                <Twitter size={18} className="hover:text-brand-rose cursor-pointer"/>
                                <Linkedin size={18} className="hover:text-brand-rose cursor-pointer"/>
                            </div>
                        </div>
                    </div>

                </motion.div>
            </div>

            {/* 3. Sidebar */}
            <div className="lg:col-span-1 space-y-10">
                
                {/* Categories */}
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <h3 className="font-bold text-xl text-brand-charcoal mb-4">Categories</h3>
                    <ul className="space-y-3">
                        {['Web Development', 'Mobile App', 'Cloud', 'Design'].map((cat, idx) => (
                            <li key={idx} className="flex justify-between items-center text-gray-600 hover:text-brand-rose cursor-pointer border-b border-gray-200 pb-2 last:border-0">
                                <span>{cat}</span>
                                <ChevronRight size={14}/>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Recent Posts */}
                <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                    <h3 className="font-bold text-xl text-brand-charcoal mb-6">Recent News</h3>
                    <div className="space-y-6">
                        {otherBlogs.slice(0, 3).map(post => (
                            <div key={post.id} className="flex gap-4 group cursor-pointer">
                                <img src={post.image} alt="thumb" className="w-20 h-20 object-cover rounded-xl" />
                                <div>
                                    <span className="text-xs text-brand-rose font-bold mb-1 block">{post.date}</span>
                                    <h4 className="font-bold text-sm text-brand-charcoal group-hover:text-brand-rose transition line-clamp-2">
                                        <Link to={`/blogs/${post.id}`}>{post.title}</Link>
                                    </h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FUNCTIONAL Sidebar Form */}
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
                             status === 'success' ? <><CheckCircle size={16}/> Request Sent</> : 
                             status === 'error' ? <><AlertCircle size={16}/> Failed</> : 
                             'Get Free Quote'}
                        </button>
                    </form>
                </div>
            </div>

        </div>

        {/* 4. Related Blogs */}
        <div className="mt-20 pt-10 border-t border-gray-100">
             <h2 className="text-3xl font-bold text-brand-charcoal mb-8">Latest Related <span className="text-brand-rose">News & Blogs</span></h2>
             <div className="grid md:grid-cols-3 gap-8">
                 {otherBlogs.slice(0,3).map((post) => (
                     <div key={post.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition border border-gray-100 overflow-hidden">
                         <div className="h-48 overflow-hidden">
                            <img src={post.image} className="w-full h-full object-cover hover:scale-110 transition duration-500" alt="blog"/>
                         </div>
                         <div className="p-6">
                             <div className="flex gap-4 text-xs text-gray-400 mb-3">
                                 <span className="flex items-center gap-1"><Calendar size={12}/> {post.date}</span>
                                 <span className="text-brand-rose font-bold">{post.category}</span>
                             </div>
                             <h3 className="font-bold text-lg mb-3 hover:text-brand-rose cursor-pointer">
                                <Link to={`/blogs/${post.id}`}>{post.title}</Link>
                             </h3>
                             <Link to={`/blogs/${post.id}`} className="text-sm font-bold text-brand-charcoal hover:text-brand-rose flex items-center gap-1">Read More <ArrowRight size={14}/></Link>
                         </div>
                     </div>
                 ))}
             </div>
        </div>

      </div>
    </div>
  );
};

export default BlogDetails;