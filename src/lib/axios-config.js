import axios from 'axios';

axios.defaults.baseURL = import.meta.env.PROD ? 'https://alas-backend-clone-q4bv.onrender.com' : 'http://localhost:3000';
axios.defaults.withCredentials = true;
axios.defaults.timeout = 10000;

axios.interceptors.request.use(
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

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.config.__isRetryRequest && error.code === 'ECONNABORTED') {
      error.config.__isRetryRequest = true;
      return axios(error.config); // retry once
    }
    return Promise.reject(error);
  }
);

export default axios;
