import { Smartphone, PenTool, Layout, Globe, Search, Database } from 'lucide-react';
import newtonImg from './assets/newton.jpeg';
import dita from './assets/banner.png';
import mbizna from './assets/mbizna.png';
import kadi from './assets/kadi.png';
import keja from './assets/keja.png';
import blog1 from './assets/blog1.png';
import blog2 from './assets/blog2.png';
import blog3 from './assets/blog3.png';
import blog4 from './assets/blog4.png';

export const services = [
  { 
    id: 1, 
    title: "Website Development", 
    icon: <Globe size={24} />, 
    desc: "High-performance websites built with React & modern technologies.",
    details: {
      heading: "Professional Web Development",
      intro: "Your website is your digital headquarters. We build responsive, lightning-fast, and secure websites that turn visitors into loyal customers. Whether you need a simple corporate site or a complex web application, we have the stack to deliver.",
      includes: ["Custom React/Next.js Development", "E-commerce Solutions", "Content Management Systems (CMS)", "Maintenance & Analytics"],
      expertise: [
        { id: 1, title: "Modern Tech Stack", text: "We use React, Tailwind CSS, and Django to build scalable and maintainable codebases." },
        { id: 2, title: "Mobile-First Design", text: "Ensuring your site looks and works perfectly on every screen size, from phones to desktops." },
        { id: 3, title: "SEO Ready", text: "Built-in technical SEO optimization to help your business rank higher on Google search results." }
      ]
    }
  },
  { 
    id: 2, 
    title: "Mobile App Development", 
    icon: <Smartphone size={24} />, 
    desc: "Native & Cross-platform apps using Flutter.",
    details: {
      heading: "Scalable Mobile Applications",
      intro: "Transform your business ideas into powerful mobile apps. We specialize in cross-platform development using Flutter, allowing us to deploy to both Android and iOS from a single codebase—saving you time and money.",
      includes: ["Android & iOS Apps", "Flutter Cross-Platform Development", "M-Pesa Payment Integration", "Google Play Store Deployment"],
      expertise: [
        { id: 1, title: "Native Performance", text: "Apps that feel smooth and responsive, running at 60fps on modern devices." },
        { id: 2, title: "Offline Capabilities", text: "Building apps that work seamlessly even with unstable internet connections." },
        { id: 3, title: "Fintech Integration", text: "Expertise in integrating mobile money payments (M-Pesa/Airtel Money) directly into your app." }
      ]
    }
  },
  { 
    id: 3, 
    title: "UI/UX Design", 
    icon: <PenTool size={24} />, 
    desc: "User-centric interfaces that drive engagement.",
    details: { 
      heading: "Designing Experiences That Matter", 
      intro: "Great code needs great design. Our UI/UX process focuses on understanding your user's needs and creating intuitive, beautiful interfaces that make using your product a joy.", 
      includes: ["User Research & Personas", "Wireframing & Prototyping", "Mobile & Web App Design", "Usability Testing"], 
      expertise: [
        { id: 1, title: "Design Thinking", text: "We prioritize the user journey, ensuring every click and swipe feels natural and logical." },
        { id: 2, title: "High-Fidelity Prototypes", text: "Interactive previews using Figma that look exactly like the final product." },
        { id: 3, title: "Design Systems", text: "Creating reusable component libraries to ensure consistency across your brand." }
      ] 
    } 
  },
  { 
    id: 4, 
    title: "Graphics & Branding", 
    icon: <Layout size={24} />, 
    desc: "Logos, brand identity, and marketing assets.",
    details: { 
      heading: "Visual Identity & Branding", 
      intro: "Stand out in a crowded market. We create cohesive brand identities that tell your story visually, from your logo to your social media posts.", 
      includes: ["Logo Design", "Brand Guidelines", "Social Media Graphics", "Company Profiles & Brochures"], 
      expertise: [
        { id: 1, title: "Brand Strategy", text: "More than just a logo—we define the colors, fonts, and voice that represent your company." },
        { id: 2, title: "Marketing Collateral", text: "Designing posters, flyers, and digital assets that capture attention and drive conversions." },
        { id: 3, title: "Print Ready", text: "High-resolution vector files ready for billboards, merchandise, or business cards." }
      ] 
    } 
  },
  { 
    id: 5, 
    title: "Digital Marketing", 
    icon: <Search size={24} />, 
    desc: "SEO and campaigns to grow your online presence.",
    details: { 
      heading: "Growth & Digital Marketing", 
      intro: "Building a product is half the battle; getting it seen is the other. We help you reach your target audience through data-driven marketing strategies.", 
      includes: ["Search Engine Optimization (SEO)", "Social Media Management", "Content Strategy", "Email Marketing"], 
      expertise: [
        { id: 1, title: "Targeted Reach", text: "Using analytics to identify and engage the customers most likely to buy your services." },
        { id: 2, title: "Content That Converts", text: "Creating copy and visuals that turn casual scrollers into paying clients." },
        { id: 3, title: "Analytics & Reporting", text: "Transparent reports showing exactly how your campaigns are performing." }
      ] 
    } 
  },
  { 
    id: 6, 
    title: "Cloud & Backend", 
    icon: <Database size={24} />, 
    desc: "Secure databases and API development.",
    details: { 
      heading: "Cloud Infrastructure & APIs", 
      intro: "A strong backend is the backbone of any digital product. We design secure databases and robust APIs to ensure your data is safe and accessible.", 
      includes: ["Database Design (SQL/NoSQL)", "API Development (Django/Node)", "Firebase Integration", "Cloud Hosting & Deployment"], 
      expertise: [
        { id: 1, title: "Scalable Architecture", text: "Systems built to handle growth, from 10 users to 10,000 without crashing." },
        { id: 2, title: "Data Security", text: "Implementing industry-standard encryption and authentication protocols." },
        { id: 3, title: "Real-time Sync", text: "Using Firebase for instant data updates across all user devices." }
      ] 
    } 
  },
];

