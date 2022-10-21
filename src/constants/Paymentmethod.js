const renderMethod = (method) => {
  if (!method) return;

  switch (method) {
    case 'PAYME':
      return 'Ví PayME';
    case 'ATM':
      return 'Thẻ ATM';
    case 'ALIPAY_DIRECT':
      return 'Alipay Offline';
    case 'ALIPAY_ECOMMERCE':
      return 'Alipay Online';
    case 'ALIPAY_ECOMMERCE':
      return 'Alipay Online';
    case 'ISEC':
      return 'ISEC';
    case 'MANUAL_BANK':
      return 'Chuyển Khoản';
    case 'VN_PAY':
      return 'QR Pay';
    case 'XNAP':
      return 'XNAP';
    case 'THAIQR':
      return 'Thai QR';
    case 'CREDIT':
      return 'Thẻ quốc tế (VN)';
    case 'MOMO':
      return 'Ví MoMo';
    case 'ZALO_PAY':
      return 'Ví ZaloPay';
    case 'WEBMONEY':
      return 'Ví WebMoney';
    case 'CREDIT_INTERNATIONAL':
      return 'Thẻ quốc tế (QT)';
    case 'PAYNOW':
      return 'PayNow';
    case 'WECHAT':
      return 'Wechat';
    case 'VIETQR':
      return 'VietQR';
    case 'PAYME_CREDIT':
      return 'Tín Dụng PayME';
    case 'PIPAY':
      return 'PIPAY';
    case "FACE_ID":
      return "FaceID";
   
    default:
      return method;
  }
};
export default renderMethod
