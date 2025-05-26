'use client';

import { useState, useEffect } from 'react';
import { API_CONFIG, getApiUrl } from "@/config/api";

export default function ApiStatus() {
  const [status, setStatus] = useState<'loading' | 'online' | 'offline'>('loading');

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        // Try to fetch API health status
        const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.HEALTH_CHECK), {
          method: 'GET',
          // Set a short timeout to avoid long waits if the API is down
          signal: AbortSignal.timeout(2000) 
        });
        
        if (response.ok) {
          const data = await response.json();
          // Check if the response contains the expected health data
          const isHealthy = data.status === 'healthy' && 
                           data.services && 
                           data.services['api-gateway']?.status === 'healthy' &&
                           data.services['python-service']?.status === 'healthy';
          setStatus(isHealthy ? 'online' : 'offline');
        } else {
          setStatus('offline');
        }
      } catch (error) {
        console.error('API health check failed:', error);
        setStatus('offline');
      }
    };

    checkApiStatus();
    
    // Check every 30 seconds
    const intervalId = setInterval(checkApiStatus, 30000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  if (status === 'loading') {
    return (
      <div className="tooltip" data-tip="Checking API status...">
        <div className="badge badge-outline gap-2">
          <span className="loading loading-xs loading-spinner"></span>
          API
        </div>
      </div>
    );
  }
  
  return (
    <div className="tooltip" data-tip={status === 'online' ? 'API services are healthy' : 'API is offline or services are not healthy, using mock data'}>
      <div className={`badge ${status === 'online' ? 'badge-success' : 'badge-error'} gap-2`}>
        <div className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-success-content' : 'bg-error-content'}`}></div>
        API {status === 'online' ? 'Online' : 'Offline'}
      </div>
    </div>
  );
}
