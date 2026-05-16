export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "API request failed");
  }

  return res.json();
}

const api = {
  get: async (endpoint: string) => {
    let token = undefined;
    if (typeof window !== "undefined" && (window as any).Clerk) {
      token = await (window as any).Clerk.session?.getToken();
    }
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const data = await fetchApi(endpoint, { method: "GET", headers });
    return { data }; // Mimic axios { data: { success, data } }
  },
  post: async (endpoint: string, body: any, options: any = {}) => {
    const data = await fetchApi(endpoint, { 
      method: "POST", 
      body: JSON.stringify(body), 
      headers: options.headers 
    });
    return { data };
  }
};

export default api;
