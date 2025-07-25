import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://inventory-management-backend-j0w6.onrender.com/api/v1',
    withCredentials: true,
});

// Use "export default" here
export default apiClient;