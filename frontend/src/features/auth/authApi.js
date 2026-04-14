import { baseApi } from "@/services/baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ================= REGISTER =================
    register: builder.mutation({
      query: (data) => ({
        url: "auth/register/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    // ================= LOGIN =================
    login: builder.mutation({
      query: (data) => ({
        url: "auth/login/",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          // Save tokens
          localStorage.setItem("access", data.access);
          localStorage.setItem("refresh", data.refresh);
        } catch (err) {
          console.error("Login failed", err);
        }
      },
      invalidatesTags: ["Auth"],
    }),

    // ================= PROFILE =================
    getProfile: builder.query({
      query: () => "auth/profile/",
      providesTags: ["Auth"],
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: "auth/profile/",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} = authApi;