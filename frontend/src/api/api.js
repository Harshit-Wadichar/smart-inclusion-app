import axios from 'axios';


const api = axios.create({
baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
timeout: 10000,
});


export const get = async (endpoint, params = {}) => {
const res = await api.get(endpoint, { params });
return res.data;
};


export default api;