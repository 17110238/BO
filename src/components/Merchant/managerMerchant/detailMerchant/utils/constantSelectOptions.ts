import { MaxRangeBusinessEnum } from 'models';

export const optionRangeBussiness = [
  { value: MaxRangeBusinessEnum.less100m, label: 'Dưới 100 triệu VND' },
  { value: MaxRangeBusinessEnum.max1b, label: 'Từ 100 triệu - 1 tỷ VND' },
  { value: MaxRangeBusinessEnum.max10b, label: 'Từ 1 tỷ - 10 tỷ VND' },
  { value: MaxRangeBusinessEnum.up10b, label: 'Trên 10 tỷ VND' },
];

export const serviceOptions = [
  { value: 'WL1', label: 'Dịch vụ thường (WL1)' },
  { value: 'WL2', label: 'Dịch vụ công (WL2)' },
  { value: 'WL3', label: 'Dịch vụ đặc thù (WL3)' },
  { value: 'ECOM1', label: 'Dịch vụ thu hộ (ECOM1)' },
];

export const typeOption = [
  { value: 'DEFAULT', label: 'DEFAULT' },
  { value: 'MANUAL', label: 'MANUAL' },
];

export const bussinessOption = [
  { value: '4', label: 'Loại hình khác' },
  { value: '1', label: 'Phí vệ sinh, cầu đường, nộp thuế, vận tải công cộng' },
  { value: '2', label: 'Siêu thị, trường học, nạp điện thoại, thanh toán HĐ' },
  { value: '3', label: 'Nhà hàng thức ăn nhanh' },
];

export const supplierOption_1 = [
  { value: 'ALIPAY', label: 'ALIPAY' },
  { value: 'GCASH', label: 'GCASH' },
  { value: 'KAKAO_PAY', label: 'KAKAO_PAY' },
  { value: 'TOUCH_N_GO', label: 'TOUCH_N_GO' },
  { value: 'TRUE_MONEY', label: 'TRUE_MONEY' },
  { value: '2C2P', label: '2C2P' },
];

export const supplierOption_2 = [
  { value: 'SACOMBANK', label: 'SACOMBANK' },
  { value: 'VPBANK', label: 'VPBANK' },
];

export const supplierOption_3 = [
  { value: 'PVCOMBANK', label: 'PVCOMBANK' },
  { value: 'MSBANK', label: 'MSBANK' },
  { value: 'VNPAY', label: 'VNPAY' },
];

export const authOptions = [
  { value: 'PASSWORD', label: 'PASSWORD' },
  { value: 'OTP', label: 'OTP' },
  { value: 'NONE', label: 'NONE' },
];

export const crossOptions = [
  { value: 'AUTO', label: 'Tự động' },
  { value: 'MANUAL', label: 'Thủ công' },
  { value: 'OFF', label: 'Không đối soát' },
];

export const currencyOptions = [
  { value: 'VND', label: 'VND' },
  { value: 'USD', label: 'USD' },
  { value: 'CNY', label: 'CNY' },
];

export const optionTypeMC = [
  { value: 'INDIVIDUAL', label: 'Cá nhân (Việt Nam)' },
  { value: 'ENTERPRISE', label: 'Doanh nghiệp (Việt Nam)' },
  { value: 'FOREIGN_INDIVIDUAL', label: 'Cá nhân (Quốc tế)' },
  { value: 'FOREIGN_ENTERPRISE', label: 'Doanh nghiệp (Quốc tế)' },
  { value: 'SPECIAL_ENTERPRISE', label: 'Doanh nghiệp (Special)' },
  { value: 'SPECIAL_INDIVIDUAL', label: 'Cá Nhân (Special)' },
];

export const forexType = [
  { value: 'REUTER', label: 'REUTER' },
  { value: 'VCB', label: 'VCB' },
  { value: 'VCB_SELL', label: 'VCB_SELL' },
  { value: 'VCB_BUY', label: 'VCB_BUY' },
];
