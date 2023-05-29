import { apiSlice } from "./apiSlice";

const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/api/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response, meta, arg) => {
        return {
          user: response,
          accessToken: meta.response.headers.get("Authorization"),
          refreshToken: meta.response.headers.get("RefreshToken"),
        };
      },
    }),
    registerAccount: builder.mutation({
      query: (data) => ({
        url: `/api/auth/register`,
        method: "POST",
        body: data
      }),
    }),
    verifyPhoneNumber: builder.mutation({
      query: (data) => ({
        url: `/api/auth/register/verify-phone-number`,
        method: "POST",
        body: data
      }),
    }),
    confirmPhoneNumber: builder.mutation({
      query: (data) => ({
        url: `/api/auth/register/confirm-phone-number`,
        method: "POST",
        body: data
      }),
    }),
    generateOtp: builder.mutation({
      query: (data) => ({
        url: `/api/auth/generate-otp`,
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => response.data,
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: `/api/auth/change-password`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterAccountMutation,
  useVerifyPhoneNumberMutation,
  useConfirmPhoneNumberMutation,
  useGenerateOtpMutation,
  useChangePasswordMutation,
} = authApiSlice;
