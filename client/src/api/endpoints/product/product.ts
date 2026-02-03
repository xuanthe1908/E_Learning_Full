import END_POINTS from "../../../constants/endpoints";
import {
  addProductService,
  editProductService,
  purchaseProductService,
  getAllProductsService,
  getProductByCustomerService,
  getIndividualProductService,
  getRecommendedProductsService,
  getTrendingProductsService,
  searchProductService,
} from "../../services/product/product-service";
import { getProductsBySellerService } from "../../services/product/product-service";
import { PaymentIntent } from "@stripe/stripe-js";

export const addProduct = (productInfo: FormData) => {
  return addProductService(END_POINTS.ADD_PRODUCT, productInfo);
};

export const editProduct = (productId: string, productInfo: FormData) => {
  return editProductService(END_POINTS.EDIT_PRODUCT, productId, productInfo);
};

export const getProductBySeller = () => {
  return getProductsBySellerService(END_POINTS.GET_PRODUCTS_BY_SELLERS);
};

export const getAllProducts = () => {
  return getAllProductsService(END_POINTS.GET_ALL_PRODUCTS);
};

export const getIndividualProduct = (productId: string) => {
  return getIndividualProductService(END_POINTS.GET_PRODUCT, productId);
};

export const purchaseProduct = (
  productId: string,
  paymentInfo?: PaymentIntent
) => {
  return purchaseProductService(END_POINTS.PURCHASE_PRODUCT, productId, paymentInfo);
};

export const getRecommendedProducts = () => {
  return getRecommendedProductsService(END_POINTS.GET_RECOMMENDED_PRODUCTS);
};

export const getTrendingProducts = () => {
  return getTrendingProductsService(END_POINTS.GET_TRENDING_PRODUCTS);
};

export const getProductByCustomer = () => {
  return getProductByCustomerService(END_POINTS.GET_PRODUCT_BY_CUSTOMER);
};

export const searchProduct = (searchQuery: string, filterQuery: string) => {
  return searchProductService(
    END_POINTS.SEARCH_PRODUCT,
    searchQuery,
    filterQuery
  );
};























