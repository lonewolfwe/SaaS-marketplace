// Centralized configuration for the application

const isDevelopment = import.meta.env.MODE === 'development';

export const API_URL = import.meta.env.VITE_API_URL || (isDevelopment
    ? 'http://localhost:5000/api/v1'
    : 'https://api.yourdomain.com/api/v1'); // Update with real prod URL when deploying

export const BASE_URL = isDevelopment
    ? 'http://localhost:5000'
    : 'https://api.yourdomain.com';

export default {
    API_URL,
    BASE_URL
};
