import api from "../../middlewares/protected-interceptor";
import { PaymentIntent } from "@stripe/stripe-js";
import axiosInstance from "../../middlewares/interceptor";
import CONFIG_KEYS from "../../../config";

export const addProductService = async (
  endpoint: string,
  productInfo: FormData
) => {
  const response = await api.post(
    `${CONFIG_KEYS.API_BASE_URL}/${endpoint}`,
    productInfo
  );
  return response;
};

export const editProductService = async (
  endpoint: string,
  productId: string,
  productInfo: FormData
) => {
  const response = await api.put(
    `${CONFIG_KEYS.API_BASE_URL}/${endpoint}/${productId}`,
    productInfo
  );
  return response;
};

export const getProductsBySellerService = async (endpoint: string) => {
  const response = await api.get(
    `${CONFIG_KEYS.API_BASE_URL}/${endpoint}`
  );
  return response.data;
};

export const getAllProductsService = async (endpoint: string) => {
  const response = await axiosInstance.get(
    `${CONFIG_KEYS.API_BASE_URL}/${endpoint}`
  );
  return response;
};

export const getIndividualProductService = async (
  endpoint: string,
  productId: string
) => {
  const response = await axiosInstance.get(
    `${CONFIG_KEYS.API_BASE_URL}/${endpoint}/${productId}`
  );
  return response;
};

export const purchaseProductService = async (
  endpoint: string,
  productId: string,
  paymentInfo?: PaymentIntent
) => {
  const response = await api.post(
    `${CONFIG_KEYS.API_BASE_URL}/${endpoint}/${productId}`,
    paymentInfo
  );
  return response.data;
};

export const getRecommendedProductsService = async (endpoint: string) => {
  const response = await api.get(
    `${CONFIG_KEYS.API_BASE_URL}/${endpoint}`
  );
  return response.data;
};

export const getTrendingProductsService = async (endpoint: string) => {
  const response = await axiosInstance.get(
    `${CONFIG_KEYS.API_BASE_URL}/${endpoint}`
  );
  return response.data;
};

export const getProductByCustomerService = async (endpoint: string) => {
  const response = await api.get(
    `${CONFIG_KEYS.API_BASE_URL}/${endpoint}`
  );
  return response.data;
};

export const searchProductService = async (
  endpoint: string,
  searchQuery: string,
  filterQuery: string
) => {
  const encodedSearch = encodeURIComponent(searchQuery || '');
  const encodedFilter = encodeURIComponent(filterQuery || '');
  
  const response = await axiosInstance.get(
    `${CONFIG_KEYS.API_BASE_URL}/${endpoint}?search=${encodedSearch}&filter=${encodedFilter}`
  );
  return response.data;
};






