export const projects = [
  { 
    id: 1, 
    title: "Keja Hunter", 
    category: "Mobile App", 
    // Replace with a screenshot of your actual app later
    image: keja,
    client: "University Students",
    date: "Dec 2025",
    location: "Nairobi, Kenya",
    challenge: "University students often struggle to find affordable, safe, and verified housing near campus due to scattered information and unreliable agents.",
    solution: "I developed a cross-platform mobile application using Flutter and a Django backend. It features verified listings, advanced filtering, and direct landlord contact to streamline the house-hunting process.",
    impact: "Simplifies the housing search for Daystar University students and provides a centralized platform for landlords."
  },
  { 
    id: 2, 
    title: "M-Bizna", 
    category: "Fintech App", 
    image: mbizna,
    client: "Retail Merchants",
    date: "Sept 2025",
    location: "Thika, Kenya",
    challenge: "Small businesses needed a way to manage digital payments efficiently without expensive hardware POS systems.",
    solution: "Implemented a token-based transaction system integrated with M-Pesa STK Push. The app allows users to purchase tokens and merchants to redeem them instantly.",
    impact: "Successfully integrated mobile money payments, reducing transaction times and providing clear digital records for merchants."
  },
  { 
    id: 3, 
    title: "DITA Club App", 
    category: "Mobile App", 
    image: dita,
    client: "Daystar IT Association",
    date: "Aug 2025",
    location: "Daystar University",
    challenge: "The IT club lacked a centralized platform for member registration, event announcements, and resource sharing.",
    solution: "Built a dedicated mobile app featuring member profiles, an events calendar, and an integrated AI assistant to answer student queries about club activities.",
    impact: "Digitized the club's operations, improving member engagement and communication efficiency."
  },
  { 
    id: 4, 
    title: "Kadi KE", 
    category: "Game Development", 
    image: kadi,
    client: "Personal Project",
    date: "Dec 2025",
    location: "Kenya",
    challenge: "Digitizing popular local Kenyan card games for a modern mobile experience while maintaining the authentic feel.",
    solution: "Created a multiplayer card game using Flutter and Firebase. Features include 'Go Fish' and 'Kadi' modes, supporting both online and LAN multiplayer functionality.",
    impact: "Provides a fun, culturally relevant digital entertainment experience with seamless real-time multiplayer capabilities."
  }
];

