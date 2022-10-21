export const defaultLabelStatusTrans = [
  'Số lượng giao dịch xử lý thành công',
  'Giá trị giao dịch xử lý thành công',
  'Số lượng giao dịch xử lý không thành công',
  'Giá trị giao dịch xử lý không thành công',
];

export const defaultLabelUserInfo = [
  'Đơn vị chấp nhận thanh toán (ĐVCNTT)',
  'Khách hàng cá nhân (không bao gồm ĐVCNTT)',
  'Khách hàng tổ chức (không bao gồm ĐVCNTT)',
];

export const defaultLabelHeaderUserInfo = [
  'Tổng số khách hàng',
  'Tổng số Ví điện tử',
  'Tổng số dư Ví điện tử',
];

export const defaultLabelAllStatusTranSystem = [
  'Số lượng giao dịch xử lý thành công',
  'Giá trị giao dịch xử lý thành công',
  'Số lượng giao dịch xử lý không thành công',
  'Giá trị giao dịch không thành công',
  'Số lượng giao dịch thanh toán, chuyển tiền bằng Ví điện tử',
  'Giá trị giao dịch thanh toán, chuyển tiền bằng Ví điện tử',
  'Số lượng giao dịch nạp tiền vào Ví điện tử',
  'Giá trị giao dịch nạp tiền vào Ví điện tử',
  'Số lượng giao dịch rút tiền từ Ví điện tử',
  'Giá trị giao dịch rút tiền từ Ví điện tử',
  'Số lượng giao dịch trong ngày cao điểm',
  'Giá trị giao dịch trong ngày cao điểm',
];

export const defaultLabelStatusTransCustomer = [
  'Số lượng giao dịch xử lý thành công',
  'Giá trị giao dịch xử lý thành công',
  'Số lượng giao dịch thanh toán, chuyển tiền bằng Ví điện tử',
  'Giá trị giao dịch thanh toán, chuyển tiền bằng Ví điện tử',
  'Số lượng giao dịch nạp tiền vào Ví điện tử',
  'Giá trị giao dịch nạp tiền vào Ví điện tử',
  'Số lượng giao dịch rút tiền từ Ví điện tử',
  'Giá trị giao dịch rút tiền từ Ví điện tử',
];

const defaultChildrenHeaderTopTransCustomer = [
  { name: 'Số lượng giao dịch', option: {} },
  { name: 'Giá trị giao dịch', option: {} },
];

export const defaultHeaderTopTransCustomer = [
  { name: 'Tên khách hàng', option: { rowSpan: 2 } },
  { name: 'Tên ví/số hiệu ví', option: { rowSpan: 2 } },
  {
    name: 'Số ĐKKD',
    option: { rowSpan: 2 },
  },
  {
    name: 'Nạp tiền',
    option: { colSpan: 2 },
    children: defaultChildrenHeaderTopTransCustomer,
  },
  {
    name: 'Rút tiền',
    option: { colSpan: 2 },
    children: defaultChildrenHeaderTopTransCustomer,
  },
  {
    name: 'Thanh toán, chuyển',
    option: { colSpan: 2 },
    children: defaultChildrenHeaderTopTransCustomer,
  },
  {
    name: 'Khác',
    option: { colSpan: 2 },
    children: defaultChildrenHeaderTopTransCustomer,
  },
  {
    name: 'Tổng cộng',
    option: { colSpan: 2 },
    children: defaultChildrenHeaderTopTransCustomer,
  },
];

export const defaultHeaderTop5MerchantValueTransaction = [
  'Tên đơn vị',
  'Số ĐKKD',
  'Lĩnh vực hoạt động',
  'Số lượng giao dịch',
  'Giá trị giao dịch',
];

export const defaultHeaderContactBank = ['Tên ngân hàng', 'Ngày triển khai'];
