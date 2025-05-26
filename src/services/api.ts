"use client";

import { GeoPoint, GeoPointsRequest, ProcessedPoints } from "@/types";
import { processMockPoints } from "./mock";
import { API_CONFIG, getApiUrl } from "@/config/api";

export async function processPoints(
  points: GeoPoint[]
): Promise<ProcessedPoints> {
  try {
    const response = await fetch(
      getApiUrl(API_CONFIG.ENDPOINTS.PROCESS_POINTS),
      {
        method: "POST",
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify({ points } as GeoPointsRequest),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to process points");
    }

    return await response.json();
  } catch (error) {
    console.error("Error processing points:", error);

    // If we're in development mode, use the mock service as fallback
    if (process.env.NODE_ENV === "development") {
      console.warn("Falling back to mock implementation");
      return processMockPoints(points);
    }

    throw error;
  }
}
