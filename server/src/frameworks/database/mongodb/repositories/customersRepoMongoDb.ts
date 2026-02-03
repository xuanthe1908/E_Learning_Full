import { CustomerInterface } from '../../../../types/customerInterface';
import Customers from '../models/customer';
import { CustomerRegisterInterface } from '@src/types/customerRegisterInterface';
import { CustomerUpdateInfo } from '../../../../types/customerInterface';
import mongoose from 'mongoose';

export const customerRepositoryMongoDB = () => {
  const addCustomer = async (customer: CustomerRegisterInterface) => {
    const newCustomer = new Customers(customer);
    return await newCustomer.save();
  };

  const getCustomerByEmail = async (email: string) => {
    const user: CustomerInterface | null = await Customers.findOne({ email });
    return user;
  };

  const getCustomer = async (id: string) => {
    const customer: CustomerInterface | null = await Customers.findById({
      _id: new mongoose.Types.ObjectId(id)
    });
    return customer;
  };

  const changePassword = async (id: string, password: string) => {
    await Customers.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { password }
    );
  };

  const updateProfile = async (id: string, customerInfo: CustomerUpdateInfo) => {
    await Customers.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { ...customerInfo }
    );
  };

  const getAllCustomers = async () => {
    const customers: CustomerInterface[] | null = await Customers.find({});
    return customers;
  };

  const blockCustomer = async (id: string, reason: string) => {
    await Customers.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { isBlocked: true, blockedReason: reason }
    );
  };

  const unblockCustomer = async (id: string) => {
    await Customers.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { isBlocked: false, blockedReason: '' }
    );
  };

  const getAllBlockedCustomers = async () => {
    const blockedCustomers: CustomerInterface[] | null = await Customers.find({
      isBlocked: true
    });
    return blockedCustomers;
  };

  const getTotalNumberOfCustomers = async () => {
    const total = await Customers.find().count();
    return total;
  };

  return {
    addCustomer,
    getCustomerByEmail,
    getCustomer,
    changePassword,
    updateProfile,
    getAllCustomers,
    blockCustomer,
    unblockCustomer,
    getAllBlockedCustomers,
    getTotalNumberOfCustomers
  };
};

export type CustomerRepositoryMongoDB = typeof customerRepositoryMongoDB;
