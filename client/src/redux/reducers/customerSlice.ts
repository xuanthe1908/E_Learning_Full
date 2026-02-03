import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { getCustomerDetails } from "../../api/endpoints/customer";
import { ApiResponseCustomer } from "../../api/types/apiResponses/api-response-customer";
import decodeJwtToken from "../../utils/decode";

interface CustomerData {
  customerDetails: ApiResponseCustomer | null;
  customerId: string | null;
  isFetching: boolean;
  error: string | null;
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

const initialState: CustomerData = {
  customerDetails: null,
  customerId: decodedToken?.payload.Id || null,
  isFetching: false,
  error: null,
};

// Async Thunk action creator to fetch user data
export const fetchCustomerData = createAsyncThunk(
  "customer/fetchCustomerData",
  async () => {
    try {
      const response = await getCustomerDetails();
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch customer data");
    }
  }
);

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setDetails(state, action: PayloadAction<{ details: ApiResponseCustomer }>) {
      state.customerDetails = action.payload.details;
    },
    clearDetails(state) {
      state.customerDetails = null;
      state.customerId = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCustomerData.pending, (state) => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(fetchCustomerData.fulfilled, (state, action) => {
        state.isFetching = false;
      state.customerDetails = action.payload;
    });
    builder.addCase(fetchCustomerData.rejected, (state, action) => {
      state.isFetching = false;
      state.error = action.error.message || "Failed to fetch customer data";
    });
  },
});

export const { setDetails, clearDetails } = customerSlice.actions;

export const selectCustomer = (state: RootState) => state.customer;

export const selectCustomerId = (state: RootState) => state.customer.customerDetails?._id;

export const selectIsFetchingCustomer = (state: RootState) => state.customer.isFetching;

export const selectCustomerError = (state: RootState) => state.customer.error;

export const customerReducer = customerSlice.reducer;






















