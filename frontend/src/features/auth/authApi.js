import { baseApi } from "@/services/baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: "auth/register/",
        method: "POST",
        body: data,
      }),
    }),

    login: builder.mutation({
      query: (data) => ({
        url: "auth/login/",
        method: "POST",
        body: data,
      }),
    }),

    getProfile: builder.query({
      query: () => "auth/profile/",
      providesTags: ["Auth"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetProfileQuery,
} = authApi;