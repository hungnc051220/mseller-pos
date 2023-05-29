import { apiSlice } from "./apiSlice";

const tableApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTable: builder.query({
      query: (tableId) => ({
        url: `/api/table/${tableId}`,
        method: "GET",
      }),
    }),
    createTable: builder.mutation({
      query: (data) => ({
        url: `/api/table`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Floors"],
    }),
    editTable: builder.mutation({
      query: (data) => ({
        url: `/api/table`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Floors"],
    }),
    deleteTable: builder.mutation({
      query: (tableId) => ({
        url: `/api/table/${tableId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Floors"],
    }),
  }),
});

export const {
  useGetTableQuery,
  useCreateTableMutation,
  useEditTableMutation,
  useDeleteTableMutation,
} = tableApiSlice;
