import { apiSlice } from "./apiSlice";

const categoryCostRevenueApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategoryCostRevenue: builder.query({
      query: (data) => ({
        url: "/api/cost-revenue/category/list",
        method: "POST",
        body: data
      }),
      transformResponse: (response) => response.data,
      providesTags: ["CategoryCostRevenue"],
    }),
    addCategoryCostRevenue: builder.mutation({
      query: (data) => ({
        url: "/api/cost-revenue/category",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CategoryCostRevenue"],
    }),
    deleteCategoryCostRevenue: builder.mutation({
      query: (categoryId) => ({
        url: `/api/cost-revenue/category/${categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CategoryCostRevenue"],
    }),
    updateCategoryCostRevenue: builder.mutation({
      query: (data) => ({
        url: "/api/cost-revenue/category",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["CategoryCostRevenue"],
    }),
  }),
});

export const {
  useGetCategoryCostRevenueQuery,
  useAddCategoryCostRevenueMutation,
  useDeleteCategoryCostRevenueMutation,
  useUpdateCategoryCostRevenueMutation
} = categoryCostRevenueApiSlice;
