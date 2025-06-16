import configKeys from '../../config';
import * as crypto from 'crypto';
import * as querystring from 'querystring';
import axios from 'axios';

export const vnpayService = () => {
  const vnpayConfig = {
    vnp_TmnCode: configKeys.VNPAY_TMN_CODE || '',
    vnp_HashSecret: configKeys.VNPAY_HASH_SECRET || '',
    vnp_Url: configKeys.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    vnp_ApiUrl: 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction',
    vnp_ReturnUrl: configKeys.VNPAY_RETURN_URL || 'http://localhost:3000/payment/vnpay/return'
  };

  // Validate configuration
  const validateConfig = () => {
    const requiredConfigs = ['vnp_TmnCode', 'vnp_HashSecret', 'vnp_Url'];
    for (const config of requiredConfigs) {
      if (!vnpayConfig[config as keyof typeof vnpayConfig]) {
        throw new Error(`Missing VNPay configuration: ${config}`);
      }
    }
  };

  const createPaymentUrl = (
    amount: number,
    orderInfo: string,
    orderId: string,
    ipAddr: string
  ) => {
    validateConfig();
    
    // Validate inputs
    if (!amount || amount <= 0) {
      throw new Error('Invalid amount');
    }
    if (!orderInfo || !orderId) {
      throw new Error('Missing required parameters');
    }

    const date = new Date();
    const createDate = formatDate(date);
    const expireDate = formatDate(new Date(date.getTime() + 15 * 60 * 1000)); // 15 minutes
    
    let vnp_Params: any = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: vnpayConfig.vnp_TmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: 'other',
      vnp_Amount: amount * 100, // VNPay requires amount * 100
      vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
      vnp_ExpireDate: expireDate
    };

    // Sort parameters alphabetically
    vnp_Params = sortObject(vnp_Params);

    const signData = querystring.stringify(vnp_Params, undefined, undefined, { 
      encodeURIComponent: (str) => str 
    });
    
    const hmac = crypto.createHmac('sha512', vnpayConfig.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;

    const paymentUrl = vnpayConfig.vnp_Url + '?' + 
      querystring.stringify(vnp_Params, undefined, undefined, { 
        encodeURIComponent: (str) => str 
      });
    
    return paymentUrl;
  };

  const verifyReturnUrl = (vnp_Params: any) => {
    try {
      const secureHash = vnp_Params['vnp_SecureHash'];
      
      if (!secureHash) {
        return false;
      }
      
      // Create a copy to avoid mutating original
      const paramsCopy = { ...vnp_Params };
      delete paramsCopy['vnp_SecureHash'];
      delete paramsCopy['vnp_SecureHashType'];

      const sortedParams = sortObject(paramsCopy);
      const signData = querystring.stringify(sortedParams, undefined, undefined, { 
        encodeURIComponent: (str) => str 
      });
      
      const hmac = crypto.createHmac('sha512', vnpayConfig.vnp_HashSecret);
      const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

      return secureHash === signed;
    } catch (error) {
      console.error('Error verifying VNPay return URL:', error);
      return false;
    }
  };

  const createQRPayment = async (
    amount: number,
    orderInfo: string,
    orderId: string
  ) => {
    validateConfig();
    
    const date = new Date();
    const createDate = formatDate(date);
    const expireDate = formatDate(new Date(date.getTime() + 15 * 60 * 1000));
    
    const qrData = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: vnpayConfig.vnp_TmnCode,
      vnp_Amount: amount * 100,
      vnp_CreateDate: createDate,
      vnp_ExpireDate: expireDate,
      vnp_CurrCode: 'VND',
      vnp_IpAddr: '127.0.0.1',
      vnp_Locale: 'vn',
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: 'other',
      vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
      vnp_TxnRef: orderId
    };

    const sortedData = sortObject(qrData);
    const signData = querystring.stringify(sortedData, undefined, undefined, { 
      encodeURIComponent: (str) => str 
    });
    
    const hmac = crypto.createHmac('sha512', vnpayConfig.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    const qrUrl = `${vnpayConfig.vnp_Url}?${signData}&vnp_SecureHash=${signed}`;
    return {
      qrCode: qrUrl,
      paymentData: {
        ...qrData,
        vnp_SecureHash: signed
      }
    };
  };

  const checkPaymentStatus = async (orderId: string, transDate: string) => {
    validateConfig();
    
    const requestId = generateRequestId();
    const createDate = formatDate(new Date());
    
    const vnp_Params = {
      vnp_RequestId: requestId,
      vnp_Version: '2.1.0',
      vnp_Command: 'querydr',
      vnp_TmnCode: vnpayConfig.vnp_TmnCode,
      vnp_TxnRef: orderId,
      vnp_OrderInfo: `Query transaction ${orderId}`,
      vnp_TransactionNo: '',
      vnp_TransDate: transDate,
      vnp_CreateDate: createDate,
      vnp_IpAddr: '127.0.0.1'
    };

    const sortedParams = sortObject(vnp_Params);
    const signData = querystring.stringify(sortedParams, undefined, undefined, { 
      encodeURIComponent: (str) => str 
    });
    
    const hmac = crypto.createHmac('sha512', vnpayConfig.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    
    const requestData = {
      ...vnp_Params,
      vnp_SecureHash: signed
    };

    try {
      const response = await axios.post(vnpayConfig.vnp_ApiUrl, requestData, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      return response.data;
    } catch (error) {
      console.error('Error checking VNPay payment status:', error);
      throw new Error('Failed to check payment status');
    }
  };

  const refundPayment = async (
    orderId: string,
    amount: number,
    transDate: string,
    reason: string
  ) => {
    validateConfig();
    
    const requestId = generateRequestId();
    const createDate = formatDate(new Date());
    
    const vnp_Params = {
      vnp_RequestId: requestId,
      vnp_Version: '2.1.0',
      vnp_Command: 'refund',
      vnp_TmnCode: vnpayConfig.vnp_TmnCode,
      vnp_TransactionType: '03', // Full refund
      vnp_TxnRef: orderId,
      vnp_Amount: amount * 100,
      vnp_OrderInfo: reason,
      vnp_TransDate: transDate,
      vnp_CreateDate: createDate,
      vnp_CreateBy: 'system',
      vnp_IpAddr: '127.0.0.1'
    };

    const sortedParams = sortObject(vnp_Params);
    const signData = querystring.stringify(sortedParams, undefined, undefined, { 
      encodeURIComponent: (str) => str 
    });
    
    const hmac = crypto.createHmac('sha512', vnpayConfig.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    
    const requestData = {
      ...vnp_Params,
      vnp_SecureHash: signed
    };

    try {
      const response = await axios.post(vnpayConfig.vnp_ApiUrl, requestData, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      return response.data;
    } catch (error) {
      console.error('Error processing VNPay refund:', error);
      throw new Error('Failed to process refund');
    }
  };

  return {
    createPaymentUrl,
    verifyReturnUrl,
    createQRPayment,
    checkPaymentStatus,
    refundPayment
  };
};

// Helper functions
function sortObject(obj: any) {
  const sorted: any = {};
  const keys = Object.keys(obj).sort();
  
  for (const key of keys) {
    sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, '+');
  }
  return sorted;
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

function generateRequestId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 5);
}

export type VNPayServiceImpl = typeof vnpayService;