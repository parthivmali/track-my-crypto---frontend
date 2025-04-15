import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ChartSection from '../components/ChartSection';

interface HistoricalPrice {
  time: string;
  price: number;
}

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  volume: number;
  imageUrl: string;
  marketCap: number;
  change24h: number;
  historicalPrices?: HistoricalPrice[];
}

const CryptoDetails = () => {
  const { symbol } = useParams();
  const [crypto, setCrypto] = useState<CryptoData | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('cryptoData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const found = parsedData.find((c: CryptoData) => c.symbol === symbol);

      if (found) {
        // Add fake history if not present
        if (!found.historicalPrices) {
          const basePrice = found.price;
          const history: HistoricalPrice[] = [];

          for (let i = 0; i < 24; i++) {
            const time = new Date(Date.now() - i * 3600000).toISOString();
            const price = parseFloat((basePrice + (Math.random() - 0.5) * 0.1).toFixed(3));
            history.unshift({ time, price });
          }

          found.historicalPrices = history;
        }
        setCrypto(found);
      }
    }
  }, [symbol]);

  if (!crypto) return <div className="text-white text-center pt-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white pt-20 px-6 lg:px-20">
      <h1 className="text-3xl font-bold mb-6">{crypto.name}</h1>

      <div className="bg-gray-900 rounded-lg p-6 mb-8">
        <p className="text-lg"><strong>Price:</strong> ${crypto.price.toFixed(2)}</p>
        <p className="text-lg"><strong>24h Change:</strong> {crypto.change24h}%</p>
        <p className="text-lg"><strong>Market Cap:</strong> ${crypto.marketCap.toLocaleString()}</p>
        <p className="text-lg"><strong>Volume (24h):</strong> ${crypto.volume.toLocaleString()}</p>
      </div>

      <div className="mb-10">
        <ChartSection
          name={crypto.name}
          historicalPrices={crypto.historicalPrices!.map(h => [new Date(h.time).getTime(), h.price])}
        />
      </div>
    </div>
  );
};

export default CryptoDetails;
