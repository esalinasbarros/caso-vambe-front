import axios from 'axios';
import { Client, CategorizedClient, Metrics } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const healthCheck = async () => {
    const response = await api.get('/api/health');
    return response.data;
};

export const getClients = async (): Promise<Client[]> => {
    const response = await api.get('/api/clients');
    return response.data.data;
};

export const getCategorizedClients = async (): Promise<CategorizedClient[]> => {
    const response = await api.get('/api/clients/categorized');
    return response.data.data;
};

export const getClientById = async (id: number): Promise<Client> => {
    const response = await api.get(`/api/clients/${id}`);
    return response.data.data;
};

export const getMetrics = async (month?: string | null): Promise<Metrics> => {
    const response = await api.get('/api/metrics', {
        params: month ? { month } : {}
    });
    return response.data.data;
};

export const getBasicMetrics = async (month?: string | null): Promise<Partial<Metrics>> => {
    const response = await api.get('/api/metrics/basic', {
        params: month ? { month } : {}
    });
    return response.data.data;
};

export const getAdvancedMetrics = async (forceRefresh: boolean = false, month?: string | null): Promise<{ metrics: Partial<Metrics>; categorizedClients: CategorizedClient[] }> => {
    const response = await api.get('/api/metrics/advanced', {
        params: { 
            forceRefresh,
            ...(month ? { month } : {})
        }
    });
    return response.data.data;
};

export const getCacheStatus = async (): Promise<{ total: number; cached: number; lastUpdated: string | null }> => {
    const response = await api.get('/api/clients/cache/status');
    return response.data.data;
};

export const clearCache = async (): Promise<void> => {
    await api.post('/api/clients/cache/clear');
};

export const getVendorRecommendation = async (clientDescription: string): Promise<{ industry: string; vendors: { vendedor: string; totalClients: number; closedDeals: number; conversionRate: number }[] }> => {
    const response = await api.post('/api/recommendations', {
        clientDescription
    });
    return response.data.data;
};

export default api;
