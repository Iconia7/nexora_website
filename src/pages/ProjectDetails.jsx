import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProjectById, fetchProjects } from '../api';
import { CheckCircle, ArrowRight, MapPin, Calendar, User, Star, Loader2, AlertCircle, Globe, Smartphone, Palette, Share2, Play, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [otherProjects, setOtherProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const captchaRef = useRef(null);

  // --- FORM LOGIC ---
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchProjectById(id),
      fetchProjects()
    ])
    .then(([detailRes, listRes]) => {
      setProject(detailRes.data);
      setOtherProjects(listRes.data.filter(p => p.id !== detailRes.data.id).slice(0, 2));
      setLoading(false);
    })
    .catch(err => {
      console.error("Error fetching project details:", err);
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
            from_name: "Nexora Project Page",
            reply_to: formData.email,
            subject: `Inquiry via Project: ${project.title}`,
            message_body: `Client: ${formData.name}\nEmail: ${formData.email}\nProject Page: ${project.title}\n\nMessage:\n${formData.message || "Interested in a similar project."}`
        };

        const clientParams = {
            to_email: formData.email,
            from_name: "Nexora Creative Solutions",
            reply_to: "info@nexoracreatives.co.ke",
            subject: `Regarding your project inquiry`,
            message_body: `Hi ${formData.name},\n\nThanks for viewing our case study on ${project.title}. We have received your inquiry and would love to discuss how we can build something similar for you.\n\nBest Regards,\nThe Nexora Team`
        };

        await Promise.all([
            emailjs.send(serviceID, templateID, adminParams, publicKey),
            emailjs.send(serviceID, templateID, clientParams, publicKey)
        ]);

        setStatus('success');
        toast.success("Message sent successfully! We'll be in touch.");
        setFormData({ name: '', email: '', message: '' });
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

  if (!project) return <div className="pt-40 text-center text-2xl font-bold text-gray-400">Project not found</div>;

  return (
    <div className="pt-20">
       <SEO 
        title={`${project.title} | Case Study | Nexora Creative Solutions`}
        description={`Discover how Nexora built ${project.title}. A successful project featuring ${Array.isArray(project.tech_stack) ? project.tech_stack.join(', ') : 'modern tech stacks'}. View the full case study.`}
        url={`/projects/${project.id}`}
        image={project.image || "/ncs.png"}
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "Projects", item: "/projects" },
          { name: project.title, item: `/projects/${project.id}` }
        ]}
        schema={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          "name": project.title,
          "description": project.description || `Case study of ${project.title} by Nexora Creative Solutions.`,
          "author": {
            "@type": "Organization",
            "name": "Nexora Creative Solutions",
            "url": "https://nexoracreatives.co.ke"
          }
        }}
      />

      {/* 1. Header Section */}
      <section className="relative py-24 text-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={picture} className="w-full h-full object-cover" alt="bg"/>
          <div className="absolute inset-0 bg-brand-charcoal/55"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-creative">
            Project Details
          </h1>
          <div className="flex justify-center gap-2 text-gray-300 text-sm font-medium">
            <Link to="/" className="hover:text-white transition-colors">Home</Link> / 
            <Link to="/projects" className="hover:text-white">Projects</Link> / 
            <span className="text-brand-rose">{project.title}</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-20">
        
        {/* 2. Main Hero Image */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl overflow-hidden shadow-2xl mb-16 h-[400px] md:h-[500px]"
        >
          <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* 3. Left Content Column */}
          <div className="lg:col-span-2">
            <motion.div initial="hidden" whileInView="visible" variants={fadeInUp} viewport={{ once: true }}>
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-brand-rose/10 text-brand-rose font-bold text-4xl w-16 h-16 rounded-full flex items-center justify-center shrink-0">
                  {project.title.charAt(0)}
                </div>
                <div>
                   <h2 className="text-3xl font-bold text-brand-charcoal">{project.title} - {project.categories?.join(" | ")}</h2>
                   <p className="text-gray-500 mt-2">A revolutionary solution for modern problems.</p>
                </div>
              </div>
              
              {project.challenge && (
                 <>
                   <h3 className="text-2xl font-bold text-brand-charcoal mb-4">The Challenge</h3>
                   <p className="text-gray-600 mb-8 leading-relaxed">{project.challenge}</p>
                 </>
               )}
 
               {project.solution && (
                 <>
                   <h3 className="text-2xl font-bold text-brand-charcoal mb-4">The Solution</h3>
                   <p className="text-gray-600 mb-6 leading-relaxed">{project.solution}</p>
                 </>
               )}
              
               {project.tech_stack?.length > 0 && (
                 <div className="grid md:grid-cols-2 gap-4 mb-8">
                   {project.tech_stack.map((item, idx) => (
                     <div key={idx} className="flex items-center gap-2 text-gray-700 font-medium">
                       <CheckCircle className="text-brand-rose" size={20} /> {item}
                     </div>
                   ))}
                 </div>
               )}

               {/* Dynamic Showcase Images (Gallery) */}
               {project.gallery?.length > 0 && (
                 <div className="grid md:grid-cols-2 gap-6 mb-12">
                    {project.gallery.map((img, idx) => (
                      <div 
                        key={img.id} 
                        onClick={() => setSelectedImage(img.image)}
                        className="relative group overflow-hidden rounded-xl shadow-lg border border-gray-100 cursor-zoom-in"
                      >
                         <img 
                           src={img.image} 
                           alt={img.caption || `${project.title} gallery ${idx}`} 
                           className="w-full h-[250px] object-cover transition duration-500 group-hover:scale-110" 
                         />
                         <div className="absolute inset-0 bg-brand-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white"
                            >
                                <ArrowRight className="-rotate-45" size={24}/>
                            </motion.div>
                         </div>
                         {img.caption && (
                           <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-charcoal/80 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                             <p className="text-white text-xs font-bold uppercase tracking-wider">{img.caption}</p>
                           </div>
                         )}
                      </div>
                    ))}
                 </div>
               )}

              {project.impact && (
                 <>
                   <h3 className="text-2xl font-bold text-brand-charcoal mb-4">The Impact</h3>
                   <p className="text-gray-600 mb-8 leading-relaxed">{project.impact}</p>
                 </>
               )}

              {/* Testimonial Box */}
              {(project.testimonial_text || project.testimonial_author) && (
                <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                    <div className="flex gap-1 text-yellow-400 mb-4">
                        {[1,2,3,4,5].map(star => <Star key={star} size={18} fill="currentColor" />)}
                    </div>
                    <h4 className="font-bold text-xl text-brand-charcoal mb-2">The Best Decision Ever!</h4>
                    <p className="text-gray-600 italic mb-6">"{project.testimonial_text || "Working with Nexora was a game changer. They understood our vision perfectly and delivered beyond expectations."}"</p>
                    <div className="flex items-center gap-4">
                        <img src={project.image || `https://randomuser.me/api/portraits/women/65.jpg`} alt="Client" className="w-12 h-12 rounded-full border-2 border-brand-rose object-cover" />
                        <div>
                            <span className="block font-bold text-brand-charcoal">{project.testimonial_author || "Happy Client"}</span>
                            <span className="text-sm text-gray-500">CTO, {project.client}</span>
                        </div>
                    </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* 4. Right Sidebar: Project Info & Form */}
          <div className="lg:col-span-1">
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="bg-brand-charcoal text-white p-8 rounded-2xl shadow-xl sticky top-24"
             >
                <h3 className="text-2xl font-bold mb-6 border-b border-gray-600 pb-4">Project Info</h3>
                
                <div className="space-y-6">
                   <div className="flex items-start gap-4">
                      <div className="bg-brand-rose/20 p-2 rounded-lg text-brand-rose"><User size={20}/></div>
                      <div>
                          <span className="text-gray-400 text-sm block">Client:</span>
                          <span className="font-bold">{project.client}</span>
                      </div>
                   </div>
                   <div className="flex items-start gap-4">
                      <div className="bg-brand-rose/20 p-2 rounded-lg text-brand-rose"><Calendar size={20}/></div>
                      <div>
                          <span className="text-gray-400 text-sm block">Date:</span>
                          <span className="font-bold">{project.date}</span>
                      </div>
                   </div>
                   <div className="flex items-start gap-4">
                      <div className="bg-brand-rose/20 p-2 rounded-lg text-brand-rose"><MapPin size={20}/></div>
                      <div>
                          <span className="text-gray-400 text-sm block">Location:</span>
                          <span className="font-bold">{project.location}</span>
                      </div>
                   </div>
                   <div className="flex items-start gap-4">
                      <div className="bg-brand-rose/20 p-2 rounded-lg text-brand-rose"><CheckCircle size={20}/></div>
                      <div>
                          <span className="text-gray-400 text-sm block">Categories:</span>
                          <span className="font-bold">{project.categories?.join(", ")}</span>
                      </div>
                   </div>
                </div>

                {/* PROJECT LINKS */}
                {(project.live_url || project.playstore_url || project.figma_url || project.social_url || project.video_url) && (
                    <div className="mt-8 pt-8 border-t border-gray-600 space-y-4">
                        <h4 className="font-bold mb-4 text-brand-rose uppercase tracking-wider text-sm">Project Resources</h4>
                        
                        {project.live_url && (
                            <a 
                                href={project.live_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full bg-white text-brand-charcoal hover:bg-brand-rose hover:text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg group"
                            >
                                <Globe size={20} className="group-hover:rotate-12 transition-transform" /> 
                                Visit Live Website
                            </a>
                        )}

                        {project.playstore_url && (
                            <a 
                                href={project.playstore_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full bg-brand-rose text-white hover:bg-white hover:text-brand-charcoal font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg group border-2 border-transparent hover:border-brand-rose"
                            >
                                <Smartphone size={20} className="group-hover:scale-110 transition-transform" /> 
                                Available on Play Store
                            </a>
                        )}

                        {project.figma_url && (
                            <a 
                                href={project.figma_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full bg-white/10 text-white hover:bg-brand-rose font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg group border border-white/20"
                            >
                                <Palette size={20} className="group-hover:rotate-12 transition-transform" /> 
                                View Figma Prototype
                            </a>
                        )}

                        {project.social_url && (
                            <a 
                                href={project.social_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full bg-white/10 text-white hover:bg-brand-rose font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg group border border-white/20"
                            >
                                <Share2 size={20} className="group-hover:scale-110 transition-transform" /> 
                                View Social Project
                            </a>
                        )}

                        {project.video_url && (
                            <a 
                                href={project.video_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full bg-brand-rose text-white hover:bg-white hover:text-brand-charcoal font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg group border-2 border-transparent hover:border-brand-rose"
                            >
                                <Play size={20} className="group-hover:scale-110 transition-transform" /> 
                                Watch Demo Video
                            </a>
                        )}
                    </div>
                )}

                {/* FUNCTIONAL "Start Similar Project" Form */}
                <div className="mt-8 pt-8 border-t border-gray-600">
                   <h4 className="font-bold mb-4 text-brand-rose">Want a project like this?</h4>
                   <form onSubmit={handleSubmit} className="space-y-3">
                       <input 
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your Name" 
                            className="w-full p-3 rounded bg-white/10 border border-white/20 focus:outline-none focus:border-brand-rose text-white placeholder-gray-400 text-sm"
                       />
                       <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Your Email" 
                            className="w-full p-3 rounded bg-white/10 border border-white/20 focus:outline-none focus:border-brand-rose text-white placeholder-gray-400 text-sm"
                       />
                       <textarea 
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="2" 
                            placeholder="Any details?" 
                            className="w-full p-3 rounded bg-white/10 border border-white/20 focus:outline-none focus:border-brand-rose text-white placeholder-gray-400 text-sm"
                       ></textarea>

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
                                'bg-brand-rose hover:bg-white hover:text-brand-rose'
                            }`}
                       >
                            {status === 'loading' ? <Loader2 className="animate-spin" size={16} /> : 
                             status === 'success' ? <><CheckCircle size={16}/> Request Sent</> : 
                             status === 'error' ? <><AlertCircle size={16}/> Failed</> : 
                             'Get a Quote'}
                       </button>
                   </form>
                </div>
             </motion.div>
          </div>

        </div>

        {/* 5. View Other Projects */}
        <section className="mt-24">
            <div className="flex justify-between items-center mb-8">
               <h2 className="text-3xl font-bold text-brand-charcoal">View Other Projects</h2>
               <Link to="/projects" className="text-brand-rose font-bold flex items-center gap-2">View All <ArrowRight size={20}/></Link>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
               {otherProjects.map(p => (
                   <Link to={`/projects/${p.id}`} key={p.id} className="group relative rounded-xl overflow-hidden h-[250px] shadow-lg">
                       <img src={p.image} alt={p.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                       <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                           <h3 className="text-white text-xl font-bold">{p.title}</h3>
                       </div>
                   </Link>
               ))}
            </div>
        </section>

      </div>
      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] bg-brand-charcoal/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10"
          >
             <button 
                className="absolute top-6 right-6 text-white hover:text-brand-rose transition-colors z-[110]"
                onClick={() => setSelectedImage(null)}
             >
                <X size={40} />
             </button>
             
             <motion.img 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                src={selectedImage} 
                alt="Project Full View" 
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl shadow-black/50"
             />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetails;