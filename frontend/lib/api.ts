export interface ApiError {
  message: string;
  status?: number;
}

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/v1`;

export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const getRefreshToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refreshToken');
  }
  return null;
};

export const setAuthTokens = (token: string, refreshToken: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
  }
};

export const clearAuthTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
};

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
};

export const fetchApi = async <T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);

  if (response.status === 401) {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearAuthTokens();
      window.location.href = '/login';
      throw new Error('No refresh token available');
    }

    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (!refreshResponse.ok) {
          throw new Error('Refresh failed');
        }

        const data = await refreshResponse.json();
        setAuthTokens(data.token, data.refreshToken);
        isRefreshing = false;
        onRefreshed(data.token);
      } catch (error) {
        isRefreshing = false;
        clearAuthTokens();
        window.location.href = '/login';
        throw error;
      }
    }

    // Esperar a que el token se refresque para reintentar
    return new Promise((resolve) => {
      subscribeTokenRefresh((newToken: string) => {
        headers.set('Authorization', `Bearer ${newToken}`);
        config.headers = headers;
        resolve(fetch(url, config).then(res => res.json()));
      });
    });
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw { message: errorData?.message || 'Error en la petición', status: response.status } as ApiError;
  }

  // Algunos endpoints pueden devolver 204 No Content
  if (response.status === 204) {
    return null as unknown as T;
  }

  return response.json();
};
