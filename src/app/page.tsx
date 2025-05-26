'use client';

import { useState } from 'react';
import { GeoPoint, ProcessedPoints } from '@/types';
import { processPoints } from '@/services/api';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import PointsForm from '@/components/PointsForm';
import ResultDisplay from '@/components/ResultDisplay';

// Import the MapDisplay component dynamically to avoid SSR issues with Leaflet
const MapDisplay = dynamic(() => import('@/components/MapDisplay'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] flex items-center justify-center bg-base-200 rounded-lg">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  ),
});

export default function Home() {
  const [points, setPoints] = useState<GeoPoint[]>([]);
  const [result, setResult] = useState<ProcessedPoints | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (inputPoints: GeoPoint[]) => {
    setPoints(inputPoints);
    setIsLoading(true);
    setError(null);

    try {
      const data = await processPoints(inputPoints);
      setResult(data);
    } catch (err) {
      setError((err as Error).message || 'An error occurred while processing points');
      console.error('Error processing points:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <Image src="/geo-logo.svg" alt="Geo-Processor Logo" width={100} height={100} />
          </div>
          <h1 className="text-3xl font-bold mb-2">Geo-Processor</h1>
          <p className="text-lg text-slate-600">
            Process geographic coordinates to find the centroid and bounding box
          </p>
        </header>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-8">
        <PointsForm onSubmit={handleSubmit} isLoading={isLoading} />
        
        <div>
          {error ? (
            <div className="alert alert-error">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          ) : (
            <ResultDisplay result={result} />
          )}
        </div>
      </div>

      {points.length > 0 && (
        <div className="card w-full bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h2 className="card-title">Map Visualization</h2>
            <MapDisplay points={points} result={result} />
          </div>
        </div>
      )}

      <footer className="text-center mt-16 text-sm text-slate-500">
        <p>Geo-Processor Frontend - Built with Next.js and DaisyUI</p>
      </footer>
      </div>
    </>
  );
}
