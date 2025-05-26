'use client';

import { useState } from 'react';
import { GeoPoint } from '@/types';

interface PointsFormProps {
  onSubmit: (points: GeoPoint[]) => void;
  isLoading: boolean;
}

export default function PointsForm({ onSubmit, isLoading }: PointsFormProps) {
  const [pointsText, setPointsText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const parsedPoints = parsePointsInput(pointsText);
      
      if (parsedPoints.length === 0) {
        setError('Please enter at least one valid coordinate pair');
        return;
      }
      
      onSubmit(parsedPoints);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const parsePointsInput = (input: string): GeoPoint[] => {
    // Handle different input formats
    // Split by newlines to get each coordinate pair
    const lines = input
      .split(/\n/)
      .map(line => line.trim())
      .filter(line => line); // Remove empty lines

    const points: GeoPoint[] = [];

    for (const line of lines) {
      // Try multiple regex patterns to handle different formats
      
      // Format: "lat, lng" or "lat lng"
      const standardFormat = line.match(/(-?\d+\.?\d*)\s*[,\s]\s*(-?\d+\.?\d*)/);
      
      // Format: "lat°N/S, lng°E/W" or similar with degree symbols
      const degreeFormat = line.match(/(-?\d+\.?\d*)\s*°?\s*([NSns])?\s*[,\s]\s*(-?\d+\.?\d*)\s*°?\s*([EWew])?/);
      
      // Format: "lng, lat" (reversed order - GeoJSON style)
      const reversedFormat = line.match(/(-?\d+\.?\d*)\s*[,\s]\s*(-?\d+\.?\d*)/);
      
      let lat, lng;
      
      if (standardFormat && standardFormat.length === 3) {
        lat = parseFloat(standardFormat[1]);
        lng = parseFloat(standardFormat[2]);
      } else if (degreeFormat && degreeFormat.length >= 3) {
        lat = parseFloat(degreeFormat[1]);
        // Apply S/s for southern hemisphere (negative latitude)
        if (degreeFormat[2] && degreeFormat[2].toUpperCase() === 'S') {
          lat = -Math.abs(lat);
        }
        
        lng = parseFloat(degreeFormat[3]);
        // Apply W/w for western hemisphere (negative longitude)
        if (degreeFormat[4] && degreeFormat[4].toUpperCase() === 'W') {
          lng = -Math.abs(lng);
        }
      } else if (reversedFormat && reversedFormat.length === 3) {
        // Assume it might be lng,lat format if the first value looks like a longitude
        const first = parseFloat(reversedFormat[1]);
        const second = parseFloat(reversedFormat[2]);
        
        // If first number looks like longitude and second like latitude
        if (Math.abs(first) > 90 && Math.abs(second) <= 90) {
          lng = first;
          lat = second;
        } else {
          lat = first;
          lng = second;
        }
      } else {
        throw new Error(`Could not parse coordinates: ${line}`);
      }
      
      // Validate lat/lng values
      if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        throw new Error(`Invalid coordinates: ${line} (lat=${lat}, lng=${lng})`);
      }
      
      points.push({ lat, lng });
    }

    return points;
  };

  const handleLoadSample = (sampleType: string = 'us-cities') => {
    let samplePoints = '';
    
    switch (sampleType) {
      case 'us-cities':
        samplePoints = `40.7128, -74.0060 // New York
34.0522, -118.2437 // Los Angeles
41.8781, -87.6298 // Chicago
29.7604, -95.3698 // Houston
39.9526, -75.1652 // Philadelphia`;
        break;
      case 'european-capitals':
        samplePoints = `51.5074, -0.1278 // London
48.8566, 2.3522 // Paris
52.5200, 13.4050 // Berlin
41.9028, 12.4964 // Rome
40.4168, -3.7038 // Madrid`;
        break;
      case 'world-landmarks':
        samplePoints = `27.1751, 78.0421 // Taj Mahal
-13.1631, -72.5450 // Machu Picchu
30.3285, 35.4444 // Petra
-33.8568, 151.2153 // Sydney Opera House
40.4319, 116.5704 // Great Wall of China`;
        break;
      default:
        samplePoints = `40.7128, -74.0060\n34.0522, -118.2437\n41.8781, -87.6298\n29.7604, -95.3698\n39.9526, -75.1652`;
    }
    
    setPointsText(samplePoints);
  };

  return (
    <div className="card w-full bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Enter Coordinates</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-control flex flex-col gap-2">
            <label className="label">
              <span className="label-text">Latitude, Longitude pairs (one per line)</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-32 font-mono w-full"
              placeholder="40.7128, -74.0060&#10;34.0522, -118.2437&#10;..."
              value={pointsText}
              onChange={e => setPointsText(e.target.value)}
              disabled={isLoading}
            />
            <label className="label">
              <span className="label-text-alt">Format: lat, lng (e.g., 40.7128, -74.0060)</span>
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className={`label-text-alt link ${isLoading ? 'text-gray-400' : 'link-primary'}`}>
                  Load sample data
                </div>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li><a onClick={() => handleLoadSample('us-cities')}>US Cities</a></li>
                  <li><a onClick={() => handleLoadSample('european-capitals')}>European Capitals</a></li>
                  <li><a onClick={() => handleLoadSample('world-landmarks')}>World Landmarks</a></li>
                </ul>
              </div>
            </label>
          </div>

          {error && (
            <div className="alert alert-error mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="card-actions justify-end mt-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Processing...
                </>
              ) : (
                'Process Points'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
