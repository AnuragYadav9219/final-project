import { baseApi } from "@/services/baseApi";

export const settlementApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        createSettlement: builder.mutation({
            query: (data) => ({
                url: "settlements/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Group"],
        }),

    }),
});

export const { useCreateSettlementMutation } = settlementApi;