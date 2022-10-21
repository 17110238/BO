// List E-WALLET SIDEBAR

const ListBankSidebar = [
  {
    header: 'Ví điện tử',
    title: 'Ngân hàng nhà nước',
    scope: null,
    showChildren: false,
    children: [
      {
        title: 'Báo cáo số lượng ví',
        path: '/vi-dien-tu/bao-cao-vi',
        urlActive: ['/vi-dien-tu/bao-cao-vi'],
        icon: 'pm pm-paymentnew',
        scope: null,
      },
      // {
      //   title: 'Báo cáo thu hộ chi hộ',
      //   path: '/vi-dien-tu/bao-cao-thu-ho-chi-ho',
      //   urlActive: ['/vi-dien-tu/bao-cao-thu-ho-chi-ho'],
      //   icon: 'icon-fa far fa-credit-card',
      //   scope: ['bo.ewalletStateBankReport.reportPoboOrder'],
      // },
      {
        title: 'Báo cáo tình hình GD',
        path: '/vi-dien-tu/bao-cao-giao-dich',
        urlActive: ['/vi-dien-tu/bao-cao-giao-dich'],
        icon: 'pm pm-transaction',
        scope: null,
      },
      {
        title: 'Sao kê tài khoản đảm bảo ví',
        path: '/vi-dien-tu/sao-ke-tai-khoan-vi',
        urlActive: ['/vi-dien-tu/sao-ke-tai-khoan-vi'],
        icon: 'icon-fa fas fa-portrait',
        scope: null,
      },
      {
        title: 'Danh sách 10 ví có SLGD nhiều nhất',
        path: '/vi-dien-tu/top-so-luong-giao-dich',
        urlActive: ['/vi-dien-tu/top-so-luong-giao-dich'],
        icon: 'pm pm-page',
        scope: null,
      },
      {
        title: 'Báo cáo tổng quan ví điện tử',
        path: '/vi-dien-tu/bao-cao-tong-quan',
        urlActive: ['/vi-dien-tu/bao-cao-tong-quan'],
        icon: 'pm pm-transaction',
        scope: null,
      },
      {
        title: 'Thống kê giao dịch ví',
        path: '/vi-dien-tu/thong-ke-giao-dich-vi',
        urlActive: ['/vi-dien-tu/thong-ke-giao-dich-vi'],
        icon: 'icon-fa fas fa-chart-line',
        scope: null,
      },
    ],
  },
  {
    title: '',
    scope: null,
    showChildren: true,
    children: [
      {
        className: 'parent-sidebar',
        title: 'Ngân hàng hợp tác',
        path: '/vi-dien-tu/ngan-hang-hop-tac',
        urlActive: ['/vi-dien-tu/ngan-hang-hop-tac'],
        scope: null,
      },
    ],
  },
  {
    header: ' Cổng thanh toán',
    title: 'Ngân hàng nhà nước ',
    scope: null,
    showChildren: false,
    children: [
      {
        title: 'Báo cáo đối tác',
        path: '/cong-thanh-toan/bao-cao-doi-tac',
        urlActive: ['/cong-thanh-toan/bao-cao-doi-tac'],
        icon: 'icon-fa fas fa-portrait',
        scope: null,
      },
      {
        title: 'Báo cáo tình hình GD',
        path: '/cong-thanh-toan/bao-cao-giao-dich',
        urlActive: ['/cong-thanh-toan/bao-cao-giao-dich'],
        icon: 'pm pm-transaction',
        scope: null,
      },
      {
        title: 'Giao dịch nhiều nhất',
        path: '/cong-thanh-toan/giao-dich-nhieu-nhat',
        urlActive: ['/cong-thanh-toan/giao-dich-nhieu-nhat'],
        icon: 'icon-fa far fa-credit-card',
        scope: null,
      },
    ],
  },
  {
    title: '',
    showChildren: true,
    scope: null,
    children: [
      {
        className: 'parent-sidebar',
        title: 'Ngân hàng hợp tác',
        path: '/cong-thanh-toan/ngan-hang-hop-tac',
        urlActive: ['/cong-thanh-toan/ngan-hang-hop-tac'],
        scope: null,
      },
    ],
  },
  // {

  //   title: '',
  //   scope: null,
  //   showChildren: true,
  //   children: [
  //     {
  //       className: 'parent-sidebar',
  //       title: 'Báo cáo tình hình GD',
  //       path: '/cong-thanh-toan/bao-cao-thu-ho-chi-ho',
  //       urlActive: ['/cong-thanh-toan/bao-cao-thu-ho-chi-ho'],
  //       scope: null,
  //     },
  //   ],
  // },
  {
    header: 'Thu hộ chi hộ',
    title: '',
    showChildren: true,
    scope: null,
    children: [
      {
        className: 'parent-sidebar',
        title: 'Ngân hàng hợp tác ',
        path: '/cong-thanh-toan/thu-ho-chi-ho/ngan-hang-hop-tac',
        urlActive: ['/cong-thanh-toan/ngan-hang-hop-tac'],
        scope: null,
      },
    ],
  },
  {
    title: '',
    scope: null,
    showChildren: true,
    children: [
      {
        isDownload: true,
        className: 'parent-sidebar',
        title: 'Form báo cáo TT23/2019',
        path: '',
        urlActive: [''],
        scope: null,
      },
    ],
  },
];

export default ListBankSidebar;
