import { apiSlice } from "./apiSlice";

const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: (data) => ({
        url: "/api/order/list",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 5,
      providesTags: ["Orders"],
    }),
    getOrderDetailChange: builder.query({
      query: (orderId) => ({
        url: `/api/order/report/detail-change/${orderId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
      transformResponse: (response) => response.data,
    }),
    getOrder: builder.query({
      query: (orderId) => ({
        url: `/api/order/${orderId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
      transformResponse: (response) => response.data,
    }),
    getOrderByTable: builder.query({
      query: (data) => ({
        url: "/api/order/list",
        method: "POST",
        body: data,
      }),
      keepUnusedDataFor: 5,
      transformResponse: (response) => response.data.content[0],
    }),
    createOrder: builder.mutation({
      query: (data) => ({
        url: `/api/order`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Orders", "Floors", "Waiting", "Notifications", "Shift", "ReportOrder"],
    }),
    updateOrder: builder.mutation({
      query: (data) => ({
        url: `/api/order`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Orders", "Floors", "Waiting", "Notifications", "Shift", "ReportOrder"],
    }),
    afterPayOrder: builder.mutation({
      query: (data) => ({
        url: `/api/order/after-pay`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Orders", "Floors", "Waiting", "Notifications", "Shift", "ReportOrder"],
    }),
    acceptOrder: builder.mutation({
      query: (orderId) => ({
        url: `/api/order/accept-order/${orderId}`,
        method: "GET",
      }),
      invalidatesTags: ["Orders", "Notifications", "Floors", "Shift", "ReportOrder"],
    }),
    refuseOrder: builder.mutation({
      query: (orderId) => ({
        url: `/api/order/cancel-order/${orderId}`,
        method: "GET",
      }),
      invalidatesTags: ["Orders", "Notifications", "Floors", "Shift", "ReportOrder"],
    }),
    cancelOrder: builder.mutation({
      query: (data) => ({
        url: `/api/order/cancel`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Orders", "Notifications", "Floors", "Shift", "ReportOrder"],
    }),
    payOrder: builder.mutation({
      query: (data) => ({
        url: `/api/order/pay`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Floors", "Notifications", "Orders", "Shift", "ReportOrder"],
    }),
    acceptPayOrder: builder.mutation({
      query: (data) => ({
        url: `/api/order/accept-payment`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Floors", "Notifications", "Orders", "Shift", "ReportOrder"],
    }),
    changeTable: builder.mutation({
      query: (data) => ({
        url: `/api/order/change-table/${data.orderId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Floors", "Notifications", "Orders", "Shift"],
    }),
    stopFoodOrder: builder.mutation({
      query: (data) => ({
        url: `/api/order/stop-food`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetOrderByTableQuery,
  useGetOrderQuery,
  useGetOrderDetailChangeQuery,
  usePayOrderMutation,
  useAcceptPayOrderMutation,
  useGetOrdersQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useAcceptOrderMutation,
  useRefuseOrderMutation,
  useCancelOrderMutation,
  useChangeTableMutation,
  useStopFoodOrderMutation,
  useAfterPayOrderMutation
} = orderApiSlice;
