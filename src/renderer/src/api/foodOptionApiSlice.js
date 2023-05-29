import { apiSlice } from "./apiSlice";

const foodOptionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFoodOptions: builder.query({
      query: () => ({
        url: "/api/menu/sub-food",
        method: "GET",
      }),
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 5,
      providesTags: ["FoodOption"],
    }),
    addFoodOption: builder.mutation({
      query: (data) => ({
        url: `/api/menu/sub-food`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["FoodOption", "Foods"],
    }),
    deleteFoodOption: builder.mutation({
      query: (id) => ({
        url: `/api/menu/sub-food/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["FoodOption", "Foods"],
    }),
    assignFoodOption: builder.mutation({
      query: (data) => ({
        url: `/api/menu/sub-food/edit-assign`,
        method: "PUT",
        body: data
      }),
      invalidatesTags: ["FoodOption", "Foods"],
    }),
    editFoodOption: builder.mutation({
      query: (data) => ({
        url: `/api/menu/sub-food`,
        method: "PUT",
        body: data
      }),
      invalidatesTags: ["FoodOption", "Foods"],
    }),
    assignFoodToOption: builder.mutation({
      query: (data) => ({
        url: `/api/menu/sub-food/edit-assign-to-options`,
        method: "PUT",
        body: data
      }),
      invalidatesTags: ["FoodOption", "Foods"],
    }),
  }),
});

export const {
  useGetFoodOptionsQuery,
  useAddFoodOptionMutation,
  useDeleteFoodOptionMutation,
  useAssignFoodOptionMutation,
  useEditFoodOptionMutation,
  useAssignFoodToOptionMutation
} = foodOptionApiSlice;
