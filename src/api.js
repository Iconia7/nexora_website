import axios from 'axios';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD
    ? 'https://api.nexoracreatives.co.ke/api'
    : 'http://localhost:8000/api');

export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

/**
 * Turns relative Django media paths (/media/...) into full URLs while leaving
 * already-absolute URLs and local public assets untouched.
 */
export const resolveMediaUrl = (url) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/media/')) return `${API_ORIGIN}${url}`;
  return url;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Company Profile (Live Ltd details)
export const fetchCompanyProfile = () => api.get('/company/');

// Core Services, Pricing, Team, Benefits, Stats, Testimonials, FAQs
export const fetchServices = () => api.get('/services/');
export const fetchServiceById = (id) => api.get(`/services/${id}/`);
export const fetchPricing = () => api.get('/pricing/');
export const fetchTeamMembers = () => api.get('/team/');
export const fetchTeamMemberById = (id) => api.get(`/team/${id}/`);
export const fetchBenefits = () => api.get('/benefits/');
export const fetchStats = () => api.get('/stats/');
export const fetchTestimonials = () => api.get('/testimonials/');
export const fetchFAQs = () => api.get('/faqs/');

// Portfolio & Blog & Store
export const fetchProjects = () => api.get('/projects/');
export const fetchProjectById = (id) => api.get(`/projects/${id}/`);
export const fetchBlogs = () => api.get('/blogs/');
export const fetchBlogById = (id) => api.get(`/blogs/${id}/`);
export const fetchBlogCategories = () => api.get('/blog-categories/');
export const fetchProducts = () => api.get('/products/');

// Careers
export const fetchJobs = () => api.get('/jobs/');
export const submitJobApplication = (data) => api.post('/job-applications/', data);

// Contact & Newsletter
export const submitContactMessage = (data) => api.post('/contact-messages/', data);
export const subscribeNewsletter = (email) => api.post('/newsletter/', { email });

// Payments (M-Pesa Daraja)
export const initiateStkPush = (data) =>
  api.post('/mpesa/stkpush/', data, {
    headers: import.meta.env.VITE_API_SECRET
      ? { 'X-Nexora-Secret': import.meta.env.VITE_API_SECRET }
      : {},
  });
export const checkOrderStatus = (checkoutID) =>
  api.get(`/mpesa/check_status/?checkout_id=${encodeURIComponent(checkoutID)}`);
export const checkPaymentStatus = checkOrderStatus;
export const notifyPricingOrder = (data) => api.post('/mpesa/checkout-notify/', data);

export default api;
