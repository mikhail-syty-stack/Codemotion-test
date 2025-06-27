import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true
});

// Add a request interceptor for handling tokens
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

// Auth API
export const authAPI = {
    login: async (email: string, password: string) => {
        const response = await api.post('/api/login', { email, password });
        return response.data;
    },

    register: async (email: string, password: string) => {
        const response = await api.post('/api/register', { email, password });
        return response.data;
    },

    logout: async () => {
        const response = await api.post('/api/logout');
        return response.data;
    },

    getUser: async () => {
        const response = await api.get('/api/me');
        return response.data;
    },

    getBalance: async () => {
        const response = await api.get('/api/balance');
        return response.data;
    },

    addFunds: async (amount: number) => {
        const response = await api.post('/api/balance/add', { amount });
        return response.data;
    },

    withdrawFunds: async (amount: number) => {
        const response = await api.post('/api/balance/withdraw', { amount });
        return response.data;
    }
};

// Items API
export const itemsAPI = {
    getMyItems: async (params?: { is_listed?: boolean }) => {
        const response = await api.get('/api/items/my', { params });
        return response.data;
    },

    getAllItems: async (params?: { owner_id?: number, creator_id?: number, is_listed?: boolean }) => {
        const response = await api.get('/api/items', { params });
        return response.data;
    },

    createItem: async (data: {
        title: string;
        image_url: string;
        price: number;
        is_listed?: boolean;
        metadata?: Record<string, unknown>;
    }) => {
        const response = await api.post('/api/items', data);
        return response.data.data ? response.data.data : response.data;
    },

    updateItem: async (id: number, data: {
        title?: string;
        image_url?: string;
        price?: number;
        is_listed?: boolean;
        metadata?: Record<string, unknown>;
    }) => {
        const response = await api.put(`/api/items/${id}`, data);
        return response.data.data ? response.data.data : response.data;
    },

    deleteItem: async (id: number) => {
        await api.delete(`/api/items/${id}`);
    }
};

// Offers API
export const offersAPI = {
    getOffers: async (params?: { role?: 'buyer' | 'seller'; status?: string }) => {
        const response = await api.get('/api/offers', { params });
        return response.data;
    },

    createOffer: async (data: {
        item_id: number;
        price: number;
    }) => {
        const response = await api.post('/api/offers', data);
        return response.data;
    },

    getOffer: async (id: number) => {
        const response = await api.get(`/api/offers/${id}`);
        return response.data;
    },

    acceptOffer: async (id: number) => {
        const response = await api.post(`/api/offers/${id}/accept`);
        return response.data;
    },

    declineOffer: async (id: number) => {
        const response = await api.post(`/api/offers/${id}/decline`);
        return response.data;
    },

    cancelOffer: async (id: number) => {
        await api.delete(`/api/offers/${id}`);
    }
};

// Transactions API
export const transactionsAPI = {
    getTransactions: async (params?: { role?: 'buyer' | 'seller' }) => {
        const response = await api.get('/api/transactions', { params });
        return response.data;
    },

    getTransaction: async (id: number) => {
        const response = await api.get(`/api/transactions/${id}`);
        return response.data;
    }
};

export default api; 