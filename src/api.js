import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const fetchServices = () => api.get('/services/');
export const fetchServiceById = (id) => api.get(`/services/${id}/`);
export const fetchPricing = () => api.get('/pricing/');
export const fetchTeamMembers = () => api.get('/team/');
export const fetchTeamMemberById = (id) => api.get(`/team/${id}/`);
export const fetchBenefits = () => api.get('/benefits/');
export const fetchProjects = () => api.get('/projects/');
export const fetchProjectById = (id) => api.get(`/projects/${id}/`);
export const fetchBlogs = () => api.get('/blogs/');
export const fetchBlogById = (id) => api.get(`/blogs/${id}/`);
export const fetchProducts = () => api.get('/products/');

// Careers
export const fetchJobs = () => api.get('/jobs/');

// Contact & Newsletter
export const submitContactMessage = (data) => api.post('/contact-messages/', data);
export const subscribeNewsletter = (email) => api.post('/newsletter/', { email });

// Stats
export const fetchStats = () => api.get('/stats/');

// Payments
export const initiateStkPush = (data) => api.post('/mpesa/stkpush/', data, {
    headers: {
        'X-Nexora-Secret': import.meta.env.VITE_API_SECRET
    }
});
export const checkOrderStatus = (checkoutID) => api.get(`/mpesa/check_status/?checkout_id=${checkoutID}`);
export const checkPaymentStatus = checkOrderStatus;

export default api;
