import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://inventory-management-backend-gmik.onrender.com/api/v1',
    withCredentials: true,
});

export default apiClient;