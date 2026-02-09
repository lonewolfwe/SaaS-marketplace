// Centralized configuration for the application

const isDevelopment = import.meta.env.MODE === 'development';

export const API_URL = isDevelopment
    ? 'https://saas-marketplace-xq1j.onrender.com/api/v1'
    : 'https://saas-marketplace-xq1j.onrender.com/api/v1'; // Update with real prod URL when deploying

export const BASE_URL = isDevelopment
    ? 'https://saas-marketplace-xq1j.onrender.com'
    : 'https://saas-marketplace-xq1j.onrender.com';

export default {
    API_URL,
    BASE_URL
};
