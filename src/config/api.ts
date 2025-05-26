/**
 * API Configuration
 * Centralizes API endpoints and configuration
 */

export const API_CONFIG = {
  BASE_URL: process.env.NEST_PUBLIC_API_BASE_URL || "http://localhost:3000",
  ENDPOINTS: {
    PROCESS_POINTS: "/api/geo/process-points",
    HEALTH_CHECK: "/api/health",
  },
  HEADERS: {
    "Content-Type": "application/json",
  },
} as const;

/**
 * Get full API endpoint URL
 */
export function getApiUrl(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}
