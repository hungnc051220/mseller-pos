import { apiSlice } from "./apiSlice";

const foodApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGroupFoods: builder.query({
      query: (data) => ({
        url: "/api/menu/group/list",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 5,
      providesTags: ["GroupFoods"],
    }),
    getGroupFood: builder.query({
      query: (groupId) => ({
        url: `/api/menu/group/${groupId}`,
        method: "GET",
      }),
      transformResponse: (response) => response.data,
      providesTags: ["GroupFoods"],
    }),
    addGroupFood: builder.mutation({
      query: (data) => ({
        url: "/api/menu/group",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 5,
      invalidatesTags: ["GroupFoods"],
    }),
    editGroupFood: builder.mutation({
      query: (data) => ({
        url: "/api/menu/group",
        method: "PUT",
        body: data,
      }),
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 5,
      invalidatesTags: ["GroupFoods"],
    }),
    deleteGroupFood: builder.mutation({
      query: (groupId) => ({
        url: `/api/menu/group/${groupId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["GroupFoods"],
    }),
  }),
});

export const {
  useGetGroupFoodsQuery,
  useGetGroupFoodQuery,
  useAddGroupFoodMutation,
  useEditGroupFoodMutation,
  useDeleteGroupFoodMutation
} = foodApiSlice;
