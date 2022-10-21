export enum BUTTON_CONFIG_ENUM {
  CONFIG_VERSION = 'CONFIG_VERSION',
  CONFIG_TRANSACTION_VALUE = 'CONFIG_TRANSACTION_VALUE',
  UPDATE_TRANSACTION_VALUE = 'UPDATE_TRANSACTION_VALUE',
  CONFIG_DEFAULT_FEE = 'CONFIG_DEFAULT_FEE',
}

export const items = [
  {
    title: 'Quản lý ứng dụng',
    childrens: [
      {
        title: 'Quản lý phiên bản',
        srcImg: '/assets/img/system-config/version-control.png',
        constant: BUTTON_CONFIG_ENUM.CONFIG_VERSION,
      },
    ],
  },
  {
    title: 'Cấu hình phí / Giá trị',
    childrens: [
      {
        title: 'Cấu hình giá trị giao dịch',
        srcImg: '/assets/img/system-config/cost.png',
        constant: BUTTON_CONFIG_ENUM.CONFIG_TRANSACTION_VALUE,
      },
      {
        title: 'Cấu hình phí mặc định',
        srcImg: '/assets/img/system-config/subscription.png',
        constant: BUTTON_CONFIG_ENUM.CONFIG_DEFAULT_FEE,
      },
    ],
  },
];
