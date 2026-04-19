import React, { useState, useEffect } from 'react';
import { Facebook, Twitter, Linkedin, Instagram, Loader2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { subscribeNewsletter } from '../api';
import picture from '../assets/newton.jpeg';
import Logo from '../assets/NCS_Secondary_Logo.png'; 

const ComingSoon = () => {
  // 1. Define the missing state variables
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [message, setMessage] = useState('');

  const [timeLeft, setTimeLeft] = useState({
    days: 5,
    hours: 1,
    minutes: 30,
    seconds: 18
  });

  // Countdown logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else {
          seconds = 59;
          if (minutes > 0) minutes--;
          else {
            minutes = 59;
            if (hours > 0) hours--;
            else {
              hours = 23;
              if (days > 0) days--;
            }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
        setMessage('Please enter a valid email.');
        setStatus('error');
        return;
    }

    setStatus('loading');
    setMessage('');

    try {
        // 1. Save to Backend API
        await subscribeNewsletter(email);

        // 2. Send Email via EmailJS
        // REPLACE WITH YOUR ACTUAL KEYS FROM EMAILJS DASHBOARD
        const serviceID = "service_nhwsclu"; 
        const templateID = "template_7i8obf5"; 
        const publicKey = "ctUKvg88_0Th5sfKn";

        const templateParams = {
            user_email: email, 
        };

        await emailjs.send(serviceID, templateID, templateParams, publicKey);

        setStatus('success');
        setEmail('');
        setMessage('You have been subscribed successfully!');
        
    } catch (error) {
        console.error("Error: ", error);
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans">
      
      {/* ---------------- LEFT SIDE (Image) ---------------- */}
      <div className="w-full md:w-1/2 relative h-[400px] md:h-screen flex-shrink-0">
        <img 
          src={picture}
          alt="Newton Mwangi"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-brand-charcoal/20"></div>
        
        {/* Testimonial Overlay */}
        <div className="absolute bottom-10 left-10 right-10 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl text-white hidden md:block max-w-md mx-auto md:mx-0">
            <p className="italic mb-4 text-lg leading-relaxed">"We are building something extraordinary. Stay tuned for the launch of Nexora's new digital experience platform."</p>
            <div>
                <h4 className="font-bold text-xl">Newton Mwangi</h4>
                <p className="text-sm opacity-90">CEO, Nexora Creative Solutions</p>
            </div>
        </div>
      </div>

      {/* ---------------- RIGHT SIDE (Content) ---------------- */}
      <div className="w-full md:w-1/2 flex flex-col bg-white h-auto md:h-screen overflow-y-auto">
         
         {/* 1. Logo Section */}
         <div className="p-8 md:p-5 pb-0">
            <Link to="/">
                <img 
                  src={Logo} 
                  alt="Nexora Creative Solutions" 
                  className="h-16 md:h-20 w-auto object-contain" 
                />
            </Link>
         </div>

         {/* 2. Main Content */}
         <div className="flex-grow flex flex-col justify-center px-8 md:px-10 py-10">
             <div className="max-w-lg w-full mx-auto">
                <span className="text-brand-rose font-bold uppercase tracking-wider text-sm mb-3 block">
                    // Coming Soon
                </span>
                <h1 className="text-4xl md:text-6xl font-extrabold text-brand-charcoal mb-8 leading-tight">
                    Get Notified When <br/> We <span className="text-brand-rose">Launch!</span>
                </h1>

                {/* Countdown */}
                <div className="flex gap-4 md:gap-8 mb-12 text-center">
                    {[
                        { label: 'Days', val: timeLeft.days },
                        { label: 'Hours', val: timeLeft.hours },
                        { label: 'Minutes', val: timeLeft.minutes },
                        { label: 'Seconds', val: timeLeft.seconds }
                    ].map((item, idx) => (
                        <div key={idx} className="flex-1">
                            <div className="text-3xl md:text-5xl font-bold text-brand-charcoal mb-2 font-mono">
                                {String(item.val).padStart(2, '0')}
                            </div>
                            <p className="text-gray-500 text-xs md:text-sm uppercase font-bold tracking-wide">{item.label}</p>
                        </div>
                    ))}
                </div>

                {/* Subscription Form */}
                <div className="mb-10">
                    <p className="text-gray-600 mb-4 font-medium">Get notified when site goes live:</p>
                    
                    {/* WRAPPED IN FORM TO HANDLE SUBMIT */}
                    <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input 
                                type="email" 
                                placeholder="Enter your email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={status === 'loading' || status === 'success'}
                                className="w-full px-6 py-4 rounded-full border border-gray-200 focus:outline-none focus:border-brand-rose bg-gray-50 focus:ring-1 focus:ring-brand-rose transition disabled:opacity-50" 
                            />
                            <button 
                                type="submit"
                                disabled={status === 'loading' || status === 'success'}
                                className={`px-8 py-4 rounded-full font-bold transition shadow-lg whitespace-nowrap flex items-center justify-center min-w-[140px] ${
                                    status === 'success' 
                                    ? 'bg-green-500 text-white cursor-default' 
                                    : 'bg-brand-rose text-white hover:bg-brand-charcoal'
                                }`}
                            >
                                {status === 'loading' ? <Loader2 className="animate-spin" /> : status === 'success' ? 'Subscribed!' : 'Subscribe'}
                            </button>
                        </div>
                        {/* Message Feedback Area */}
                        {message && (
                            <p className={`text-sm ml-2 ${status === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                                {message}
                            </p>
                        )}
                    </form>
                </div>

                {/* Social Icons */}
                <div className="flex gap-4">
                    {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                        <a key={i} href="#" className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 text-brand-charcoal rounded-full flex items-center justify-center hover:bg-brand-rose hover:text-white transition-all duration-300">
                           <Icon size={20}/>
                        </a>
                    ))}
                </div>
             </div>
         </div>

         {/* 3. Footer */}
         <div className="p-8 md:p-12 text-gray-400 text-sm md:text-center lg:text-left">
             Copyright © {new Date().getFullYear()} Nexora Creative Solutions.
         </div>

      </div>
    </div>
  );
};

export default ComingSoon;