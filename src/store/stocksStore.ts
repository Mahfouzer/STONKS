import { create } from 'zustand';
import { Stock } from '../types/stock';

interface StocksState {
  stocks: Stock[];
  nextUrl: string | undefined;
  setStocks: (stocks: Stock[]) => void;
  appendStocks: (stocks: Stock[]) => void;
  setNextUrl: (url: string | undefined) => void;
}

export const useStocksStore = create<StocksState>((set) => ({
  stocks: [],
  nextUrl: undefined,
  setStocks: (stocks) => set({ stocks }),
  appendStocks: (newStocks) => 
    set((state) => ({ stocks: [...state.stocks, ...newStocks] })),
  setNextUrl: (nextUrl) => set({ nextUrl }),
}));