import { CustomerInterface } from '@src/types/customerInterface';
import HttpStatusCodes from '../../../constants/HttpStatusCodes';
import AppError from '../../../utils/appError';
import { CustomersDbInterface } from '@src/app/repositories/customerDbRepository';
import { CloudServiceInterface } from '@src/app/services/cloudServiceInterface';

export const getAllCustomersU = async (
  cloudService:ReturnType<CloudServiceInterface>,
  customerRepository: ReturnType<CustomersDbInterface>
) => {
  const customers:CustomerInterface[]|null = await customerRepository.getAllCustomers();
  await Promise.all(
    customers.map(async (customer) => {
      if (customer?.profilePic?.key) {
        customer.profileUrl = ""
        customer.profileUrl = await cloudService.getFile(customer.profilePic.key);
      }
    })
  );
  return customers;
};

export const blockCustomerU = async (
  customerId: string,
  reason: string,
  customerRepository: ReturnType<CustomersDbInterface>
) => {
  if (!customerId) {
    throw new AppError('Invalid customer details', HttpStatusCodes.BAD_REQUEST);
  }
  if (!reason) {
    throw new AppError(
      'Please give a reason to block a customer',
      HttpStatusCodes.BAD_REQUEST
    );
  }
  const customer = await customerRepository.getCustomer(customerId);
  if (customer?.isBlocked) {
    throw new AppError(
      'Already blocked this customer',
      HttpStatusCodes.CONFLICT
    );
  }
  await customerRepository.blockCustomer(customerId, reason);
};

export const unblockCustomerU = async (
  customerId: string,
  customerRepository: ReturnType<CustomersDbInterface>
) => {
  if (!customerId) {
    throw new AppError('Invalid customer details', HttpStatusCodes.BAD_REQUEST);
  }
  await customerRepository.unblockCustomer(customerId);
};


export const getAllBlockedCustomersU = async (
  cloudService:ReturnType<CloudServiceInterface>,
  customerRepository: ReturnType<CustomersDbInterface>
) => {
  const blockedCustomers:CustomerInterface[]|null = await customerRepository.getAllBlockedCustomers();
  await Promise.all(
    blockedCustomers.map(async (customer) => {
      if (customer?.profilePic?.key) {
        customer.profileUrl = ""
        customer.profileUrl = await cloudService.getFile(customer.profilePic.key);
      }
    })
  );
  return blockedCustomers;
};
