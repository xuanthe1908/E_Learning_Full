import api from "../../middlewares/protected-interceptor";
import CONFIG_KEYS from "../../../config";

export const addDiscussionService = async (
  endpoint: string,
  itemId: string,
  message: string
) => {
  const response = await api.post(
    `${CONFIG_KEYS.API_BASE_URL}/${endpoint}/${itemId}`,
    {
      message,
    }
  );
  return response.data;
};

export const getDiscussionsByitemservice = async (
  endpoint: string,
  itemId: string
) => {
  const response = await api.get(
    `${CONFIG_KEYS.API_BASE_URL}/${endpoint}/${itemId}`
  );
  return response.data;
};

export const editDiscussionService = async (
  endpoint: string,
  id: string,
  message: string
) => {
  const response = await api.patch(
    `${CONFIG_KEYS.API_BASE_URL}/${endpoint}/${id}`,
    {
      message,
    }
  );
  return response.data;
};

export const deleteDiscussionService = async (endpoint: string, id: string) => {
  const response = await api.delete(
    `${CONFIG_KEYS.API_BASE_URL}/${endpoint}/${id}`
  );
  return response.data;
};

export const replyDiscussionService = async (
  endpoint: string,
  id: string,
  reply: { customerId: string; message: string }
) => {
  const response = await api.put(
    `${CONFIG_KEYS.API_BASE_URL}/${endpoint}/${id}`,
    {
      reply,
    }
  );
  return response.data;
};

export const getRepliesByDiscussionService = async (
  endpoint: string,
  id: string,
) => {
  const response = await api.get(
    `${CONFIG_KEYS.API_BASE_URL}/${endpoint}/${id}`
  );
  return response.data;
};























