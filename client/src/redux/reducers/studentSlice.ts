import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { ApiResponseStudent } from "../../api/types/apiResponses/api-response-student";
import decodeJwtToken from "../../utils/decode";
import { fetchStudentData } from "../thunks/studentThunks";

interface StudentData {
  studentDetails: ApiResponseStudent | null;
  studentId: string | null;
  isFetching: boolean;
  error: string | null;
}

const accessToken = localStorage.getItem("accessToken");
const decodedToken = decodeJwtToken(accessToken??"")

const initialState: StudentData = {
  studentDetails: null,
  studentId: decodedToken?.payload.Id || null,
  isFetching: false,
  error: null,
};

const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    setDetails(state, action: PayloadAction<{ details: ApiResponseStudent }>) {
      state.studentDetails = action.payload.details;
    },
    clearDetails(state) {
      state.studentDetails = null;
      state.studentId = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchStudentData.pending, (state) => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(fetchStudentData.fulfilled, (state, action) => {
        state.isFetching = false;
      state.studentDetails = action.payload;
    });
    builder.addCase(fetchStudentData.rejected, (state, action) => {
      state.isFetching = false;
      state.error = action.error.message || "Failed to fetch student data";
    });
  },
});

export const { setDetails, clearDetails } = studentSlice.actions;

export { fetchStudentData } from "../thunks/studentThunks";

export const selectStudent = (state: RootState) => state.student;

export const selectStudentId = (state: RootState) => state.student.studentDetails?._id;

export const selectIsFetchingStudent = (state: RootState) => state.student.isFetching;

export const selectStudentError = (state: RootState) => state.student.error;

export const studentReducer = studentSlice.reducer;