export const servicePricing = {
  "Website Development": [
    {
      plan: "Static / Portfolio",
      price: "35,000",
      period: "One-off",
      features: [
        "5-Page Responsive Website",
        "Contact Form & Google Maps",
        "Social Media Integration",
        "Basic SEO Setup",
        "1 Month Free Support",
        "1 Year Domain Name"
      ],
      recommended: false
    },
    {
      plan: "Business / Corporate",
      price: "85,000",
      period: "One-off",
      features: [
        "Dynamic Content (CMS)",
        "Blog/News Section",
        "Live Chat Integration",
        "Google Analytics Setup",
        "Speed Optimization",
        "3 Months Free Support"
      ],
      recommended: true
    },
    {
      plan: "E-Commerce",
      price: "150,000",
      period: "Starting From",
      features: [
        "Online Store (Unlimited Products)",
        "M-Pesa & Card Payments",
        "Customer Dashboard",
        "Inventory Management",
        "Admin Panel",
        "6 Months Priority Support"
      ],
      recommended: false
    }
  ],
  "Mobile App Development": [
    {
      plan: "MVP App",
      price: "150,000",
      period: "Starting From",
      features: [
        "Android Only (Flutter)",
        "Basic UI/UX",
        "User Authentication",
        "Local Database",
        "Google Play Submission",
        "1 Month Bug Fixes"
      ],
      recommended: false
    },
    {
      plan: "Pro Cross-Platform",
      price: "300,000",
      period: "Starting From",
      features: [
        "Android & iOS (Flutter)",
        "M-Pesa Integration",
        "Push Notifications",
        "Cloud Database (Firebase)",
        "Admin Dashboard (Web)",
        "3 Months Support"
      ],
      recommended: true
    },
    {
      plan: "Enterprise System",
      price: "Custom",
      period: "Quote Based",
      features: [
        "Complex Logic & Algorithms",
        "Real-time Tracking/Chat",
        "API Integrations",
        "Scalable Cloud Backend",
        "Dedicated Dev Team",
        "SLA Support Contract"
      ],
      recommended: false
    }
  ],
  "UI/UX Design": [
    {
      plan: "Startup Pack",
      price: "20,000",
      period: "Per Project",
      features: ["Logo Design", "Brand Color Palette", "Typography Selection", "Business Card Design"],
      recommended: false
    },
    {
      plan: "App/Web Design",
      price: "45,000",
      period: "Per Project",
      features: ["High Fidelity UI (Figma)", "Interactive Prototyping", "User Journey Maps", "Design System", "Mobile & Desktop Views"],
      recommended: true
    },
    {
      plan: "Full Product Design",
      price: "80,000+",
      period: "Per Project",
      features: ["User Research & Personas", "Wireframing", "Usability Testing", "Developer Handoff Docs", "Full Design System"],
      recommended: false
    }
  ],
  // Add similar arrays for Digital Marketing, Cloud, etc.
  "Digital Marketing": [
     { plan: "Starter SEO", price: "25,000", period: "Monthly", features: ["Keyword Research", "On-Page Optimization", "Google My Business", "Monthly Report"], recommended: false },
     { plan: "Social Growth", price: "40,000", period: "Monthly", features: ["3 Social Platforms", "12 Posts/Month", "Community Management", "Ad Campaign Setup", "Performance Analytics"], recommended: true },
     { plan: "Full Scale", price: "75,000", period: "Monthly", features: ["SEO + Social Media", "Content Marketing (Blogs)", "Email Campaigns", "Video Content Creation", "Dedicated Manager"], recommended: false }
  ],
  "Cloud & Backend": [
    {
      plan: "Serverless MVP",
      price: "35,000",
      period: "One-off",
      features: [
        "Firebase/Supabase Setup",
        "User Authentication (Google/Email)",
        "Real-time Database",
        "Cloud Functions (Basic Logic)",
        "Secure Rules Configuration",
        "Hosting Setup"
      ],
      recommended: false
    },
    {
      plan: "Custom API & DB",
      price: "85,000",
      period: "Starting From",
      features: [
        "REST/GraphQL API (Node.js/Django)",
        "Relational Database (PostgreSQL)",
        "VPS Setup (DigitalOcean/AWS)",
        "Swagger Documentation",
        "Automated Backups",
        "1 Month Support"
      ],
      recommended: true
    },
    {
      plan: "Scalable Infra",
      price: "Custom",
      period: "Quote Based",
      features: [
        "Microservices Architecture",
        "Docker & Kubernetes",
        "CI/CD Pipelines (GitHub Actions)",
        "Load Balancing & Caching (Redis)",
        "Advanced Security & Firewalls",
        "SLA Support"
      ],
      recommended: false
    }
  ]
};

