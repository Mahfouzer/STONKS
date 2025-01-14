import React, { useCallback, useEffect, useRef } from 'react';
import { QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query';
import { getStocks } from '../services/api';
import { useStocksStore } from '../store/stocksStore';
import debounce from 'lodash/debounce';
import { PaginatedStocksResponse, StocksResponse } from '../types/stock';
import StockCard from './Crad';
import LoadingSpinner from './Loading';

export const ExploreScreen: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const { stocks, setStocks, setNextUrl } = useStocksStore();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    error,
    isError
  } = useInfiniteQuery<
  StocksResponse,    // Type of each page of data
  Error,        // Type for the error
  PaginatedStocksResponse    // Type for the overall data structure
>({
    queryKey: ['stocks', searchTerm],
    queryFn: async ({ pageParam }: QueryFunctionContext) => {
      const response = await getStocks(searchTerm, pageParam as string); // Ensure pageParam is treated as string
      return response;
    },
    getNextPageParam: (lastPage) => lastPage.next_url,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    retry: 1, // Only retry once to avoid rate limit issues
    retryDelay: 5000, // Wait 5 seconds before retrying
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    initialPageParam:''
  });

  useEffect(() => {
    if (data?.pages) {
      const allStocks = data.pages.flatMap(page => page.results);
      setStocks(allStocks);
      setNextUrl(data.pages[data.pages.length - 1].next_url);
    }
  }, [data, setStocks, setNextUrl]);

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setSearchTerm(term);
    }, 1000), // Increased debounce time to 1 second
    []
  );

  const observer = useRef<IntersectionObserver>();
  const lastStockRef = useCallback((node: HTMLDivElement) => {
    if (isLoading || isFetchingNextPage) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    if (node) observer.current.observe(node);
  }, [isLoading, hasNextPage, fetchNextPage, isFetchingNextPage]);

  const getErrorMessage = (error: any) => {
    if (error?.message?.includes('rate limit')) {
      return 'We\'re fetching too many results. Please wait a moment before loading more.';
    }
    if (error?.message?.includes('API key')) {
      return 'API key invalid or expired. Please check your configuration.';
    }
    return 'Error loading stocks. Please try again later.';
  };

  return (
    <div className="min-h-screen bg-yellow-50 p-4">
      <div className="max-w-6xl mx-auto">
      <h1 className='text-bold text-4xl mb-3'> 📈 Nader Mahfouz <span className='text-green-600'>Stonks</span> <span className='text-xs text-purple-500'>(feat AI✨)</span></h1>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search stocks..."
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={(e) => debouncedSearch(e.target.value)}
          />
          <p className="text-sm text-gray-500 mt-2">
            Type to search. Results will update after 1 second of inactivity.
          </p>
        </div>

        {isError ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {getErrorMessage(error)}
          </div>
        ) : null}

        {isLoading ? (
          <LoadingSpinner/>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stocks.length === 0 && !isLoading ? (
              <div className="col-span-full p-4 text-center text-red-700 bg-white rounded-lg shadow text-bold">
                No stocks found
              </div>
            ) : (
              stocks.map((stock, index) => (
                <StockCard
                  key={`${stock.ticker}-${index}`}
                  stock={stock}
                  index={index}
                  lastStockRef={lastStockRef}
                />
              ))
            )}
          </div>
        )}

        {isFetchingNextPage && (
          <LoadingSpinner message='Loading more...'/>
        )}
      </div>
    </div>
  );
};