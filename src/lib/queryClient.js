import { QueryClient } from "@tanstack/react-query";

// ✅ Backend base URL (from Vercel env)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Safely parse any response body (JSON or plain text)
async function parseBody(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// Prevent crashes from circular JSON or very large errors
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

// ✅ Used by mutations (POST, DELETE, PATCH, etc.)
export async function apiRequest(method, url, data) {
  const token = localStorage.getItem("accessToken");
  const headers = {};

  if (data) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${url}`, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  await throwIfResNotOk(res);
  return parseBody(res);
}

// ✅ Used by React Query for GET requests
export const getQueryFn =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const token = localStorage.getItem("accessToken");
    const headers = {};

    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}${queryKey.join("/")}`, {
      headers,
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return parseBody(res);
  };

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
