// Mock Authentication Utility
// Sets up mock auth state for Customer and Seller when USE_MOCK_DATA = true

import { USE_MOCK_DATA } from '../config/mockConfig';

// Mock JWT tokens (just for bypassing auth checks, not real tokens)
const MOCK_CUSTOMER_TOKEN = 'mock.customer.token';
const MOCK_SELLER_TOKEN = 'mock.seller.token';
const MOCK_REFRESH_TOKEN = 'mock.refresh.token';

/**
 * Setup mock authentication for Customer
 */
export const setupMockCustomerAuth = () => {
  if (!USE_MOCK_DATA) return;
  
  // Set mock tokens in localStorage
  localStorage.setItem('accessToken', MOCK_CUSTOMER_TOKEN);
  localStorage.setItem('refreshToken', MOCK_REFRESH_TOKEN);
  
  // Set mock user type
  const mockToken = {
    payload: {
      role: 'student',
      Id: 'customer1',
      email: 'nguyenthihoa@customer.com'
    }
  };
  
  // Store in a way that decodeJwtToken can handle
  // Since we're bypassing, we'll use a simple approach
  console.log('✅ Mock Customer Auth: Bypassed authentication');
};

/**
 * Setup mock authentication for Seller
 */
export const setupMockSellerAuth = () => {
  if (!USE_MOCK_DATA) return;
  
  // Set mock tokens in localStorage
  localStorage.setItem('accessToken', MOCK_SELLER_TOKEN);
  localStorage.setItem('refreshToken', MOCK_REFRESH_TOKEN);
  
  // Set mock user type
  const mockToken = {
    payload: {
      role: 'instructor',
      Id: 'seller1',
      email: 'nguyenvanan@seller.com'
    }
  };
  
  console.log('✅ Mock Seller Auth: Bypassed authentication');
};

/**
 * Clear mock authentication
 */
export const clearMockAuth = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

