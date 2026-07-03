import { AdminRepositoryMongoDb } from '@src/frameworks/database/mongodb/repositories/adminRepoMongoDb';

export const adminDbRepository = (
  repository: ReturnType<AdminRepositoryMongoDb>
) => {
  const getAdminByEmail = async (email: string) =>
    await repository.getAdminByEmail(email);

  const getAdminById = async (id: string) => await repository.getAdminById(id);

  const changePassword = async (id: string, password: string) =>
    await repository.changePassword(id, password);

  return {
    getAdminByEmail,
    getAdminById,
    changePassword,
  };
};

export type AdminDbInterface = typeof adminDbRepository;
