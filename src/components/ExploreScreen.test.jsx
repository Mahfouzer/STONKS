// src/components/ExploreScreen.test.jsx
import React from 'react'; // Add this line
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { ExploreScreen } from './ExploreScreen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getStocks } from '../services/api';

// Mock the API calls
vi.mock('../services/api', () => ({
  getStocks: vi.fn()
}));

// Mock the debounce function
vi.mock('lodash/debounce', () => ({
  default: (fn) => fn
}));

describe('ExploreScreen', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const mockStocksData = {
    results: [
      {
        ticker: 'AAPL',
        name: 'Apple Inc',
        market: 'stocks',
        locale: 'us',
        primary_exchange: 'NASDAQ',
        type: 'CS',
        active: true,
        currency_name: 'usd',
        last_updated_utc: '2024-01-15'
      }
    ],
    status: 'OK',
    request_id: '123',
    count: 1,
    next_url: null
  };

  beforeEach(() => {
    getStocks.mockReset();
    getStocks.mockResolvedValue(mockStocksData);
  });



  it('handles search input and fetches stocks', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ExploreScreen />
      </QueryClientProvider>
    );

    const searchInput = screen.getByPlaceholderText('Search stocks...');
    fireEvent.change(searchInput, { target: { value: 'AAPL' } });

    await waitFor(() => {
      expect(getStocks).toHaveBeenCalledWith('AAPL', '');
    });
  });

  it('displays error message when API fails', async () => {
    getStocks.mockRejectedValueOnce(new Error('API rate limit exceeded'));

    render(
      <QueryClientProvider client={queryClient}>
        <ExploreScreen />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/We're fetching too many results/)).toBeInTheDocument();
    });
  });

  it('displays loading state', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ExploreScreen />
      </QueryClientProvider>
    );

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});