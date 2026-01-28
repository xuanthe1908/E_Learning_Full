import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import decodeJwtToken from "../../utils/decode";
import { InstructorApiResponse } from "../../api/types/apiResponses/api-response-instructors";

interface InstructorData {
  instructorDetails: InstructorApiResponse | null;
  instructorId: string | null;
}

// Helper function to get token from localStorage
const getAccessToken = (): string => {
  try {
    const tokenString = localStorage.getItem("accessToken");
    if (!tokenString) return "";
    
    // Check if it's a JSON string
    try {
      const parsed = JSON.parse(tokenString);
      return parsed?.accessToken || tokenString;
    } catch {
      // If not JSON, return as is
      return tokenString;
    }
  } catch {
    return "";
  }
};

const accessToken = getAccessToken();
const decodedToken = decodeJwtToken(accessToken);

const initialState: InstructorData = {
  instructorDetails: null,
  instructorId: decodedToken?.payload.Id || null,
};

const instructorSlice = createSlice({
  name: "instructor",
  initialState,
  reducers: {
    setDetails(
      state,
      action: PayloadAction<{ details: InstructorApiResponse }>
    ) {
      state.instructorDetails = action.payload.details;
    },
    clearDetails(state) {
      state.instructorDetails = null;
      state.instructorId = null;
    },
  },
});

export const { setDetails, clearDetails } = instructorSlice.actions;

export const selectInstructor = (state: RootState) => state.instructor;

export const selectInstructorId = (state: RootState) =>
  state.instructor.instructorId;

export const instructorReducer = instructorSlice.reducer;