export const team = [
{ 
    id: 1, 
    name: "Newton Mwangi", 
    role: "Chief Executive Officer", 
    // Use the imported variable here
    image: newtonImg,
    email: "info@nexoracreatives.co.ke",
    phone: "+254 115 332 870",
    experience: "5+ Years",
    socials: {
        facebook: "https://facebook.com/profile.php?id=100083433616499",
        twitter: "https://x.com/newtondesigns_",
        linkedin: "https://linkedin.com/in/newton-mwangi-9732142a1", // Replace with your actual LinkedIn URL
        instagram: "https://instagram.com/nexoracreatives_ke?igsh=am5iM3NxYjhxa3Bn"
    },
    bio: "Newton is a visionary tech entrepreneur and full-stack developer with a passion for building scalable mobile and web solutions. With expertise in Flutter, React, and Django, he leads Nexora's strategy to deliver innovative digital products for modern businesses.",
    skills: [
      { name: "Mobile Development (Flutter)", level: 95 },
      { name: "Web Development (React)", level: 90 },
      { name: "UI/UX & Brand Identity", level: 85 },
      { name: "Backend (Django/Python)", level: 80 }
    ]
  }
];

export const benefits = [
    { id: 1, title: "Remote Friendly", desc: "Work from anywhere with our flexible remote policies." },
    { id: 2, title: "Health Insurance", desc: "Comprehensive health coverage for you and your family." },
    { id: 3, title: "Paid Time Off", desc: "Generous vacation days and holidays to recharge." },
    { id: 4, title: "Team Building", desc: "Regular retreats and fun activities to bond with the team." },
    { id: 5, title: "Learning Budget", desc: "Annual stipend for courses, books, and conferences." },
    { id: 6, title: "Gym Membership", desc: "Stay fit and healthy with our wellness partnerships." },
];
  
export const jobs = [
  { 
    id: 1, 
    title: "Frontend Developer (Flutter & React)", 
    type: "Contract / Remote", 
    location: "Remote", 
    exp: "1-3 Years" 
  },
  { 
    id: 2, 
    title: "Creative UI/UX Designer", 
    type: "Part Time", 
    location: "Remote", 
    exp: "Portfolio Based" 
  },
  { 
    id: 3, 
    title: "Digital Marketing Specialist", 
    type: "Full Time", 
    location: "Nairobi / Thika", 
    exp: "2+ Years" 
  },
  { 
    id: 4, 
    title: "Business Development Intern", 
    type: "Internship", 
    location: "Nairobi", 
    exp: "Entry Level" 
  }
];

// ... (keep your team, services, projects arrays above this)

