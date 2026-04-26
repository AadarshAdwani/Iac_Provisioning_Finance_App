import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "./endpoints";

// Ensure BASE_URL includes the version if necessary, e.g., http://localhost:5000/api/v1
const baseQuery = fetchBaseQuery({ 
  baseUrl: BASE_URL, // This is "/api/v1"
  credentials: "include" 
});

export const apiSlice = createApi({
  reducerPath: 'api', // Added for clarity in Redux DevTools
  baseQuery,
  tagTypes: ['User'], // Useful for invalidating cache later
  endpoints: () => ({}),
});