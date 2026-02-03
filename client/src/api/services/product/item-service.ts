import api from "../../middlewares/protected-interceptor";
import CONFIG_KEYS from "../../../config";

export const getItemsByProductService = async (
    endpoint: string,
    productId: string
  ) => {
    const response = await api.get(
      `${CONFIG_KEYS.API_BASE_URL}/${endpoint}/${productId}`
    );
    return response.data;
  };
  
  export const addItemsService = async (
    endpoint: string,
    productId: string,
    item: FormData
  ) => {
    const response = await api.post(
      `${CONFIG_KEYS.API_BASE_URL}/${endpoint}/${productId}`,
      item
    );
    return response.data;
  };

  export const editItemsService = async (
    endpoint: string,
    itemId: string,
    item: FormData
  ) => {
    const response = await api.put(
      `${CONFIG_KEYS.API_BASE_URL}/${endpoint}/${itemId}`,
      item
    );
    return response.data;
  };
  
  export const getItemsByIdService = async (
    endpoint: string,
    itemId: string
  ) => {
    const response = await api.get(
      `${CONFIG_KEYS.API_BASE_URL}/${endpoint}/${itemId}`
    );
    return response.data;
  };






















