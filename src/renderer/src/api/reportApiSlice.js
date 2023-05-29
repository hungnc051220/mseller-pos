import { apiSlice } from "./apiSlice";

const reportApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReport: builder.query({
      query: (data) => ({
        url: "/api/report/turn-over/overview",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 5,
      providesTags: ["Report"],
    }),
    getReportOverview: builder.query({
      query: (data) => ({
        url: "/api/report/overview",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 5,
      providesTags: ["Report"],
    }),
    getReportByPaymentType: builder.query({
      query: (data) => ({
        url: "/api/report/turn-over/by-payment-type",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 5,
      providesTags: ["Report"],
    }),
    getReportOrder: builder.query({
      query: (data) => ({
        url: "/api/report/order/overview",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 5,
      providesTags: ["ReportOrder"],
    }),
    getReportOrderInProgress: builder.query({
      query: (data) => ({
        url: "/api/report/order/in-progress",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 5,
      providesTags: ["ReportOrder"],
    }),
    getReportChangedOrders: builder.query({
      query: (data) => ({
        url: "/api/order/report/changed-orders/v1",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 5,
      providesTags: ["ChangedOrders"],
    }),
  }),
});

export const {
  useGetReportQuery,
  useGetReportByPaymentTypeQuery,
  useGetReportOrderQuery,
  useGetReportOrderInProgressQuery,
  useGetReportChangedOrdersQuery,
  useGetReportOverviewQuery,
} = reportApiSlice;
