export enum BUTTON_CONFIG_ENUM {
  CONFIG_VERSION_APP = 'CONFIG_VERSION_APP',
  CONFIG_VERSION_SDK = 'CONFIG_VERSION_SDK',
  CONFIG_TRANSACTION_LIST = 'CONFIG_TRANSACTION_LIST',
  CONFIG_SUPPLIER_LIST = 'CONFIG_SUPPLIER_LIST',
  CONFIG_ISSUER_LIST = 'CONFIG_ISSUER_LIST',
}

export const items = [
  {
    title: 'Quản lý ứng dụng',
    childrens: [
      {
        title: 'Quản lý phiên bản <br/> ứng dụng',
        srcImg: '/assets/img/system-config/version-control.png',
        constant: BUTTON_CONFIG_ENUM.CONFIG_VERSION_APP,
      },
      {
        title: 'Quản lý phiên bản SDK',
        srcImg: '/assets/img/system-config/sdk.png',
        constant: BUTTON_CONFIG_ENUM.CONFIG_VERSION_SDK,
      },
    ],
  },
  {
    title: 'Danh sách thanh toán',
    childrens: [
      {
        title: 'Cấu hình danh sách <br/> ngân hàng',
        srcImg: '/assets/img/system-config/bank-manager.png',
        constant: BUTTON_CONFIG_ENUM.CONFIG_TRANSACTION_LIST,
      },
      {
        title: 'Cấu hình danh sách  <br/> nhà phát hành',
        srcImg: '/assets/img/system-config/provider.png',
        constant: BUTTON_CONFIG_ENUM.CONFIG_ISSUER_LIST,
      },
      {
        title: 'Cấu hình danh sách  <br/> nhà cung cấp',
        srcImg: '/assets/img/system-config/supplier.png',
        constant: BUTTON_CONFIG_ENUM.CONFIG_SUPPLIER_LIST,
      },
    ],
  },
];

export const serviceOptions = [
  { label: 'PayME Credit', value: 'PayMECredit' },
  { label: 'ATM Deposit', value: 'ATM_Deposit' },
  { label: 'ATM Withdraw', value: 'ATM_Withdraw' },
  { label: 'ATM Payment', value: 'ATM_Payment' },
  { label: 'BILL', value: 'BILL' },
  { label: 'ATM', value: 'ATM' },
  { label: 'Visa', value: 'Visa' },
  { label: 'MasterCard', value: 'MasterCard' },
  { label: 'Vay nhanh', value: 'FAST_LOAN' },
];

export const statusOptions = [
  { label: 'Hoạt động', value: true },
  { label: 'Ngừng hoạt động', value: false },
];
