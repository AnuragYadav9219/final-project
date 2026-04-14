import { baseApi } from "@/services/baseApi";

export const expenseApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // GET ALL
        getExpenses: builder.query({
            query: (groupId) =>
                groupId ? `expenses/?group=${groupId}` : "expenses/",
            providesTags: ["Expense"],
        }),

        // CREATE
        createExpense: builder.mutation({
            query: (data) => ({
                url: "expenses/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Expense", "Group"],
        }),

        // UPDATE
        updateExpense: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `expenses/${id}/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Expense", "Group"],
        }),

        // DELETE
        deleteExpense: builder.mutation({
            query: (id) => ({
                url: `expenses/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["Expense", "Group"],
        }),
    }),
});

export const {
    useGetExpensesQuery,
    useCreateExpenseMutation,
    useUpdateExpenseMutation,
    useDeleteExpenseMutation,
} = expenseApi;