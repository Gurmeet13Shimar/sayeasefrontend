import { QueryClient } from "@tanstack/react-query";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

/* ------------------ helpers ------------------ */

async function parseBody(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function safeMessage(input) {
  try {
    if (typeof input === "string") return input;
    if (input && typeof input === "object") {
      if (input.message) return input.message;
      return JSON.stringify(input);
    }
    return String(input);
  } catch {
    return "<<unserializable response body>>";
  }
}

async function throwIfResNotOk(res) {
  if (res.ok) return;

  const body = await parseBody(res);
  let msg = safeMessage(body);

  if (msg.length > 400) {
    msg = msg.slice(0, 400) + "...(truncated)";
  }

  throw new Error(`${res.status}: ${msg || res.statusText}`);
}

/* ------------------ MUTATIONS ------------------ */

export async function apiRequest(method, url, data) {
  const token = localStorage.getItem("accessToken");
  const headers = {};

  if (data) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${url}`, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return parseBody(res);
}

/* ------------------ QUERIES ------------------ */

export const getQueryFn =
  ({ on401 }) =>
  async ({ queryKey }) => {
    const token = localStorage.getItem("accessToken");
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const path = Array.isArray(queryKey) ? queryKey[0] : queryKey;

    const res = await fetch(`${API_BASE_URL}${path}`, {
      headers,
      credentials: "include",
    });

    if (on401 === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return parseBody(res);
  };

/* ------------------ QUERY CLIENT ------------------ */

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
