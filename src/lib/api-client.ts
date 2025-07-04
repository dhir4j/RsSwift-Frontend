
import { API_BASE_URL } from './constants';

async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { message: response.statusText || 'An API error occurred without a JSON body' };
    }
    console.error('API Error:', endpoint, response.status, errorData);
    const message = errorData?.error || errorData?.message || `API request failed with status ${response.status}`;
    throw { status: response.status, data: errorData, message: message };
  }

  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return undefined as T;
  }
  
  return response.json();
}

export default apiClient;
