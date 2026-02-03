import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { ProductInterface } from "../../types/product"; // Corrected import path

interface InitialState {
  product: ProductInterface | null;
}

const initialState: InitialState = {
  product: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProduct(state, action: PayloadAction<{ product: ProductInterface }>) {
      state.product = action.payload.product;
    },
    clearProduct(state) {
      state.product = null;
    },
  },
});

export const { setProduct, clearProduct } = productSlice.actions; 

export const selectProduct = (state: RootState) => state.product.product

export const productReducer = productSlice.reducer;






















