import { fetchTeamMembers, fetchStats } from '../api';
import { Play, Trophy, Users, Target, Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; 
import picture from '../assets/pattern.png';
import SEO from '../components/SEO';

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const scaleUp = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.6 } }
};

const About = () => {
  const [team, setTeam] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchTeamMembers(), fetchStats()])
    .then(([teamRes, statsRes]) => {
      setTeam(teamRes.data);
      setStats(statsRes.data);
      setLoading(false);
    })
    .catch(err => {
      console.error("Error fetching about page data:", err);
      setLoading(false);
    });
  }, []);

  // Fallback stats
  const displayStats = stats.length > 0 ? stats : [
    { value: "200+", label: "Happy Clients" },
    { value: "50+", label: "Projects Done" },
    { value: "5+", label: "Years Experience" }
  ];

  if (loading) {
      return (
          <div className="pt-40 pb-20 flex justify-center">
              <Loader2 size={48} className="animate-spin text-brand-rose opacity-20" />
          </div>
      );
  }

  return (
    <div className="pt-20 overflow-hidden">
       <SEO 
  title="About Us | Nexora Creative Solutions"
  description="Meet the team behind Nexora. We are a group of passionate developers and creatives in Kiambu dedicated to transforming Kenyan businesses through technology."
  url="/about"
/>
      
      {/* 1. Header Section */}
      <section className="relative py-24 text-center text-white overflow-hidden">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <img 
            src={picture}
            alt="Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-brand-charcoal/55"></div>
        </div>

        {/* Content Layer */}
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-creative">
            About Us
          </h1>
          <div className="flex justify-center gap-2 text-gray-300 text-sm font-medium">
            <Link to="/" className="hover:text-white transition-colors">Home</Link> / 
            <span className="text-brand-rose">About Us</span>
          </div>
        </div>
      </section>

      {/* 2. Intro & Vision Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
            {/* Image Collage Simulation */}
            <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={scaleUp}
                className="relative"
            >
                <div className="grid grid-cols-2 gap-4">
                    <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80" className="rounded-2xl shadow-lg mt-8" alt="Office" />
                    <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80" className="rounded-2xl shadow-lg" alt="Team" />
                </div>
                {/* Floating Badge */}
                <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brand-charcoal text-white p-6 rounded-full shadow-2xl border-4 border-white text-center w-32 h-32 flex flex-col items-center justify-center"
                >
                    <span className="text-3xl font-bold text-brand-rose">5+</span>
                    <span className="text-xs uppercase">Years Exp.</span>
                </motion.div>
            </motion.div>

            {/* Text Content */}
            <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
            >
                <motion.span variants={fadeInUp} className="text-brand-rose font-bold uppercase tracking-wider">The Vision</motion.span>
                <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-brand-charcoal mt-4 mb-6 leading-tight">
                    Transforming Ideas into <br/> <span className="text-brand-rose">Digital Reality</span>
                </motion.h2>
                <motion.p variants={fadeInUp} className="text-gray-600 mb-6 text-lg leading-relaxed">
                    At Nexora Creative Solutions, we believe in the power of technology to solve real-world problems. Our journey began with a simple mission: to help businesses navigate the digital landscape with confidence.
                </motion.p>
                
                <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-6 mt-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-50 p-3 rounded-lg text-brand-charcoal"><Target size={24}/></div>
                        <div>
                            <h4 className="font-bold text-brand-charcoal">Mission</h4>
                            <p className="text-sm text-gray-500">Innovation first</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-red-50 p-3 rounded-lg text-brand-rose"><Heart size={24}/></div>
                        <div>
                            <h4 className="font-bold text-brand-charcoal">Values</h4>
                            <p className="text-sm text-gray-500">Client focused</p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
      </section>

      {/* 3. Video / Stats Section */}
      <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
              <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="relative rounded-3xl overflow-hidden h-[400px] shadow-2xl group cursor-pointer"
              >
                  <div className="absolute inset-0 bg-brand-charcoal/40 group-hover:bg-brand-charcoal/30 transition-colors z-10"></div>
                  <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80" alt="Video Cover" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"/>
                  
                  {/* Play Button */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                      <div className="relative">
                          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center pl-1 shadow-lg animate-pulse">
                              <Play size={32} className="text-brand-rose fill-current" />
                          </div>
                      </div>
                  </div>
                  
                  {/* Floating Stats Bottom */}
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-8 z-20 flex justify-around text-white">
                        {displayStats.slice(0, 3).map((stat, idx) => (
                            <div key={idx} className="text-center">
                                <h3 className="text-3xl font-bold">{stat.value}</h3>
                                <p className="text-sm opacity-80">{stat.label}</p>
                            </div>
                        ))}
                  </div>
              </motion.div>
          </div>
      </section>

      {/* 4. Awards Section */}
      <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="mb-12"
                >
                    <span className="text-brand-rose font-bold uppercase tracking-wider">Recognition</span>
                    <h2 className="text-3xl font-bold text-brand-charcoal mt-2">Our Awards & Winning Success</h2>
                </motion.div>

                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="grid md:grid-cols-4 gap-8"
                >
                    {[1, 2, 3, 4].map((item) => (
                        <motion.div 
                            key={item} 
                            variants={fadeInUp}
                            whileHover={{ y: -10 }}
                            className="border border-gray-100 p-8 rounded-xl shadow-sm hover:shadow-lg transition bg-white"
                        >
                            <div className="w-16 h-16 bg-yellow-50 text-yellow-600 mx-auto rounded-full flex items-center justify-center mb-4">
                                <Trophy size={32} />
                            </div>
                            <h4 className="font-bold text-lg text-brand-charcoal">Best Tech Startups</h4>
                            <p className="text-gray-500 text-sm mt-2">2024 Winner</p>
                        </motion.div>
                    ))}
                </motion.div>
          </div>
      </section>

      {/* 5. Team / Founder Section */}
      <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-16">
                  <span className="text-brand-rose font-bold uppercase tracking-wider">Leadership</span>
                  <h2 className="text-4xl font-bold text-brand-charcoal mt-2">Meet the Founder</h2>
              </div>

              {/* Updated to Flex & Justify Center to center your single card */}
              <div className="flex flex-wrap justify-center gap-8">
                  {team.map((member, idx) => (
                      <motion.div 
                          key={idx}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.2 }}
                          viewport={{ once: true }}
                          className="bg-white rounded-2xl overflow-hidden shadow-lg group w-full md:w-[350px]"
                      >
                          <div className="relative h-96 overflow-hidden">
                              <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                              <div className="absolute inset-0 bg-brand-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-charcoal hover:bg-brand-rose hover:text-white cursor-pointer transition"><Users size={18}/></div>
                              </div>
                          </div>
                          <div className="p-6 text-center">
                              <h3 className="text-xl font-bold text-brand-charcoal">{member.name}</h3>
                              <p className="text-brand-rose font-medium">{member.role}</p>
                              <p className="text-gray-500 text-sm mt-3 leading-relaxed">{member.bio}</p>
                          </div>
                      </motion.div>
                  ))}
              </div>
          </div>
      </section>

      {/* 6. Testimonials Section */}
      <section className="py-20 bg-brand-charcoal text-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
              <span className="text-brand-rose font-bold uppercase tracking-wider">Testimonials</span>
              <h2 className="text-4xl font-bold mt-4 mb-12">Trusted by Our Clients</h2>
              
              <div className="grid md:grid-cols-2 gap-8 text-left">
                  {[1, 2].map((item) => (
                      <motion.div 
                          key={item}
                          whileHover={{ scale: 1.02 }}
                          className="bg-white/5 border border-white/10 p-8 rounded-2xl relative"
                      >
                          <div className="flex gap-1 text-yellow-400 mb-4">
                              {[1,2,3,4,5].map(star => <Star key={star} size={16} fill="currentColor" />)}
                          </div>
                          <p className="text-gray-300 italic mb-6">"Nexora transformed our digital presence completely. Their team is professional, creative, and incredibly skilled."</p>
                          <div className="flex items-center gap-4">
                              <img src={`https://randomuser.me/api/portraits/women/${item + 40}.jpg`} alt="Client" className="w-12 h-12 rounded-full border-2 border-brand-rose" />
                              <div>
                                  <h4 className="font-bold text-white">Sarah Johnson</h4>
                                  <p className="text-xs text-gray-400">CEO, TechStart</p>
                              </div>
                          </div>
                      </motion.div>
                  ))}
              </div>
          </div>
      </section>

    </div>
  );
};

export default About;