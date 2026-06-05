// src/services/apiClient.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const apiClient = async (endpoint: string, options: any = {}) => {
  const token = localStorage.getItem("tracesync_token");
  const headers = {
    "Content-Type": "application/json",
    "bypass-tunnel-reminder": "true",
    ...options.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) throw new Error("Error en la petición");
  return response.json();
};

/*// src/services/apiClient.ts con generics
export const apiClient = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const token = localStorage.getItem("tracesync_token");
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
    ...(token && { "Authorization": `Bearer ${token}` })
  };

  const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Error en la petición");
  }

  return response.json() as Promise<T>;
};

// Uso en tus servicios:
// const data = await apiClient<UserSession>('/api/operators/verify', { method: 'POST', body: ... });*/
