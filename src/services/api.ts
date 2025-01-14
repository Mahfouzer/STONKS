import axios from 'axios';
import { StocksResponse } from '../types/stock';

const API_KEY = import.meta.env.VITE_POLYGON_API_KEY;
const BASE_URL = 'https://api.polygon.io/v3';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Simple request queue implementation
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 12000; // 12 seconds between requests for free tier (5 requests per minute)

const waitForNextRequest = async () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => 
      setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
    );
  }
  lastRequestTime = Date.now();
};

export const getStocks = async (search?: string, nextUrl?: string): Promise<StocksResponse> => {
  try {
    await waitForNextRequest();

    if (nextUrl) {
      const response = await axios.get<StocksResponse>(nextUrl, {
        params: {
          apiKey: API_KEY,
        }
      });
      return response.data;
    }

    const response = await api.get<StocksResponse>('/reference/tickers', {
      params: {
        apiKey: API_KEY,
        market: 'stocks',
        active: true,
        sort: 'ticker',
        order: 'asc',
        limit: 50, // Increased limit to reduce number of requests needed
        search,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data);
      if (error.response?.status === 429) {
        throw new Error('API rate limit exceeded. Please wait a moment.');
      }
      if (error.response?.status === 403) {
        throw new Error('Invalid API key. Please check your configuration.');
      }
    }
    throw error;
  }
};