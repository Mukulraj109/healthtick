const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.com/api' 
  : 'http://localhost:5000/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(response.status, errorData.error || 'An error occurred');
  }

  // ✅ Only parse JSON if there's content
  if (response.status === 204) {
    return null; // No content
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  } else {
    return null;
  }
}

export const api = {
  clients: {
    getAll: () => fetchApi('/clients'),
  },
  
  bookings: {
    getForDate: (date: string) => fetchApi(`/bookings/${date}`),
    create: (booking: any) => fetchApi('/bookings', {
      method: 'POST',
      body: JSON.stringify(booking),
    }),
    delete: (id: string) => fetchApi(`/bookings/${id}`, {
      method: 'DELETE',
    }),
  },
};
