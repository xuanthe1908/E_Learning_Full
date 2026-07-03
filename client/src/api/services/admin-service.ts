import api from "../middlewares/protected-interceptor";
import CONFIG_KEYS from "../../config";
import { PasswordInfo } from "../types/student/student";

export const changeAdminPasswordService = async (
  endpoint: string,
  passwordInfo: PasswordInfo
) => {
  const response = await api.patch(
    `${CONFIG_KEYS.API_BASE_URL}/${endpoint}`,
    {
      currentPassword: passwordInfo.currentPassword,
      newPassword: passwordInfo.newPassword,
    }
  );
  return response;
};
