import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const shortenUrl = async (longUrl, customAlias = null, expiresAt = null) => {
  try {
    const response = await api.post('/api/shorten', {
      longUrl,
      customAlias,
      expiresAt,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to shorten URL' };
  }
};

export const getTopLinks = async () => {
  try {
    const response = await api.get('/api/analytics/top-links');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch top links' };
  }
};

export const getDailyClicks = async () => {
  try {
    const response = await api.get('/api/analytics/daily-clicks');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch daily clicks' };
  }
};

export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to check server health' };
  }
};

export default api;

