import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ================= BASE QUERY =================

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("access");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

// ================= AUTO REFRESH =================

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If token expired (401)
  if (result?.error?.status === 401) {
    const refresh = localStorage.getItem("refresh");

    if (refresh) {
      // Try refresh
      const refreshResult = await baseQuery(
        {
          url: "auth/token/refresh/",
          method: "POST",
          body: { refresh },
        },
        api,
        extraOptions
      );

      if (refreshResult?.data) {
        // Save new access token
        localStorage.setItem("access", refreshResult.data.access);

        // Retry original request
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Logout if refresh fails
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        window.location.href = "/";
      }
    }
  }

  return result;
};

// ================= API =================

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth", "Dashboard"],
  endpoints: () => ({}),
});