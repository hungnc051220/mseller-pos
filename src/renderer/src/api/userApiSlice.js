import { apiSlice } from "./apiSlice";

const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => ({
        url: "/api/user/profile",
        method: "GET",
      }),
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 5,
      providesTags: ["User"],
    }),
    userUpdateName: builder.mutation({
      query: (data) => ({
        url: `/api/user/update-name`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    userGenerateOtp: builder.mutation({
      query: (data) => ({
        url: `/api/user/generate-otp`,
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ["User"],
    }),
    userUpdateEmail: builder.mutation({
      query: (data) => ({
        url: `/api/user/update-email`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    userUpdateAddress: builder.mutation({
      query: (data) => ({
        url: `/api/user/update-address`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    userChangePassword: builder.mutation({
      query: (data) => ({
        url: "/api/user/change-password",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    userUpdatePhoneNumber: builder.mutation({
      query: (data) => ({
        url: "/api/user/update-phone-number",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    userUpdateBankAccount: builder.mutation({
      query: (data) => ({
        url: "/api/user/update-bank-account",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (data) => ({
        url: "/api/user/delete-user",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    updateDevice: builder.mutation({
      query: (data) => ({
        url: "/api/user/update-device",
        method: "POST",
        body: data,
      }),
    }),
    generateOtpDelete: builder.mutation({
      query: () => ({
        url: "/api/user/generate-otp-delete",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetUserQuery,
  useUserUpdateNameMutation,
  useUserGenerateOtpMutation,
  useUserUpdateEmailMutation,
  useUserUpdateAddressMutation,
  useUserChangePasswordMutation,
  useUserUpdatePhoneNumberMutation,
  useUserUpdateBankAccountMutation,
  useDeleteUserMutation,
  useUpdateDeviceMutation,
  useGenerateOtpDeleteMutation,
} = userApiSlice;
