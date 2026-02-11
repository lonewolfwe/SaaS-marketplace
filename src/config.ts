// Centralized configuration for the application

const isDevelopment = import.meta.env.MODE === 'development';

export const API_URL = import.meta.env.VITE_API_URL || (isDevelopment
    ? 'http://localhost:5000/api/v1'
    : 'https://saas-marketplace-1-6qqt.onrender.com/api/v1');

export const BASE_URL = isDevelopment
    ? 'http://localhost:5000'
    : 'https://saas-marketplace-1-6qqt.onrender.com';

export default {
    API_URL,
    BASE_URL
};
