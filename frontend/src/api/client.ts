import axios from "axios";

const ACCESS_TOKEN_KEY =
  "titancrm_access_token";

const client = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://127.0.0.1:8000",

  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use(
  (config) => {
    const accessToken =
      localStorage.getItem(
        ACCESS_TOKEN_KEY,
      );

    if (accessToken) {
      config.headers.Authorization =
        `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: unknown) =>
    Promise.reject(error),
);

client.interceptors.response.use(
  (response) => response,

  (error) => {
    const status =
      error.response?.status;

    const accessToken =
      localStorage.getItem(
        ACCESS_TOKEN_KEY,
      );

    if (
      status === 401 &&
      accessToken
    ) {
      localStorage.removeItem(
        "titancrm_access_token",
      );

      localStorage.removeItem(
        "titancrm_user",
      );

      localStorage.removeItem(
        "titancrm_user_role",
      );

      if (
        window.location.pathname !==
        "/login"
      ) {
        window.location.replace(
          "/login",
        );
      }
    }

    return Promise.reject(error);
  },
);

export default client;