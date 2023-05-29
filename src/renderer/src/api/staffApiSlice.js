import { apiSlice } from "./apiSlice";

const staffApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStaffs: builder.query({
      query: (data) => ({
        url: "/api/employee/list",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 5,
      providesTags: ["Staffs"],
    }),
    getStaff: builder.query({
      query: (userId) => ({
        url: `/api/employee/${userId}`,
        method: "GET",
      }),
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 5,
    }),
    addStaff: builder.mutation({
      query: (data) => ({
        url: "/api/employee",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Staffs"],
    }),
    updateStaff: builder.mutation({
      query: (data) => ({
        url: "/api/employee",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Staffs"],
    }),
    deleteStaff: builder.mutation({
      query: (userId) => ({
        url: `/api/employee/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Staffs"],
    }),
  }),
});

export const {
  useGetStaffsQuery,
  useGetStaffQuery,
  useAddStaffMutation,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
} = staffApiSlice;
