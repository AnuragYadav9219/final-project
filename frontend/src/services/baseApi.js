import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery,
    tagTypes: ["Auth", "Dashboard"],
    endpoints: () => ({}),
});