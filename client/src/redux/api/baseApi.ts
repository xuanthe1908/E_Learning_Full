import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import CONFIG_KEYS from '../../config';
import { refreshTokenApi } from '../../api/endpoints/auth/token-refresh';
import { ApiResponseStudent } from '../../api/types/apiResponses/api-response-student';
import { CourseInterface } from '../../types/course';

type ApiEnvelope<T> = {
  status: string;
  message: string;
  data: T;
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: CONFIG_KEYS.API_BASE_URL,
  prepareHeaders: (headers) => {
    const tokenString = localStorage.getItem('accessToken');
    if (tokenString) {
      const token = JSON.parse(tokenString);
      headers.set('Authorization', `Bearer ${token.accessToken}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const tokenString = localStorage.getItem('refreshToken');
    if (tokenString) {
      try {
        const token = JSON.parse(tokenString);
        const newAccessToken = await refreshTokenApi(token?.refreshToken);
        localStorage.setItem(
          'accessToken',
          JSON.stringify({ accessToken: newAccessToken })
        );
        result = await rawBaseQuery(args, api, extraOptions);
      } catch {
        return result;
      }
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Student', 'Course', 'Enrollment', 'Auth'],
  endpoints: (builder) => ({
    getStudentDetails: builder.query<ApiResponseStudent, void>({
      query: () => '/api/students/get-student-details',
      transformResponse: (response: ApiEnvelope<ApiResponseStudent>) => response.data,
      providesTags: ['Student'],
    }),
    getAllCourses: builder.query<CourseInterface[], void>({
      query: () => '/api/courses/get-all-courses',
      transformResponse: (response: ApiEnvelope<CourseInterface[]>) => response.data,
      providesTags: ['Course'],
    }),
    enrollInCourse: builder.mutation<ApiEnvelope<null>, string>({
      query: (courseId) => ({
        url: `/api/courses/enroll-student/${courseId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Student', 'Course', 'Enrollment'],
    }),
    forgotPassword: builder.mutation<
      ApiEnvelope<null>,
      { email: string; role: 'student' | 'instructor' }
    >({
      query: (body) => ({
        url: '/api/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),
    resetPassword: builder.mutation<
      ApiEnvelope<null>,
      { token: string; newPassword: string }
    >({
      query: (body) => ({
        url: '/api/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),
    loginStudent: builder.mutation<
      { accessToken: string; refreshToken: string },
      { email: string; password: string }
    >({
      query: (body) => ({
        url: '/api/auth/student-login',
        method: 'POST',
        body,
      }),
      transformResponse: (response: {
        accessToken: string;
        refreshToken: string;
      }) => response,
      invalidatesTags: ['Auth', 'Student'],
    }),
  }),
});

export const {
  useGetStudentDetailsQuery,
  useLazyGetStudentDetailsQuery,
  useGetAllCoursesQuery,
  useEnrollInCourseMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLoginStudentMutation,
} = baseApi;
