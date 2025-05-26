"use client";

import { GeoPoint, ProcessedPoints } from "@/types";

/**
 * Mock implementation of the geo-processing logic
 * This can be used for testing or when the backend service is not available
 */
export function processMockPoints(points: GeoPoint[]): ProcessedPoints {
  if (!points || points.length === 0) {
    throw new Error("No points provided");
  }

  // Find bounds
  const north = Math.max(...points.map((p) => p.lat));
  const south = Math.min(...points.map((p) => p.lat));
  const east = Math.max(...points.map((p) => p.lng));
  const west = Math.min(...points.map((p) => p.lng));

  // Calculate centroid
  const centroidLat = points.reduce((sum, p) => sum + p.lat, 0) / points.length;
  const centroidLng = points.reduce((sum, p) => sum + p.lng, 0) / points.length;

  return {
    centroid: {
      lat: centroidLat,
      lng: centroidLng,
    },
    bounds: {
      north,
      south,
      east,
      west,
    },
  };
}
