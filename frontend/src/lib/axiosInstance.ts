import axios from 'axios';

// Buat axios instance
const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    withCredentials: true, // Penting untuk mengirim cookies
});

// Request interceptor untuk menambahkan token
axiosInstance.interceptors.request.use(
    (config) => {
        // Ambil token dari localStorage atau cookie
        const token = localStorage.getItem('token') || getCookie('token');
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor untuk handle error
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token expired atau invalid
            localStorage.removeItem('token');
            window.location.href = '/auth/login';
        } else if (error.response?.status === 403) {
            // User tidak punya permission
            alert('Anda tidak memiliki akses ke halaman ini');
            window.location.href = '/';
        }
        
        return Promise.reject(error);
    }
);

// Helper function untuk get cookie
function getCookie(name: string) {
    if (typeof document !== 'undefined') {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
    }
    return null;
}

export default axiosInstance;