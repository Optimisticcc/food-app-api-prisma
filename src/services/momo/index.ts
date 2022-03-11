import env from '../../configs/env';

import axiosClient from '../axios';
import pkg from 'crypto-js';
const { HmacSHA256 } = pkg;

export const request_momo = async (orde: any) => {
  console.log(env.momo.api_url);
  var partnerCode = env.momo.partner_code;
  var accessKey = env.momo.access_key;
  var secretkey = env.momo.secret_key;
  // @ts-ignore
  var requestId = partnerCode + new Date().getTime();
  // @ts-ignore
  var orderId = 'ORD-' + order._id;
  var orderInfo = 'paywithMoMo';
  var redirectUrl = process.env.WEB_URL + 'checkout/confirm';
  var ipnUrl = `${process.env.API_URL}api/donhangs/momo`;
  var payUrl = '';
  // var ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
  // @ts-ignore
  var amount = order.TongTien;
  var requestType = 'captureWallet';
  var extraData = ''; //pass empty value if your merchant does not have stores
  //before sign HMAC SHA256 with format
  //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
  var rawSignature =
    'accessKey=' +
    accessKey +
    '&amount=' +
    amount +
    '&extraData=' +
    extraData +
    '&ipnUrl=' +
    ipnUrl +
    '&orderId=' +
    orderId +
    '&orderInfo=' +
    orderInfo +
    '&partnerCode=' +
    partnerCode +
    '&redirectUrl=' +
    redirectUrl +
    '&requestId=' +
    requestId +
    '&requestType=' +
    requestType;
  console.log(rawSignature);
  // @ts-ignore
  var signature = HmacSHA256(rawSignature, secretkey).toString();

  //Create the HTTPS objects
  const params = {
    partnerCode: partnerCode,
    accessKey: accessKey,
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    extraData: extraData,
    requestType: requestType,
    signature: signature,
    lang: 'vi',
  };
  console.log(params);
  const url = '/v2/gateway/api/create';
  try {
    const data = await axiosClient.post(url, params);
    // @ts-ignore
    payUrl = data.payUrl;
  } catch (err: any) {
    console.log(err.message);
  }
  //Send the request and get the response

  return payUrl;
};
