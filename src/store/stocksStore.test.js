// src/store/stocksStore.test.js
import { describe, it, expect } from 'vitest';
import { useStocksStore } from './stocksStore';

describe('stocksStore', () => {
  it('should set stocks', () => {
    const store = useStocksStore.getState();
    const mockStocks = [
      {
        ticker: 'AAPL',
        name: 'Apple Inc',
        market: 'stocks',
      }
    ];

    store.setStocks(mockStocks);
    expect(useStocksStore.getState().stocks).toEqual(mockStocks);
  });

  it('should append stocks', () => {
    const store = useStocksStore.getState();
    const initialStocks = [{ ticker: 'AAPL' }];
    const newStocks = [{ ticker: 'GOOGL' }];

    store.setStocks(initialStocks);
    store.appendStocks(newStocks);

    expect(useStocksStore.getState().stocks).toHaveLength(2);
    expect(useStocksStore.getState().stocks).toEqual([...initialStocks, ...newStocks]);
  });

  it('should set next URL', () => {
    const store = useStocksStore.getState();
    const mockUrl = 'https://api.example.com/next';

    store.setNextUrl(mockUrl);
    expect(useStocksStore.getState().nextUrl).toBe(mockUrl);
  });
});