import React, { forwardRef } from 'react';
import { Stock } from '../types/stock';  // Assuming Stock type is defined in your types

interface StockCardProps {
  stock: Stock;
  index: number;
  lastStockRef: React.RefCallback<HTMLDivElement>;
}

const StockCard = forwardRef<HTMLDivElement, StockCardProps>(({ stock, index, lastStockRef }, ref) => {
  return (
    <div
      key={`${stock.ticker}-${index}`}
      ref={index === 0 ? lastStockRef : null} // Forward the ref to the last stock
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold text-blue-600">{stock.ticker}</div>
          <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {stock.locale}
          </div>
        </div>
        <h3 className="text-lg text-gray-800 font-medium mb-2">{stock.name}</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-gray-600">Exchange:</div>
          <div className="text-gray-800">{stock.primary_exchange}</div>
          <div className="text-gray-600">Currency:</div>
          <div className="text-gray-800">{stock.currency_name}</div>
          <div className="text-gray-600">Type:</div>
          <div className="text-gray-800">{stock.type}</div>
        </div>
      </div>
    </div>
  );
});

StockCard.displayName = 'StockCard';

export default StockCard;
