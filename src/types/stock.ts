export interface Stock {
  ticker: string;
  name: string;
  market: string;
  locale: string;
  primary_exchange: string;
  type: string;
  active: boolean;
  currency_name: string;
  last_updated_utc: string;
}

export interface StocksResponse {
  results: Stock[];
  status: string;
  request_id: string;
  count: number;
  next_url?: string; // This is the pagination URL for the next page
}

// This is the type returned by useInfiniteQuery
export interface PaginatedStocksResponse {
  pages: StocksResponse[]; // An array of Stock pages (one for each page)
  next_url?: string; // The next page URL
}