export const blogs = [
  {
    id: 1,
    title: "The Future of Web Development: Trends to Watch in 2025",
    category: "Web Development",
    author: "Newton Mwangi",
    date: "Feb 19, 2025",
    image: blog1,
    excerpt: "Discover the latest technologies and frameworks that are shaping the future of the web.",
    content: {
      intro: "As we move further into the digital age, web development continues to evolve at a breakneck pace. From AI-driven interfaces to decentralized web applications, 2025 promises to be a year of significant transformation. Developers are no longer just coding; they are architecting intelligent ecosystems.",
      sections: [
        { title: "Overview of Web Evolution", text: "The static web pages of the past are long gone. Today, users expect dynamic, personalized experiences that load instantly. This shift is driving the adoption of frameworks like Next.js 14 and remixing how we think about server-side rendering (SSR) versus static site generation (SSG)." },
        { title: "AI and Machine Learning Integration", text: "Artificial Intelligence is no longer just a buzzword. It's becoming an integral part of the development process. We are seeing AI-driven code generation tools like GitHub Copilot maturing, but more importantly, we are seeing AI embedded directly into user interfaces for personalized content delivery and smarter search functionality." },
        { title: "The Return of Monoliths?", text: "Interestingly, after years of microservices dominance, many developers are advocating for 'modular monoliths.' Tools like Rails and Django are seeing a resurgence as teams realize that for many mid-sized applications, the complexity of distributed systems isn't worth the overhead." }
      ],
      practices: [
        { id: 1, title: "Better Animation", text: "Using lightweight libraries like Framer Motion for smooth UI transitions that delight users." },
        { id: 2, title: "The Need for Speed", text: "Optimizing core web vitals (LCP, FID, CLS) is now critical for SEO rankings on Google." },
        { id: 3, title: "Prompt UI/UX", text: "Interfaces that anticipate user needs before they click, powered by predictive models." }
      ]
    }
  },
  {
    id: 2,
    title: "The Role of AI in Cloud Computing and Automation",
    category: "Cloud Computing",
    author: "Sarah Connor",
    date: "Feb 15, 2025",
    image: blog2,
    excerpt: "How Artificial Intelligence is optimizing cloud infrastructure and reducing operational costs.",
    content: {
      intro: "Cloud computing provides the infrastructure, but AI provides the intelligence. Together, they are automating complex tasks that previously required human intervention, leading to what industry experts call 'Self-Healing Infrastructure'.",
      sections: [
        { title: "Intelligent Resource Management", text: "AI algorithms can now predict traffic spikes with 90% accuracy. This allows cloud providers like AWS and Azure to dynamically allocate resources before the demand hits, preventing crashes and saving money during downtimes." },
        { title: "Security and Threat Detection", text: "Traditional firewalls are rule-based. AI security is behavioral. It learns what 'normal' traffic looks like for your specific application and can instantly flag anomalies—like a user logging in from an unusual location or a sudden spike in database queries—blocking potential hacks in real-time." }
      ],
      practices: [
        { id: 1, title: "Automated Backups", text: "AI-driven schedules that backup data based on change frequency rather than fixed times." },
        { id: 2, title: "Cost Optimization", text: "Tools that automatically shut down unused instances to prevent 'cloud bill shock'." },
        { id: 3, title: "Predictive Maintenance", text: "Identifying hardware failures in data centers before they actually break." }
      ]
    }
  },
  {
    id: 3,
    title: "The Rise of Super Apps: What it Means for Consumers",
    category: "Mobile App",
    author: "Mike Ross",
    date: "Feb 10, 2025",
    image: blog3,
    excerpt: "Why users are preferring all-in-one solutions over single-purpose applications.",
    content: {
      intro: "Super apps like WeChat have dominated Asia for years, and now the trend is moving global. Users are experiencing 'app fatigue'—they don't want to download 50 different apps. They want one app to chat, pay bills, order food, and book rides.",
      sections: [
        { title: "The Convenience Factor", text: "The biggest driver is convenience. Having a single login and a single payment method linked to multiple services reduces friction. For businesses, this means higher user retention rates because the user has no reason to leave the ecosystem." },
        { title: "Challenges for Developers", text: "Building a Super App is technically demanding. It requires a robust micro-frontend architecture where different 'mini-apps' can run independently within the main container. Security is also a massive concern, as a single breach compromises the user's entire digital life." }
      ],
      practices: [
        { id: 1, title: "Unified Design System", text: "Ensuring a consistent look and feel across all mini-services within the app." },
        { id: 2, title: "Mini-App Sandbox", text: "Running third-party services in isolated environments to prevent crashes." },
        { id: 3, title: "Seamless Payments", text: "One-tap checkout for everything from groceries to cinema tickets." }
      ]
    }
  },
  {
    id: 4,
    title: "Best Practices for Designing User-Friendly Mobile Apps",
    category: "UI/UX Design",
    author: "Emily Clark",
    date: "Feb 05, 2025",
    image: blog4,
    excerpt: "Key principles to ensure your mobile application engages users effectively.",
    content: {
      intro: "A pretty app is useless if users can't navigate it. In 2025, mobile usability is about accessibility, dark mode defaults, and 'thumb-friendly' zones. We explore the core principles that separate top-tier apps from the rest.",
      sections: [
        { title: "The 'Thumb Zone' Rule", text: "With phones getting larger, users struggle to reach the top corners of the screen. Modern UX design places key navigation elements and call-to-action buttons at the bottom of the screen, easily reachable by the thumb." },
        { title: "Dark Mode is Mandatory", text: "It is no longer an optional feature. Users expect Dark Mode to save battery and reduce eye strain. Apps that blind users with bright white screens at night are often uninstalled quickly." }
      ],
      practices: [
        { id: 1, title: "Minimalism", text: "Stripping away non-essential elements to focus on the core task." },
        { id: 2, title: "Haptic Feedback", text: "Using subtle vibrations to confirm actions like clicks or errors." },
        { id: 3, title: "Micro-Interactions", text: "Small animations (like a 'like' button pop) that make the app feel alive." }
      ]
    }
  }
];