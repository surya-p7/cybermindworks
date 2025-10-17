import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

// Create axios instance
const api = axios.create({
  baseURL: BACKEND_URL,
});

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors (token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;

// API methods
export const jobsAPI = {
  getAll: () => api.get('/jobs'),
  getOne: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.patch(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
  getMyJobs: () => api.get('/jobs/my-jobs'),
};

export const applicationsAPI = {
  apply: (data) => api.post('/applications', data),
  getMyApplications: () => api.get('/applications/my-applications'),
  getJobApplications: (jobId) => api.get(`/applications/job/${jobId}`),
  updateStatus: (id, status) => api.patch(`/applications/${id}/status`, { status }),
};

export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.patch('/users/profile', data),
};
