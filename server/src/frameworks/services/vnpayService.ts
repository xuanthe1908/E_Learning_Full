import configKeys from '../../config';
import * as crypto from 'crypto';
import * as querystring from 'querystring';

export const vnpayService = () => {
  const vnpayConfig = {
    vnp_TmnCode: configKeys.VNPAY_TMN_CODE || '',
    vnp_HashSecret: configKeys.VNPAY_HASH_SECRET || '',
    vnp_Url: configKeys.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    vnp_ReturnUrl: configKeys.VNPAY_RETURN_URL || 'http://localhost:3000/payment/vnpay/return'
  };

  const createPaymentUrl = (
    amount: number,
    orderInfo: string,
    orderId: string,
    ipAddr: string
  ) => {
    const date = new Date();
    const createDate = formatDate(date);
    
    let vnp_Params: any = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: vnpayConfig.vnp_TmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: 'other',
      vnp_Amount: amount * 100, // VNPay yêu cầu amount * 100
      vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate
    };

    // Sắp xếp tham số theo thứ tự alphabet
    vnp_Params = sortObject(vnp_Params);

    const signData = querystring.stringify(vnp_Params, undefined, undefined, { encodeURIComponent: str => str });
    const hmac = crypto.createHmac('sha512', vnpayConfig.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;

    const paymentUrl = vnpayConfig.vnp_Url + '?' + querystring.stringify(vnp_Params, undefined, undefined, { encodeURIComponent: (str) => str });
    
    return paymentUrl;
  };

  const verifyReturnUrl = (vnp_Params: any) => {
    const secureHash = vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    const sortedParams = sortObject(vnp_Params);
    const signData = querystring.stringify(sortedParams, undefined, undefined, { encodeURIComponent: str => str });
    const hmac = crypto.createHmac('sha512', vnpayConfig.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    return secureHash === signed;
  };

  const createQRPayment = async (
    amount: number,
    orderInfo: string,
    orderId: string
  ) => {
    const date = new Date();
    const createDate = formatDate(date);
    
    // Tạo QR code data theo VNPay QR format
    const qrData = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: vnpayConfig.vnp_TmnCode,
      vnp_Amount: amount * 100,
      vnp_CreateDate: createDate,
      vnp_CurrCode: 'VND',
      vnp_IpAddr: '127.0.0.1',
      vnp_Locale: 'vn',
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: 'other',
      vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
      vnp_TxnRef: orderId
    };

    const sortedData = sortObject(qrData);
    const signData = querystring.stringify(sortedData, undefined, undefined, { encodeURIComponent: str => str });
    const hmac = crypto.createHmac('sha512', vnpayConfig.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    return {
      qrCode: `${vnpayConfig.vnp_Url}?${signData}&vnp_SecureHash=${signed}`,
      paymentData: {
        ...qrData,
        vnp_SecureHash: signed
      }
    };
  };

  return {
    createPaymentUrl,
    verifyReturnUrl,
    createQRPayment
  };
};

// Helper functions
function sortObject(obj: any) {
  const sorted: any = {};
  const str = [];
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (const key of str) {
    sorted[decodeURIComponent(key)] = encodeURIComponent(obj[decodeURIComponent(key)]).replace(/%20/g, '+');
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

export type VNPayServiceImpl = typeof vnpayService;