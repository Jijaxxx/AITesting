const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

async function fetcher<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, ...init } = options;

  const url = new URL(`${API_BASE}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));
  }

  const response = await fetch(url.toString(), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// Profiles
export const profileApi = {
  getAll: () => fetcher<any[]>('/profiles'),
  getById: (id: string) => fetcher<any>(`/profiles/${id}`),
  create: (data: any) => fetcher<any>('/profiles', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    fetcher<any>(`/profiles/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: string) =>
    fetcher<void>(`/profiles/${id}`, { method: 'DELETE' }),
};

// Progress
export const progressApi = {
  getByProfile: (profileId: string) =>
    fetcher<any[]>('/progress', { params: { profileId } }),
  upsert: (data: any) =>
    fetcher<any>('/progress', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    fetcher<any>(`/progress/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};

// Rewards
export const rewardApi = {
  getByProfile: (profileId: string) => fetcher<any>(`/rewards/${profileId}`),
  update: (profileId: string, data: any) =>
    fetcher<any>(`/rewards/${profileId}`, { method: 'POST', body: JSON.stringify(data) }),
};

// Sync (offline → online)
export const syncApi = {
  syncQueue: (operations: any[]) =>
    fetcher<any>('/sync', { method: 'POST', body: JSON.stringify({ operations }) }),
};

// Export/Import
export const exportApi = {
  export: (profileId: string) => fetcher<any>(`/export/${profileId}`),
  import: (data: any) =>
    fetcher<any>('/import', { method: 'POST', body: JSON.stringify(data) }),
};
