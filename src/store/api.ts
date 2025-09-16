import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { IResponseRegister, IUser, productDetails } from "./interface";
import { IRegister } from "./interface";
// import { ProductFormData } from "@/app/book-sell/page";
import { Mutex } from "async-mutex";
import { setToken } from "../../config/axiosInstance";

export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";


  const mutex = new Mutex();

let accessToken = "";

export function setAccessToken(token: string) {
  accessToken = token;
  setToken(token); // synchronise avec axios si nécessaire
}

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: typeof baseQuery = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await baseQuery(
          { url: "/auth/refresh-token", method: "POST" },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const newToken = (refreshResult.data as any).accessToken;
          setAccessToken(newToken);

          result = await baseQuery(args, api, extraOptions);
        } else {
          // Redirection ou logout
          if (typeof window !== "undefined") {
            // window.location.href = "/";
            console.log("redirection");
          }
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

const API_URL = {
  //AUTH
  
  REGISTER: () => `${BASE_URL}/auth/register`,
  LOGIN: () => `${BASE_URL}/auth/login`,
  GOOGLE_LOGIN: () => `${BASE_URL}/auth/google`,
  VERIFY_AUTH: () => `${BASE_URL}/auth/verify-auth`,
  VERIFY_EMAIL: (token: string) => `${BASE_URL}/auth/verify-email/${token}`,
  VERIFY_CODE: () => `${BASE_URL}/auth/verify`,
  FORGOT_PASSWORD: () => `${BASE_URL}/auth/forgot-password`,
  RESET_PASSWORD: () => `${BASE_URL}/auth/reset-password`,
  USER_ME: () => `${BASE_URL}/auth/me`,
  LOGOUT: () => `${BASE_URL}/auth/logout`,
  ACTIVATE_EMAIL: () => `${BASE_URL}/auth/activate-email`,

  //USER

  UPDATE_USER: () => `${BASE_URL}/user/profile`,
  CREATE_USER: () => `${BASE_URL}/user/create`,
  GET_USERS: () => `${BASE_URL}/users`,
  GET_USER: (id: string) => `${BASE_URL}/user/${id}`,
  DELETE_USER: (id: string) => `${BASE_URL}/user/${id}`,

  //PRODUCT

  CREATE_PRODUCT: () => `${BASE_URL}/product/create`,
  GET_PRODUCTS: () => `${BASE_URL}/product/all`,
  GET_PRODUCT: (id: string) => `${BASE_URL}/product/${id}`,
  UPDATE_PRODUCT: () => `${BASE_URL}/product`,
  DELETE_PRODUCT: (id: string) => `${BASE_URL}/product/${id}`,

  //CART

  CREATE_CART: () => `${BASE_URL}/cart/add`,
  GET_CARTS: () => `${BASE_URL}/cart/all`,
  GET_CART: (userId: string) => `${BASE_URL}/cart/get/${userId}`,
  UPDATE_CART: () => `${BASE_URL}/cart`,
  DELETE_CART: (productId: string) => `${BASE_URL}/cart/remove/${productId}`,
};

export const api = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Product", "Cart"],
  endpoints: (builder) => ({
    //auth
    register: builder.mutation<IResponseRegister, IRegister>({
      query: (data) => ({
        url: API_URL.REGISTER(),
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    login: builder.mutation<
      { success: boolean },
      { email: string; password: string }
    >({
      query: (data) => ({
        url: API_URL.LOGIN(),
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    logoutUser: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: API_URL.LOGOUT(),
        method: "GET",
      }),
      invalidatesTags: ["User"],
    }),
    verifyAuth: builder.query<{ success: boolean; data: IUser }, void>({
      query: () => ({
        url: API_URL.VERIFY_AUTH(),
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    verifyTokenEmail: builder.mutation<
      { success: boolean; message: string },
      { token: string }
    >({
      query: ({ token }) => ({
        url: `${API_URL.VERIFY_EMAIL(token)}`,
        method: "GET",
      }),
      invalidatesTags: ["User"],
    }),
    verifyCode: builder.mutation({
      query: (data) => ({
        url: API_URL.VERIFY_CODE(),
        method: "GET",
        body: data,
      }),
    }),
    resendActivateEmail: builder.mutation<
      { success: boolean; message: string },
      { email: string }
    >({
      query: (data) => ({
        url: API_URL.ACTIVATE_EMAIL(),
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    //USER
    updateUser: builder.mutation({
      query: (data) => ({
        url: API_URL.UPDATE_USER(),
        method: "POST",
        body: data,
      }),
    }),

    //PRODUCT

    createProduct: builder.mutation<
      { success: boolean; data: productDetails },
      FormData
    >({
      query: (formData) => ({
        url: API_URL.CREATE_PRODUCT(),
        method: "POST",
        body: formData,
      }),
    }),
    getProducts: builder.query<{ success: boolean; data: any }, void>({
      query: () => ({
        url: API_URL.GET_PRODUCTS(),
        method: "GET",
      }),
    }),
    getProduct: builder.query<{ success: boolean; data: any }, string>({
      query: (id) => ({
        url: API_URL.GET_PRODUCT(id),
        method: "GET",
      }),
    }),
    updateProduct: builder.mutation({
      query: (data) => ({
        url: API_URL.UPDATE_PRODUCT(),
        method: "PUT",
        body: data,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: API_URL.DELETE_PRODUCT(id),
        method: "DELETE",
      }),
    }),
    //CART

    createCart: builder.mutation<
      { success: boolean; data: any },
      { productId: string; quantity: number }
    >({
      query: (data) => ({
        url: API_URL.CREATE_CART(),
        method: "POST",
        body: data,
      }),
    }),
    getCarts: builder.query({
      query: () => ({
        url: API_URL.GET_CARTS(),
        method: "GET",
      }),
    }),
    getCart: builder.query<{ success: boolean; data: any }, { userId: string }>(
      {
        query: ({ userId }) => ({
          url: API_URL.GET_CART(userId),
          method: "GET",
        }),
      }
    ),
    updateCart: builder.mutation({
      query: (data) => ({
        url: API_URL.UPDATE_CART(),
        method: "PUT",
        body: data,
      }),
    }),
    deleteCart: builder.mutation({
      query: (productId: string) => ({
        url: API_URL.DELETE_CART(productId),
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutUserMutation,
  useResendActivateEmailMutation,
  useVerifyTokenEmailMutation,
  useVerifyAuthQuery,
  useCreateProductMutation,
  useGetProductsQuery,
  useGetProductQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateCartMutation,
  useGetCartsQuery,
  useGetCartQuery,
  useUpdateCartMutation,
  useDeleteCartMutation,
} = api;
