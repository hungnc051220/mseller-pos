import { apiSlice } from "./apiSlice";

const floorApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFloors: builder.query({
      query: (data) => ({
        url: "/api/floor/list",
        method: "POST",
        body: data,
      }),
      keepUnusedDataFor: 5,
      transformResponse: (response) => response.data,
      providesTags: ["Floors"],
    }),
    createFloor: builder.mutation({
      query: (data) => ({
        url: `/api/floor`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Floors"],
    }),
    editFloor: builder.mutation({
      query: (data) => ({
        url: `/api/floor`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Floors"],
    }),
    deleteFloor: builder.mutation({
      query: (floorId) => ({
        url: `/api/floor/${floorId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Floors"],
    }),
  }),
});

export const {
  useGetFloorsQuery,
  useCreateFloorMutation,
  useEditFloorMutation,
  useDeleteFloorMutation,
} = floorApiSlice;
