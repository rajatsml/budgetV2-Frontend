import axios, {
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  AxiosHeaders,
} from "axios";

// Create an Axios instance to apply global interceptors
const api = axios.create();

// Helper to detect login endpoint (case-insensitive)
const isLoginEndpoint = (url?: string | null) => {
  if (!url) return false;
  const u = url.toLowerCase();
  // Matches common login endpoints. Adjust if your login path differs.
  return (
    u.includes("/api/auth/login") ||
    u.includes("/api/login") ||
    u.includes("/api/authenticate") ||
    u.includes("/api/login")
  );
};

// Request interceptor: add auth header for all requests except login
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
      if (isLoginEndpoint(config.url || config.baseURL || "")) return config;

      const stored = localStorage.getItem("capex_auth");
      if (stored) {
        const parsed = JSON.parse(stored as string) as any;
        if (parsed && parsed.token) {
          const headers = AxiosHeaders.from(config.headers || {});
          headers.set(
            "Authorization",
            `${parsed.tokenType || "Bearer"} ${parsed.token}`,
          );
          config.headers = headers;
        }
      }
    } catch (e) {
      // Swallow any errors reading storage so requests still proceed
      // eslint-disable-next-line no-console
      console.warn("Failed to attach auth header", e);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: global handling except for login responses
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // If the request was to login endpoint, just return the response
    if (isLoginEndpoint(response.config?.url || "")) return response;

    // Normal response passthrough (add global handling here if needed)
    return response;
  },
  (error) => {
    // If the failed request was to login endpoint, do not apply global error handling
    const config = error?.config as AxiosRequestConfig | undefined;
    if (config && isLoginEndpoint(config.url || "")) {
      return Promise.reject(error);
    }

    // Global error handling can be added here (e.g., redirect on 401)
    // Example: clear stored auth on 401
    try {
      const status = error?.response?.status;
      if (status === 401) {
        localStorage.removeItem("capex_auth");
        // Optionally: navigate to login if router is available
      }
    } catch (e) {}

    return Promise.reject(error);
  },
);

export default api;
