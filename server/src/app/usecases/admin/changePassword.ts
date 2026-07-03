import HttpStatusCodes from '../../../constants/HttpStatusCodes';
import AppError from '../../../utils/appError';
import { AdminDbInterface } from '../../repositories/adminDbRepository';
import { AuthServiceInterface } from '../../services/authServicesInterface';
import { AdminSavedDbInterface } from '../../../types/adminAuthInterface';

export const changeAdminPasswordU = async (
  id: string | undefined,
  password: { currentPassword: string; newPassword: string },
  authService: ReturnType<AuthServiceInterface>,
  adminDbRepository: ReturnType<AdminDbInterface>
) => {
  if (!id) {
    throw new AppError('Invalid admin', HttpStatusCodes.BAD_REQUEST);
  }
  if (!password.currentPassword) {
    throw new AppError(
      'Please provide current password',
      HttpStatusCodes.BAD_REQUEST
    );
  }
  const admin: AdminSavedDbInterface | null =
    await adminDbRepository.getAdminById(id);
  if (!admin) {
    throw new AppError('Unauthorized user', HttpStatusCodes.NOT_FOUND);
  }
  const isPasswordCorrect = await authService.comparePassword(
    password.currentPassword,
    admin.password
  );
  if (!isPasswordCorrect) {
    throw new AppError(
      'Sorry, your current password is incorrect.',
      HttpStatusCodes.BAD_REQUEST
    );
  }
  if (!password.newPassword) {
    throw new AppError(
      'New password cannot be empty',
      HttpStatusCodes.BAD_REQUEST
    );
  }
  const hashedPassword = await authService.hashPassword(password.newPassword);
  await adminDbRepository.changePassword(id, hashedPassword);
};
