import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseApi } from "../api/baseApi";
import { ApiResponseStudent } from "../../api/types/apiResponses/api-response-student";

export const fetchStudentData = createAsyncThunk<ApiResponseStudent>(
  "student/fetchStudentData",
  async (_, { dispatch }) => {
    const result = await dispatch(
      baseApi.endpoints.getStudentDetails.initiate(undefined, { forceRefetch: true })
    );

    if ("data" in result && result.data) {
      return result.data;
    }

    const errorMessage =
      "error" in result && result.error && "data" in result.error
        ? String((result.error.data as { message?: string })?.message)
        : "Failed to fetch student data";

    throw new Error(errorMessage);
  }
);
