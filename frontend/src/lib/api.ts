import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const investigationApi = {
  list: async () => {
    const response = await client.get('/api/investigations');
    return response.data;
  },

  create: async (data: any) => {
    const response = await client.post('/api/investigations', data);
    return response.data;
  },

  getInvestigation: async (id: string) => {
    const response = await client.get(`/api/investigations/${id}`);
    return response.data;
  },

  start: async (id: string) => {
    const response = await client.post(`/api/investigations/${id}/start`);
    return response.data;
  },

  getReport: async (id: string) => {
    const response = await client.get(`/api/reports/${id}`);
    return response.data;
  },

  getAgents: async (id: string) => {
    const response = await client.get(`/api/investigations/${id}/agents`);
    return response.data;
  },

  getTimeline: async (id: string) => {
    const response = await client.get(`/api/investigations/${id}/timeline`);
    return response.data;
  },

  getContext: async (id: string) => {
    const response = await client.get(`/api/investigations/${id}/context`);
    return response.data;
  },
};
