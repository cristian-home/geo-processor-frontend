'use client';

import { ProcessedPoints } from '@/types';

interface ResultDisplayProps {
  result: ProcessedPoints | null;
}

export default function ResultDisplay({ result }: ResultDisplayProps) {
  if (!result) return null;

  return (
    <div className="card w-full bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Results</h2>
        
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Property</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Centroid</td>
                <td className="font-mono">
                  Lat: {result.centroid.lat.toFixed(4)}, Lng: {result.centroid.lng.toFixed(4)}
                </td>
              </tr>
              <tr>
                <td>North Bound</td>
                <td className="font-mono">{result.bounds.north.toFixed(4)}</td>
              </tr>
              <tr>
                <td>South Bound</td>
                <td className="font-mono">{result.bounds.south.toFixed(4)}</td>
              </tr>
              <tr>
                <td>East Bound</td>
                <td className="font-mono">{result.bounds.east.toFixed(4)}</td>
              </tr>
              <tr>
                <td>West Bound</td>
                <td className="font-mono">{result.bounds.west.toFixed(4)}</td>
              </tr>
              <tr>
                <td>Bounding Box Size</td>
                <td className="font-mono">
                  {(result.bounds.north - result.bounds.south).toFixed(4)}° × {Math.abs(result.bounds.east - result.bounds.west).toFixed(4)}°
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
