import { apiSlice } from "./apiSlice";

const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: (data) => ({
        url: "/api/notification",
        method: "POST",
        body: data,
      }),
      serializeQueryArgs: ({ queryArgs, endpointName }) => {
        return endpointName;
      },
      // Always merge incoming data to the cache entry
      merge: (currentCache, newItems) => {
        if (newItems.number > 0) {
          currentCache.content.push(...newItems.content);
          return currentCache;
        }
        return newItems;
      },
      // Refetch when the page arg changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      // transformResponse: (response) => {
      //   return response.data;
      // },
      keepUnusedDataFor: 5,
      providesTags: (result, error, id) => [{ type: "Notifications", id }],
    }),
    readAllNotification: builder.mutation({
      query: () => ({
        url: `/api/notification/read-all`,
        method: "GET",
      }),
      invalidatesTags: ["Notifications"],
    }),
    readNotification: builder.mutation({
      query: (notificationId) => ({
        url: `/api/notification/read/${notificationId}`,
        method: "GET",
      }),
      invalidatesTags: ["Notifications"],
    }),
    deleteNotification: builder.mutation({
      query: (notificationId) => ({
        url: `/api/notification/${notificationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useReadAllNotificationMutation,
  useReadNotificationMutation,
  useDeleteNotificationMutation,
} = notificationApiSlice;
