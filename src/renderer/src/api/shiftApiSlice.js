import { apiSlice } from "./apiSlice";

const shiftApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getShifts: builder.query({
      query: (data) => ({
        url: "/api/shifts/list",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => response.data,
      providesTags: ["Shifts"],
    }),
    getShift: builder.query({
      query: (shitfId) => ({
        url: `/api/shifts/detail/${shitfId}`,
        method: "GET",
      }),
      transformResponse: (response) => response.data,
      providesTags: ["Shift"]
    }),
    startShift: builder.mutation({
      query: (data) => ({
        url: "/api//shifts/start",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Shifts"],
    }),
    closeShift: builder.mutation({
      query: (data) => ({
        url: `/api/shifts/close/${data?.shiftId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Shifts"],
    }),
  }),
});

export const {
  useGetShiftsQuery,
  useGetShiftQuery,
  useStartShiftMutation,
  useCloseShiftMutation,
} = shiftApiSlice;
