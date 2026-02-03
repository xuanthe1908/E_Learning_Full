import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import decodeJwtToken from "../../utils/decode";
import { SellerApiResponse } from "../../api/types/apiResponses/api-response-sellers";

interface SellerData {
  sellerDetails: SellerApiResponse | null;
  sellerId: string | null;
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

const initialState: SellerData = {
  sellerDetails: null,
  sellerId: decodedToken?.payload.Id || null,
};

const sellerSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {
    setDetails(
      state,
      action: PayloadAction<{ details: SellerApiResponse }>
    ) {
      state.sellerDetails = action.payload.details;
    },
    clearDetails(state) {
      state.sellerDetails = null;
      state.sellerId = null;
    },
  },
});

export const { setDetails, clearDetails } = sellerSlice.actions;

export const selectSeller = (state: RootState) => state.seller;

export const selectSellerId = (state: RootState) =>
  state.seller.sellerId;

export const sellerReducer = sellerSlice.reducer;






















