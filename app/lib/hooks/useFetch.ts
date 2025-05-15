import { useState, useCallback } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { useAuth } from './useAuth';

interface FetchOptions extends RequestInit {
  showError?: boolean;
}

interface FetchState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

export function useFetch<T = any>() {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    error: null,
    loading: false,
  });
  const { disconnect } = useAuth();

  const handleError = useCallback((error: unknown, showError: boolean) => {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    setState({ data: null, error: error as Error, loading: false });
    
    if (showError) {
      toast.error(errorMessage);
    }
    
    throw error;
  }, []);

  const fetchDataAuthorized = useCallback(async (url: string, options: FetchOptions = {}): Promise<T | null> => {
    const { showError = true, ...fetchOptions } = options;
    
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const authToken = Cookies.get('authToken');
      const headers = new Headers(fetchOptions.headers);

      if (!authToken) {
        Cookies.remove('authToken');
        throw new Error('No authentication token found');
      }

      headers.set('Authorization', `Bearer ${authToken}`);

      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      });

      if (response.status === 401) {
        await disconnect();
        throw new Error('Session expired. Please reconnect your wallet.');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let data: T | null = null;
      const text = await response.text();
      if (text) {
        data = JSON.parse(text) as T;
      }
      setState({ data, error: null, loading: false });
      return data;
    } catch (error) {
      return handleError(error, showError);
    }
  }, [disconnect, handleError]);

  const fetchDataUnauthorized = useCallback(async (url: string, options: FetchOptions = {}): Promise<T | null> => {
    const { showError = true, ...fetchOptions } = options;
    
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const headers = new Headers(fetchOptions.headers);

      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let data: T | null = null;
      const text = await response.text();
      if (text) {
        data = JSON.parse(text) as T;
      }
      setState({ data, error: null, loading: false });
      return data;
    } catch (error) {
      return handleError(error, showError);
    }
  }, [handleError]);

  const reset = useCallback(() => {
    setState({ data: null, error: null, loading: false });
  }, []);

  return {
    ...state,
    fetchDataAuthorized,
    fetchDataUnauthorized,
    reset,
  };
} 