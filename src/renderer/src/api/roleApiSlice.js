import { apiSlice } from "./apiSlice";

const roleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query({
      query: () => ({
        url: "/api/role",
        method: "GET",
      }),
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useGetRolesQuery } = roleApiSlice;
