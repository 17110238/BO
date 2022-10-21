// List E-WALLET SIDEBAR

const ListWalletSidebar = [
  // {
  //   title: '',
  //   showChildren: true,
  //   children: [
  //     {
  //       title: 'Dashboard',
  //       path: '/payme',
  //       urlActive: ['/payme'],
  //       icon: 'pm pm-dashboard',
  //       scope: null,
  //     },
  //   ],
  // },
  {
    title: 'Thống kê',
    scope: [
      'bo.eWalletReport.cardTelco', //-------REAL
      'bo.ewalletReport.reportManualBanking',
      'bo.eWalletTransactionBank.report', //-------REAL
      'bo.ewalletReport.reportSys', //-------REAL
      'bo.ewalletIsecReportBo.reportIsecByAccount', //-------REAL
      'bo.eWalletReport.topupPhone', //-------REAL
      'bo.eWalletReport.linkedBank', //-------REAL
      'bo.ewalletReport.reportKyc',
    ],
    showChildren: false,
    children: [
      {
        title: 'Báo cáo ngân hàng', //-------REAL
        path: '/vi-dien-tu/bao-cao-ngan-hang',
        urlActive: ['/vi-dien-tu/bao-cao-ngan-hang'],
        icon: 'icon-fa fas fa-university',
        scope: ['bo.eWalletTransactionBank.report'],
      },
      {
        title: 'Báo cáo ManualBank',
        path: '/vi-dien-tu/thong-ke-ngan-hang',
        urlActive: ['/vi-dien-tu/thong-ke-ngan-hang'],
        icon: 'pm pm-dashboard',
        scope: ['bo.ewalletReport.reportManualBanking'],
      },
      {
        title: 'Báo cáo Card Telco', //-------REAL
        path: '/vi-dien-tu/quan-ly-telco',
        urlActive: ['/vi-dien-tu/quan-ly-telco'],
        icon: 'pm pm-report',
        scope: ['bo.eWalletReport.cardTelco'],
      },
      {
        title: 'Báo cáo NH liên kết', //-------REAL
        path: '/vi-dien-tu/bao-cao/lien-ket-ngan-hang',
        urlActive: ['/vi-dien-tu/bao-cao/lien-ket-ngan-hang'],
        icon: 'icon-fa far fa-credit-card',
        scope: ['bo.eWalletReport.linkedBank'],
      },
      {
        title: 'Báo cáo iSec', //-------REAL
        path: '/vi-dien-tu/bao-cao-isec',
        urlActive: ['/vi-dien-tu/bao-cao-isec'],
        icon: 'icon-fa fab fa-gripfire',
        scope: ['bo.ewalletIsecReportBo.reportIsecByAccount'],
      },
      {
        title: 'Báo cáo hệ thống', //-------REAL
        path: '/vi-dien-tu/bao-cao-he-thong',
        urlActive: ['/vi-dien-tu/bao-cao-he-thong'],
        icon: 'pm pm-page',
        scope: ['bo.ewalletReport.reportSys'],
      },
      {
        title: 'Báo cáo topup phone', //-------REAL
        path: '/vi-dien-tu/nap-dien-thoai',
        urlActive: ['/vi-dien-tu/report/nap-dien-thoai'],
        icon: 'icon-fa fas fa-analytics',
        scope: ['bo.eWalletReport.topupPhone'],
      },
      {
        title: 'Báo cáo KYC',
        path: '/vi-dien-tu/bao-cao-kyc',
        urlActive: ['/vi-dien-tu/bao-cao-kyc'],
        icon: 'icon-fa fas fa-send-back',
        scope: ['bo.ewalletReport.reportKyc'],
      },
    ],
  },
  {
    title: 'Vận hành',
    scope: [
      'bo.eWalletHistory.search',
      'bo.ewalletTransactionBo.search',
      'bo.ewalletAccount.reCheck',
      'bo.eWallet.approvalKyc', //-------REAL
      'bo.eWallet.autoApprovalKyc', //-------REAL
      'bo.ewalletAccount.supplierTransaction', //-------REAL
      'bo.eWalletAnnouncement.message',
      'bo.eWalletTransactionBank.ewalletTransactionBank',
      'bo.ewalletAccount.search',
      'bo.ewalletAccount.bankLinked', //-------REAL
      'bo.eWalletSetting.config',
      'bo.ewalletAccount.getConnectedUser', //-------REAL
      'bo.ewalletWordfilterBo.getList',
      'bo.ewalletAccount.searchSessions',
      'bo.eWalletTemplateBo.search',
      'bo.eWalletPaymeTransfer.manage',
    ],
    showChildren: false,
    children: [
      {
        title: 'Thông tin khách hàng',
        path: '/vi-dien-tu/thong-tin-khach-hang',
        urlActive: ['/vi-dien-tu/thong-tin-khach-hang'],
        icon: 'pm pm-account',
        scope: ['bo.ewalletAccount.search'],
      },
      {
        title: 'Lịch sử ví',
        path: '/vi-dien-tu/lich-su-vi',
        urlActive: ['/vi-dien-tu/lich-su-vi'],
        icon: 'icon-fa fas fa-history',
        scope: ['bo.eWalletHistory.search'],
      },
      {
        title: 'Cấu hình hệ thống',
        path: '/vi-dien-tu/van-hanh/he-thong',
        urlActive: ['/vi-dien-tu/van-hanh/he-thong'],
        icon: 'icon-fa fas fa-cog',
        scope: ['bo.eWalletSetting.config'],
      },
      {
        title: 'Quản lý template', //-------REAL
        path: '/vi-dien-tu/quan-ly-template',
        urlActive: ['/vi-dien-tu/quan-ly-template'],
        icon: 'pm pm-template',
        scope: ['bo.eWalletTemplateBo.search'],
      },
      {
        title: 'Quản lý giao dịch',
        path: '/vi-dien-tu/lich-su-giao-dich',
        urlActive: ['/vi-dien-tu/lich-su-giao-dich'],
        icon: 'icon-fa fas fa-sync-alt',
        scope: ['bo.ewalletTransactionBo.search'],
      },
      {
        title: 'Quản lý liên kết NH', //-------REAL
        path: '/vi-dien-tu/quan-li-nguoi-dung/lien-ket-ngan-hang',
        urlActive: ['/vi-dien-tu/quan-li-nguoi-dung/lien-ket-ngan-hang'],
        icon: 'icon-fa pm pm-transaction',
        scope: ['bo.ewalletAccount.bankLinked'],
      },
      {
        title: 'Kiểm duyệt thông tin',
        path: '/vi-dien-tu/kiem-duyet-thong-tin',
        urlActive: ['/vi-dien-tu/kiem-duyet-thong-tin'],
        icon: 'icon-fa fa fa-check-square',
        scope: ['bo.ewalletAccount.reCheck'],
      },
      {
        title: 'Duyệt KYC', //-------REAL
        path: '/vi-dien-tu/duyet-kyc',
        urlActive: ['/vi-dien-tu/duyet-kyc'],
        icon: 'icon-fa fa fa-wallet',
        scope: ['bo.eWallet.approvalKyc'],
      },
      {
        title: 'Kiểm duyệt KYC', //-------REAL
        path: '/vi-dien-tu/duyet-kyc-tu-dong',
        urlActive: ['/vi-dien-tu/duyet-kyc-tu-dong'],
        icon: 'icon-fa fas fa-wallet',
        scope: ['bo.eWallet.autoApprovalKyc'],
      },
      {
        title: 'Word-Filter',
        path: '/vi-dien-tu/quan-ly-loc-tu',
        urlActive: ['/vi-dien-tu/quan-ly-loc-tu'],
        icon: 'pm pm-page',
        scope: ['bo.ewalletWordfilterBo.getList'],
      },
      {
        title: 'Chuyển ví',
        path: '/vi-dien-tu/chuyen-vi',
        urlActive: ['/vi-dien-tu/chuyen-vi', '/vi-dien-tu/chuyen-vi/[id]'],
        icon: 'icon-fa fas fa-money-check-alt',
        scope: ['bo.eWalletPaymeTransfer.manage'],
      },
      {
        title: 'Giao dịch nhà cung cấp', //-------REAL
        path: '/vi-dien-tu/giao-dich-nha-cung-cap',
        urlActive: ['/vi-dien-tu/giao-dich-nha-cung-cap'],
        icon: 'pm pm-page',
        scope: ['bo.ewalletAccount.supplierTransaction'],
      },
      {
        title: 'Thông báo khách hàng',
        path: '/vi-dien-tu/thong-bao-khach-hang',
        urlActive: ['/vi-dien-tu/thong-bao-khach-hang'],
        icon: 'pm pm-sms',
        scope: ['bo.eWalletAnnouncement.message'],
      },
      {
        title: 'Giao dịch ngân hàng',
        path: '/vi-dien-tu/giao-dich-ngan-hang',
        urlActive: ['/vi-dien-tu/giao-dich-ngan-hang'],
        icon: 'pm pm-page',
        scope: ['bo.eWalletTransactionBank.ewalletTransactionBank'],
      },
      {
        title: 'Quản lý LK ví', //-------REAL
        path: '/vi-dien-tu/quan-ly-lien-ket-vi',
        urlActive: ['/vi-dien-tu/quan-ly-lien-ket-vi'],
        icon: 'icon-fa fas fa-wallet',
        scope: ['bo.ewalletAccount.getConnectedUser'],
      },
      {
        title: 'Lịch sử đăng nhập', //-------REAL
        path: '/vi-dien-tu/lich-su-dang-nhap',
        urlActive: ['/vi-dien-tu/lich-su-dang-nhap'],
        icon: 'pm pm-transaction',
        scope: ['bo.ewalletAccount.searchSessions'],
      },
    ],
  },

  {
    title: 'Monitor',
    scope: [
      'bo.ewalletTransactionBo.topTransaction', //-------REAL
      'bo.ewalletTransactionBo.searchAlertLogs', //-------REAL
    ],
    showChildren: false,
    children: [
      {
        title: 'Top transaction', //-------REAL
        path: '/vi-dien-tu/quan-ly-top-giao-dich',
        urlActive: ['/vi-dien-tu/quan-ly-top-giao-dich'],
        icon: 'icon-fa fas fa-funnel-dollar',
        scope: ['bo.ewalletTransactionBo.topTransaction'],
      },
      {
        title: 'Quản lí logs', //-------REAL
        path: '/vi-dien-tu/monitor/quan-li-logs',
        urlActive: ['/vi-dien-tu/monitor/quan-li-logs'],
        icon: 'pm pm-dashboard',
        scope: ['bo.ewalletTransactionBo.searchAlertLogs'],
      },
    ],
  },
  {
    title: 'Kế toán',
    scope: [
      'bo.eWalletSupplier.report', //-------REAL
      'bo.ewalletReport.reportCheckSum', //-------REAL
      'bo.ewalletAccount.searchEmployee',
    ],
    showChildren: false,
    children: [
      {
        title: 'Đối tác dịch vụ', //-------REAL
        path: '/vi-dien-tu/tai-khoan/vi-dien-tu/doi-tac',
        urlActive: [
          '/vi-dien-tu/tai-khoan/vi-dien-tu/doi-tac',
          '/vi-dien-tu/tai-khoan/vi-dien-tu/doi-tac/chi-tiet-estio',
          '/vi-dien-tu/tai-khoan/vi-dien-tu/doi-tac/chi-tiet-ocb',
          '/vi-dien-tu/tai-khoan/vi-dien-tu/doi-tac/chi-tiet-vnpay',
        ],
        icon: 'pm pm-page',
        scope: ['bo.eWalletSupplier.report'],
      },
      {
        title: 'Báo cáo tổng hợp số dư ví', //-------REAL
        path: '/vi-dien-tu/tai-khoan/vi-dien-tu/bao-cao',
        urlActive: ['/vi-dien-tu/tai-khoan/vi-dien-tu/bao-cao'],
        icon: 'pm pm-paymentnew',
        scope: ['bo.ewalletReport.reportCheckSum'],
      },
      // {
      //   title: 'Quản lý tài khoản ví nhân viên payme',
      //   path: '/vi-dien-tu/quan-ly-tk-vi-nv-payme',
      //   urlActive: [
      //     '/vi-dien-tu/quan-ly-tk-vi-nv-payme',
      //   ],
      //   icon: 'icon-fa fas fa-wallet',
      //   scope: ['bo.ewalletAccount.searchEmployee'],
      // },
    ],
  },
  {
    title: 'Payment',
    scope: [
      'bo.eWalletPayment.addMoney', //-------REAL
      'bo.eWalletPayment.getDepositBanks', //-------REAL
      'bo.eWalletPayment.getBanks', //-------REAL
    ],
    showChildren: false,
    children: [
      {
        title: 'Cộng trừ số dư ví', //-------REAL
        path: '/vi-dien-tu/nap-rut',
        urlActive: ['/vi-dien-tu/nap-rut'],
        icon: 'pm pm-dashboard',
        scope: ['bo.eWalletPayment.addMoney'],
      },
      {
        title: 'Nạp tiền chuyển khoản thủ công', //-------REAL
        path: '/vi-dien-tu/nap-tien-chuyen-khoan-thu-cong',
        urlActive: ['/vi-dien-tu/nap-tien-chuyen-khoan-thu-cong'],
        icon: 'icon-fa fas fa-money-check-edit-alt fa-sm',
        scope: ['bo.eWalletPayment.getDepositBanks'],
      },
      {
        title: 'Cấu hình chuyển khoản thủ công', //-------REAL
        path: '/vi-dien-tu/cau-hinh-chuyen-khoan-thu-cong',
        urlActive: ['/vi-dien-tu/cau-hinh-chuyen-khoan-thu-cong'],
        icon: 'icon-fa fas fa-cog',
        scope: ['bo.eWalletPayment.getBanks'],
      },
    ],
  },
  {
    title: 'Quản lý dịch vụ',
    scope: [
      'bo.eWalletSocialPaymentBo.searchSocialPay',
      'bo.eWalletSocialPaymentBo.reportSocialPay',
      'bo.ewalletIsecReportBo.getListCode', //-------REAL
      'bo.ewalletIsecReportBo.reportByDayIsec', //-------REAL
      'bo.ewalletIsecReportBo.searchIsecBulk', //-------REAL
      'bo.ewalletFastLoan.getList',
    ],
    showChildren: false,
    children: [
      {
        title: 'Social Payment',
        path: '/vi-dien-tu/quan-ly-link-thanh-toan',
        urlActive: [
          '/vi-dien-tu/quan-ly-link-thanh-toan',
          '/vi-dien-tu/quan-ly-link-thanh-toan/social-link',
          '/vi-dien-tu/quan-ly-link-thanh-toan/bao-cao',
        ],
        icon: 'icon-fa fab fa-staylinked',
        scope: [
          'bo.eWalletSocialPaymentBo.searchSocialPay',
          'bo.eWalletSocialPaymentBo.reportSocialPay',
        ],
      },
      {
        title: 'ISec', //-------REAL
        path: '/vi-dien-tu/quan-ly-isec',
        urlActive: [
          '/vi-dien-tu/quan-ly-isec',
          '/vi-dien-tu/quan-ly-isec/bao-cao-ngay',
          '/vi-dien-tu/quan-ly-isec/bao-cao-giao-dich',
        ],
        icon: 'icon-fa fab fa-gripfire',
        scope: [
          'bo.ewalletIsecReportBo.getListCode',
          'bo.ewalletIsecReportBo.reportByDayIsec',
          'bo.ewalletIsecReportBo.searchIsecBulk',
        ],
      },
      {
        title: 'Quản lý gói vay', //-------REAL
        path: '/vi-dien-tu/quan-ly-goi-vay',
        urlActive: ['/vi-dien-tu/quan-ly-goi-vay'],
        icon: 'icon-fa fas fa-wallet',
        scope: ['bo.ewalletFastLoan.getList'],
      },
    ],
  },
  {
    title: 'Ngân hàng nhà nước',
    scope: [
      'bo.ewalletStateBankReport.reportAccountAmount', //-------REAL
      'bo.ewalletStateBankReport.reportEwalletHistory', //-------REAL
      'bo.ewalletStateBankReport.formReport',
      // 'bo.ewalletStateBankReport.reportPoboOrder', //-------REAL
    ],
    showChildren: false,
    children: [
      {
        title: 'Báo cáo số lượng ví',
        path: '/vi-dien-tu/bao-cao-vi',
        urlActive: ['/vi-dien-tu/bao-cao-vi'],
        icon: 'pm pm-paymentnew',
        scope: ['bo.ewalletStateBankReport.reportAccountAmount'],
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
        scope: ['bo.ewalletStateBankReport.reportEwalletHistory'],
      },
      {
        title: 'Mẫu báo cáo',
        path: '/vi-dien-tu/mau-bao-cao',
        urlActive: ['/vi-dien-tu/mau-bao-cao'],
        icon: 'pm pm-bank-report',
        scope: ['bo.ewalletStateBankReport.formReport'],
      },
    ],
  },
  {
    title: '',
    scope: [
      'bo.ewalletStateBankReport.getBanks', //----- REAL
    ],
    showChildren: true,
    children: [
      {
        className: 'parent-sidebar',
        title: 'Ngân hàng hợp tác', //----- REAL
        path: '/vi-dien-tu/ngan-hang-hop-tac',
        urlActive: ['/vi-dien-tu/ngan-hang-hop-tac'],
        scope: ['bo.ewalletStateBankReport.getBanks'],
      },
    ],
  },
  {
    title: 'Thống kê ví',
    scope: [
      'bo.eWalletHistory.appHistoryTransaction', //-------REAL
      'bo.reportMerchant.reportSDKIncome', //-------REAL
      'bo.ewalletReport.reportUser', //-------REAL
    ],
    showChildren: false,
    children: [
      {
        title: 'Thống kê các dịch vụ ví', //-------REAL
        path: '/vi-dien-tu/thong-ke-vi/dich-vu-vi',
        urlActive: [
          '/vi-dien-tu/thong-ke-vi/dich-vu-vi',
          '/vi-dien-tu/thong-ke-vi/dich-vu-vi/[id]',
        ],
        icon: 'pm pm-paymentnew',
        scope: ['bo.eWalletHistory.appHistoryTransaction'],
      },
      {
        title: 'Thống kê doanh thu SDK', //-------REAL
        scope: ['bo.reportMerchant.reportSDKIncome'],
        path: '/vi-dien-tu/thong-ke-vi/thong-ke-doanh-thu-sdk',
        urlActive: ['/vi-dien-tu/thong-ke-vi/thong-ke-doanh-thu-sdk'],
        icon: 'icon-fa fas fa-luggage-cart',
      },
      {
        title: 'Thống kê người dùng', //-------REAL
        scope: ['bo.ewalletReport.reportUser'],
        path: '/vi-dien-tu/thong-ke-vi/thong-ke-nguoi-dung',
        urlActive: ['/vi-dien-tu/thong-ke-vi/thong-ke-nguoi-dung'],
        icon: 'icon-fa fa fa-users',
      },
    ],
  },
];

export default ListWalletSidebar;
