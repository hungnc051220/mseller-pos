import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logOut, setCredentials } from "../features/auth/authSlice";
import { Mutex } from "async-mutex";

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.RENDERER_VITE_API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Accept-Language", "vi");
    return headers;
  },
});

const metaBaseQuery = fetchBaseQuery({ baseUrl: import.meta.env.RENDERER_VITE_API_URL });

const baseQueryWithReAuth = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);
  if(api.endpoint === "login") return result;

  if (result?.error?.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const refreshResult = await metaBaseQuery(
          {
            url: "/api/auth/refresh-token",
            method: "POST",
            body: { refreshToken: api.getState().auth.refreshToken },
          },
          api,
          extraOptions
        );
        if (refreshResult?.data) {
          const user = api.getState().auth.user;
          api.dispatch(setCredentials({ ...refreshResult.data, user }));
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logOut());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReAuth,
  tagTypes: [
    "Floors",
    "Waiting",
    "Orders",
    "Foods",
    "Food",
    "Report",
    "ReportOrder",
    "Notifications",
    "User",
    "Staffs",
    "Shifts",
    "Shift",
    "FoodOption",
    "ChangedOrders"
  ],
  endpoints: () => ({}),
});
