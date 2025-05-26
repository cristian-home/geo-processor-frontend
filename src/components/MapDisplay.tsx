'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { GeoPoint, ProcessedPoints } from '@/types';

// Import Leaflet CSS and custom styles
import 'leaflet/dist/leaflet.css';
import './MapDisplay.css';

interface MapDisplayProps {
  points: GeoPoint[];
  result: ProcessedPoints | null;
}

const MapDisplay = ({ points, result }: MapDisplayProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Fix icon issues with Leaflet in Next.js
    // This is a known workaround for Leaflet icon loading issues in Next.js
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });

    // Initialize map if it doesn't exist
    if (!mapRef.current && mapContainerRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([0, 0], 2);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
    }

    const map = mapRef.current;
    if (!map) return;
    
    // Clear old layers
    map.eachLayer(layer => {
      if (layer instanceof L.TileLayer) return; // Keep the base tile layer
      map.removeLayer(layer);
    });

    // If we have points, add them to the map
    if (points.length > 0) {
      // Add markers for each point with advanced tooltips
      points.forEach((point, index) => {
        const marker = L.marker([point.lat, point.lng]).addTo(map);
        
        // Create a popup with formatted content
        const popupContent = `
          <div class="map-tooltip">
            <div class="font-bold mb-1">Point ${index + 1}</div>
            <div class="grid grid-cols-2 gap-x-2">
              <div>Latitude:</div>
              <div class="font-mono">${point.lat.toFixed(6)}</div>
              <div>Longitude:</div>
              <div class="font-mono">${point.lng.toFixed(6)}</div>
            </div>
          </div>
        `;
        
        marker.bindPopup(popupContent);
        
        // Add a tooltip that shows immediately on hover
        marker.bindTooltip(`Point ${index + 1}`, {
          direction: 'top',
          permanent: false,
          opacity: 0.7,
        });
      });

      // Create a bounds object from all points
      const bounds = L.latLngBounds(points.map(p => [p.lat, p.lng]));
      map.fitBounds(bounds.pad(0.1)); // Add some padding
    }

    // If we have results, display the centroid and bounding box
    if (result) {
      // Add centroid marker with custom icon and pulse animation
      const centroidIcon = L.divIcon({
        html: `
          <div style="position: relative;">
            <div style="background-color: #ff4500; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; z-index: 10; position: relative;"></div>
            <div style="position: absolute; top: -10px; left: -10px; width: 32px; height: 32px; border-radius: 50%; background: rgba(255, 69, 0, 0.3); animation: pulse 2s infinite; z-index: 5;"></div>
          </div>
          <style>
            @keyframes pulse {
              0% { transform: scale(0.5); opacity: 1; }
              100% { transform: scale(1.5); opacity: 0; }
            }
          </style>
        `,
        className: 'centroid-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      
      // Enhanced popup for the centroid
      const centroidPopupContent = `
        <div class="map-tooltip">
          <div class="font-bold mb-2 text-center">Centroid Point</div>
          <div class="grid grid-cols-2 gap-x-2">
            <div>Latitude:</div>
            <div class="font-mono">${result.centroid.lat.toFixed(6)}</div>
            <div>Longitude:</div>
            <div class="font-mono">${result.centroid.lng.toFixed(6)}</div>
          </div>
        </div>
      `;
      
      const centroidMarker = L.marker([result.centroid.lat, result.centroid.lng], { icon: centroidIcon })
        .addTo(map)
        .bindPopup(centroidPopupContent);
        
      // Add a permanent tooltip for the centroid
      centroidMarker.bindTooltip("Centroid", {
        permanent: true,
        direction: 'bottom',
        className: 'centroid-tooltip',
        offset: [0, 10]
      });
      
      // Draw the bounding box
      L.rectangle([
        [result.bounds.north, result.bounds.west], // NW
        [result.bounds.south, result.bounds.east]  // SE
      ], {
        color: '#3388ff',
        weight: 2,
        fillOpacity: 0.1
      }).addTo(map);
      
      // Create bounds from the result bounds
      const resultBounds = L.latLngBounds(
        [result.bounds.north, result.bounds.west],
        [result.bounds.south, result.bounds.east]
      );
      map.fitBounds(resultBounds.pad(0.1));
    }

    // Clean up function
    return () => {
      // No need to destroy the map on each render
    };
  }, [points, result]); // Re-run when points or result change

  return (
    <div className="shadow-lg">
      <div ref={mapContainerRef} className="map-container" />
    </div>
  );
};

export default MapDisplay;
