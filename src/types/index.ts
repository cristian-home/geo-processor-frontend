// Define types for our geo-processor application

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface ProcessedPoints {
  centroid: GeoPoint;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

export interface GeoPointsRequest {
  points: GeoPoint[];
}

export interface ApiError {
  message: string;
  status: number;
}
