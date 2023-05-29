import { apiSlice } from "./apiSlice";

const foodApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFoods: builder.query({
      query: (data) => ({
        url: "/api/menu/food/list",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 3600,
      providesTags: ["Foods"],
    }),
    getFood: builder.query({
      query: (foodId) => ({
        url: `/api/menu/food/${foodId}`,
        method: "GET",
      }),
      transformResponse: (response) => response.data,
      providesTags: ["Food"],
    }),
    getFoodWaiting: builder.query({
      query: (data) => ({
        url: "/api/menu/food/list-waiting",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 5,
      providesTags: ["Waiting"],
    }),
    completeFood: builder.mutation({
      query: (data) => ({
        url: `/api/menu/food/complete`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Waiting"],
    }),
    completeMultiFoods: builder.mutation({
      query: (data) => ({
        url: `/api/menu/food/complete-multi`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Waiting"],
    }),
    deleteFood: builder.mutation({
      query: (foodId) => ({
        url: `/api/menu/food/${foodId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Foods"],
    }),
    soldOutFood: builder.mutation({
      query: (data) => ({
        url: `/api/menu/food/sold-out`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Foods"],
    }),
    createCatalog: builder.mutation({
      query: (data) => ({
        url: `/api/menu/group`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Foods"],
    }),
  }),
});

export const {
  useGetFoodWaitingQuery,
  useCompleteFoodMutation,
  useCompleteMultiFoodsMutation,
  useGetFoodsQuery,
  useGetFoodQuery,
  useDeleteFoodMutation,
  useSoldOutFoodMutation,
  useCreateCatalogMutation
} = foodApiSlice;
