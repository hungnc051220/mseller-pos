import { apiSlice } from "./apiSlice";

const costRevenueApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCostRevenue: builder.query({
      query: (data) => ({
        url: "/api/cost-revenue/list",
        method: "POST",
        body: data
      }),
      transformResponse: (response) => response.data,
      providesTags: ["CostRevenue"],
    }),
    getChartRevenue: builder.query({
      query: (data) => ({
        url: "/api/cost-revenue/chart",
        method: "POST",
        body: data
      }),
      transformResponse: (response) => response.data,
      providesTags: ["CostRevenue"],
    }),
    addCostRevenue: builder.mutation({
      query: (data) => ({
        url: "/api/cost-revenue",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CostRevenue"],
    }),
    updateCostRevenue: builder.mutation({
      query: (data) => ({
        url: "/api/cost-revenue",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["CostRevenue"],
    }),
    deleteCostRevenue: builder.mutation({
      query: (crId) => ({
        url: `/api/cost-revenue/${crId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CostRevenue"],
    }),
  }),
});

export const {
  useGetCostRevenueQuery,
  useGetChartRevenueQuery,
  useAddCostRevenueMutation,
  useUpdateCostRevenueMutation,
  useDeleteCostRevenueMutation
} = costRevenueApiSlice;
