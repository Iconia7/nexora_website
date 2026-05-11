import React, { useState, useEffect } from 'react';
import { fetchProjects, fetchServices } from '../api'; 
import { ArrowRight, ExternalLink, Github, Star, GitFork, Loader2, CheckCircle, AlertCircle, Globe, Smartphone, Server } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import picture from '../assets/pattern.png';
import newton from '../assets/newton.jpeg';
import SEO from '../components/SEO';
import { useRef } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import toast from 'react-hot-toast';

const Projects = () => {
  const [filter, setFilter] = useState('All');
  const [githubRepos, setGithubRepos] = useState([]);
  const [apiProjects, setApiProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const captchaRef = useRef(null);
  
  // --- FORM LOGIC ---
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    // 1. Fetch API Projects & Services
    const loadData = async () => {
      try {
        const [projectsRes, servicesRes] = await Promise.all([fetchProjects(), fetchServices()]);
        setApiProjects(projectsRes.data);
        setServices(servicesRes.data);
      } catch (err) {
        console.error("Error fetching projects/services:", err);
      }
    };

    // 2. Fetch GitHub Repos
    const fetchRepos = async () => {
      try {
        const response = await fetch('https://api.github.com/users/Iconia7/repos?sort=updated&per_page=6');
        const data = await response.json();
        
        const formattedRepos = data.map(repo => ({
          id: `gh-${repo.id}`, 
          title: repo.name.replace(/-/g, ' ').toUpperCase(),
          category: 'GitHub',
          image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80",
          description: repo.description || "No description provided.",
          link: repo.html_url,
          isExternal: true,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language
        }));

        setGithubRepos(formattedRepos);
      } catch (error) {
        console.error("Error fetching GitHub repos:", error);
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
            from_name: "Nexora Projects Page",
            reply_to: formData.email,
            subject: `Project Consultation Request: ${formData.name}`,
            message_body: `Name: ${formData.name}\nEmail: ${formData.email}\n\nSource: User viewed Projects page and requested consultation.`
        };

        const clientParams = {
            to_email: formData.email,
            from_name: "Nexora Creative Solutions",
            reply_to: "info@nexoracreatives.co.ke",
            subject: `Let's discuss your project!`,
            message_body: `Hi ${formData.name},\n\nThanks for browsing our portfolio. We'd love to discuss how we can build something similar for you. A member of our team will reach out shortly.\n\nBest Regards,\nThe Nexora Team`
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

  const allProjects = [...apiProjects, ...githubRepos];
  const categories = ['All', ...services.map(s => s.title), 'GitHub'];

  const filteredProjects = filter === 'All' 
    ? allProjects 
    : allProjects.filter(p => {
        if (Array.isArray(p.categories)) {
          return p.categories.includes(filter);
        }
        return p.category === filter;
      });

  return (
    <div className="pt-20">
        <SEO 
  title="Our Portfolio | Recent Projects by Nexora"
  description="See our work in action. From e-commerce platforms to corporate websites and mobile apps, discover how we help businesses succeed online."
  url="/projects"
/>
      
      {/* 1. Header Section */}
      <section className="relative py-24 text-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={picture} alt="Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-brand-charcoal/55"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-creative">Our Projects</h1>
          <div className="flex justify-center gap-2 text-gray-300 text-sm font-medium">
            <Link to="/" className="hover:text-white transition-colors">Home</Link> / 
            <span className="text-brand-rose">Projects</span>
          </div>
        </div>
      </section>

      {/* 2. Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-24">
        
        {/* Filter Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-4 mb-16 flex-wrap"
        >
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:-translate-y-1 ${
                filter === cat 
                ? 'bg-brand-rose text-white shadow-lg shadow-brand-rose/30' 
                : 'bg-white text-brand-charcoal border border-gray-200 hover:border-brand-rose hover:text-brand-rose hover:shadow-md'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Project Grid */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode='popLayout'>
            {filteredProjects.map((project) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={project.id} 
                className="group relative overflow-hidden rounded-2xl h-[400px] shadow-lg cursor-pointer bg-white border border-gray-100"
              >
                <div className="h-full w-full relative">
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-brand-charcoal/95 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-6 text-center">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="w-full"
                        >
                            <span className="text-brand-rose font-bold uppercase tracking-wider text-xs mb-3 block">
                                {Array.isArray(project.categories) ? project.categories.join(' | ') : project.category}
                            </span>
                            <h3 className="text-2xl font-bold mb-4 line-clamp-2">{project.title}</h3>
                            
                            {/* NEW: Project Badges */}
                            {!project.isExternal && (project.live_url || project.playstore_url) && (
                                <div className="flex justify-center gap-3 mb-6">
                                    {project.live_url && (
                                        <div className="flex items-center gap-1.5 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30">
                                            <Globe size={12}/> LIVE SITE
                                        </div>
                                    )}
                                    {project.playstore_url && (
                                        <div className="flex items-center gap-1.5 bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/30">
                                            <Smartphone size={12}/> APP STORE
                                        </div>
                                    )}
                                </div>
                            )}

                            {project.isExternal && (
                                <div className="flex justify-center gap-4 mb-6 text-sm text-gray-400">
                                    <span className="flex items-center gap-1"><Star size={14} className="text-yellow-400"/> {project.stars}</span>
                                    <span className="flex items-center gap-1"><GitFork size={14} className="text-blue-400"/> {project.forks}</span>
                                    {project.language && <span className="text-brand-rose font-mono">{project.language}</span>}
                                </div>
                            )}
                            {project.isExternal ? (
                                <a href={project.link} target="_blank" rel="noopener noreferrer" className="bg-white text-brand-charcoal px-6 py-3 rounded-full font-bold flex items-center gap-2 mx-auto hover:bg-brand-rose hover:text-white transition-colors w-fit">
                                  <Github size={18}/> View Code
                                </a>
                            ) : (
                                <Link to={`/projects/${project.id}`} className="bg-white text-brand-charcoal px-6 py-3 rounded-full font-bold flex items-center gap-2 mx-auto hover:bg-brand-rose hover:text-white transition-colors w-fit">
                                  View Case Study <ArrowRight size={18}/>
                                </Link>
                            )}
                        </motion.div>
                    </div>
                </div>
                <div className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg text-brand-charcoal group-hover:scale-0 transition-transform duration-300 z-10">
                    {project.isExternal ? <Github size={20} /> : (project.playstore_url ? <Smartphone size={20}/> : (project.live_url ? <Globe size={20}/> : <ExternalLink size={20} />))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* 3. "Need Consultation" Banner -> NOW A FORM */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-32 bg-brand-charcoal rounded-3xl p-10 md:p-16 relative overflow-hidden text-white flex flex-col md:flex-row items-center justify-between gap-10"
        >
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-rose/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>

            <div className="relative z-10 max-w-xl w-full">
                <div className="flex items-center gap-2 mb-4 text-brand-rose font-semibold">
                    <span className="w-8 h-[2px] bg-brand-rose"></span> Contact Us
                </div>
                <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
                    Need Help with Your Next Project?
                </h2>
                
                {/* ACTIVE FORM INSTEAD OF BUTTON */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input 
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your Name" 
                            className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-brand-rose focus:bg-white/20 transition"
                        />
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Your Email" 
                            className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-brand-rose focus:bg-white/20 transition"
                        />
                    </div>
                    <div className="flex justify-center mb-4">
     <ReCAPTCHA
         ref={captchaRef}
         sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
     />
</div>
                    <button 
                        type="submit"
                        disabled={status === 'loading' || status === 'success'}
                        className={`w-full py-4 rounded-full font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2 ${
                           status === 'success' ? 'bg-green-500 text-white cursor-default' : 
                           'bg-brand-rose text-white hover:bg-white hover:text-brand-charcoal'
                        }`}
                    >
                        {status === 'loading' ? <Loader2 className="animate-spin" /> : 
                         status === 'success' ? <><CheckCircle /> Sent!</> : 
                         'Get Free Consultation'}
                    </button>
                    {status === 'error' && <p className="text-red-400 text-sm flex items-center gap-1"><AlertCircle size={14}/> Something went wrong. Try again.</p>}
                </form>
            </div>

            <div className="relative z-10 hidden md:block">
                <div className="relative">
                    <div className="absolute -inset-4 border-2 border-dashed border-gray-600 rounded-full animate-spin-slow"></div>
                    <img 
                        src={newton}
                        alt="Consultant" 
                        className="w-64 h-64 object-cover rounded-full border-4 border-brand-rose shadow-2xl"
                    />
                    <div className="absolute bottom-0 -left-6 bg-white text-brand-charcoal px-4 py-2 rounded-lg shadow-lg font-bold flex items-center gap-2 animate-bounce-slow">
                        <span>👋</span> Let's Talk!
                    </div>
                </div>
            </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Projects;