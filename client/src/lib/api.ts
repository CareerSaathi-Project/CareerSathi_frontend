const BASE_URL = "https://careersathi-rm5f.onrender.com";

export function getAuthToken() {
  const storage = localStorage.getItem("auth-storage");
  if (!storage) return null;

  const parsed = JSON.parse(storage);
  return parsed?.state?.token || null;
}

async function request(
  method: string,
  endpoint: string,
  body?: any
) {
  const token = getAuthToken();

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.detail || "Request failed");
  }

  return res.json();
}

export const api = {
  register: (data: any) =>
    request("POST", "/auth/register", data),

  login: (data: any) =>
    request("POST", "/auth/login", data),

  evaluateInterview: (data: any) =>
    request("POST", "/interview/evaluate", data),

  getHistory: () =>
    request("GET", "/interview/history"),

  getAnalytics: () =>
    request("GET", "/interview/analytics"),
};
