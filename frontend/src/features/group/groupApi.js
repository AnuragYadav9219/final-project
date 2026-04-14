import { baseApi } from "@/services/baseApi";

export const groupApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // Get all groups
        getGroups: builder.query({
            query: () => "groups/",
            providesTags: ["Group"],
        }),

        // Create group
        createGroup: builder.mutation({
            query: (data) => ({
                url: "groups/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Group"],
        }),

        // Get single group details
        getGroupById: builder.query({
            query: (id) => `groups/${id}/`,
        }),

        // Add member to group
        addMember: builder.mutation({
            query: ({ groupId, data }) => ({
                url: `groups/${groupId}/add_member/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Group"],
        }),

        // Get balances
        getBalances: builder.query({
            query: ({ groupId, optimize }) =>
                `groups/${groupId}/balances/?optimize=${optimize}`,
        }),

        sendInvite: builder.mutation({
            query: (data) => ({
                url: "invite/",
                method: "POST",
                body: data,
            }),
        }),

        acceptInvite: builder.mutation({
            query: (token) => ({
                url: `invite/accept-invite/${token}/`,
                method: "POST",
            }),
        }),
    }),
});

export const {
    useGetGroupsQuery,
    useCreateGroupMutation,
    useGetGroupByIdQuery,
    useAddMemberMutation,
    useGetBalancesQuery,
    useSendInviteMutation,
    useAcceptInviteMutation,
} = groupApi;