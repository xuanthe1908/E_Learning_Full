import END_POINTS from "../../constants/endpoints";
import { changeAdminPasswordService } from "../services/admin-service";
import { PasswordInfo } from "../types/student/student";

export const changeAdminPassword = (passwordInfo: PasswordInfo) => {
  return changeAdminPasswordService(
    END_POINTS.ADMIN_CHANGE_PASSWORD,
    passwordInfo
  );
};
