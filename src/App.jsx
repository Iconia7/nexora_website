import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom'; // Added useNavigate
import { useEffect } from 'react';
import { Suspense, lazy } from 'react';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import WhatsAppButton from './components/WhatsAppButton';
import AnalyticsTracker from './components/AnalyticsTracker';
import { Toaster } from 'react-hot-toast';
import AdminPanel from './pages/AdminPanel';

// --- LAZY IMPORTS ---
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetails = lazy(() => import('./pages/ServiceDetails'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetails = lazy(() => import('./pages/ProjectDetails'));
const Blogs = lazy(() => import('./pages/Blogs'));
const BlogDetails = lazy(() => import('./pages/BlogDetails'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Team = lazy(() => import('./pages/Team'));
const TeamDetails = lazy(() => import('./pages/TeamDetails'));
const Careers = lazy(() => import('./pages/Careers'));
const Contact = lazy(() => import('./pages/Contact'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Terms = lazy(() => import('./pages/Terms'));
const ComingSoon = lazy(() => import('./pages/ComingSoon'));
const NotFound = lazy(() => import('./pages/NotFound'));


// --- NEW SHOP IMPORT ---
// Ensure your Shop.jsx file is in the 'src' folder, or move it to 'pages' and update this path to './pages/Shop'
const Shop = lazy(() => import('./Shop')); 

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Wrapper to help the Shop use React Router's navigation
const ShopWrapper = () => {
  const navigate = useNavigate();
  return <Shop onBack={() => navigate('/')} />;
};

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <ConditionalLayout>
          <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader /></div>}>
            <Routes>
              {/* --- LIVE ROUTES --- */}
              
              {/* 1. Root is now the Real Home Page */}
              <Route path="/" element={<Home />} />
              
              {/* 2. Main Pages */}
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:id" element={<ServiceDetails />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetails />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/:id" element={<BlogDetails />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/team" element={<Team />} />
              <Route path="/team/:id" element={<TeamDetails />} />
              <Route path="/admin" element={<AdminPanel />} />

              {/* --- 3. THE SHOP ROUTE --- */}
              <Route path="/shop" element={<ShopWrapper />} />

              {/* 4. Legal */}
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
              
              {/* 5. Utilities */}
              <Route path="/coming-soon" element={<ComingSoon />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ConditionalLayout>
      </div>
    </Router>
  );
}

// Wrapper to hide Navbar/Footer only on specific utility pages
const ConditionalLayout = ({ children }) => {
  const location = useLocation();
  
  // HIDE Navbar/Footer on 'Coming Soon' AND 'Shop' (since Shop has its own header)
  const hideLayout = location.pathname === '/coming-soon' || location.pathname === '/shop'; 

  return (
    <>
    <AnalyticsTracker />
      <ScrollToTop />
      {!hideLayout && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!hideLayout && <Footer />}

      {/* --- ADD THEM HERE --- */}
      {!hideLayout && <CookieBanner />}
      {!hideLayout && <WhatsAppButton />}
      <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: '#333',
              color: '#fff',
              zIndex: 9999,
            },
            success: {
              iconTheme: {
                primary: '#A7002A', // Brand Rose color
                secondary: 'white',
              },
            },
          }}
        />
    </>
  );
};

export default App;