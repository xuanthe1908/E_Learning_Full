import { CustomerRepositoryMongoDB } from '../../frameworks/database/mongodb/repositories/customersRepoMongoDb';
import { CustomerRegisterInterface } from '@src/types/customerRegisterInterface';
import { CustomerUpdateInfo } from '@src/types/customerInterface';

export const customerDbRepository = (
  repository: ReturnType<CustomerRepositoryMongoDB>
) => {
  const addCustomer = async (customer: CustomerRegisterInterface) =>
    await repository.addCustomer(customer);

  const getCustomerByEmail = async (email: string) =>
    await repository.getCustomerByEmail(email);

  const getCustomer = async (id: string) => await repository.getCustomer(id);

  const changePassword = async (id: string, password: string) =>
    await repository.changePassword(id, password);

  const updateProfile = async (id: string, customerInfo: CustomerUpdateInfo) =>
    await repository.updateProfile(id, customerInfo);

  const getAllCustomers = async() => await repository.getAllCustomers()

  const blockCustomer = async(id:string,reason:string) => await repository.blockCustomer(id,reason)

  const unblockCustomer = async(id:string) => await repository.unblockCustomer(id)

  const getAllBlockedCustomers =async () => await repository.getAllBlockedCustomers()

  const getTotalNumberOfCustomers = async () => await repository.getTotalNumberOfCustomers()

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

export type CustomersDbInterface = typeof customerDbRepository;
