import Admin from '../models/admin';
import { AdminSavedDbInterface } from '@src/types/adminAuthInterface';
import mongoose from 'mongoose';

export const adminRepoMongoDb = () => {
  const getAdminByEmail = async (email: string) => {
    const admin: AdminSavedDbInterface | null = await Admin.findOne({ email });
    return admin;
  };

  const getAdminById = async (id: string) => {
    const admin: AdminSavedDbInterface | null = await Admin.findById({
      _id: new mongoose.Types.ObjectId(id),
    });
    return admin;
  };

  const changePassword = async (id: string, password: string) => {
    await Admin.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { password }
    );
  };

  return {
    getAdminByEmail,
    getAdminById,
    changePassword,
  };
};

export type AdminRepositoryMongoDb = typeof adminRepoMongoDb;
