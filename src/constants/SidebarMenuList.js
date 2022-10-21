const listMenuSidebar = [
  {
    title: '',
    scope: ['bo.dashboard'],
    showChildren: true,
    children: [
      {
        title: 'Dashboard', // REAL
        path: '/cong-thanh-toan',
        urlActive: ['/cong-thanh-toan'],
        icon: 'pm pm-dashboard',
        scope: ['bo.dashboard'],
      },
    ],
  },
  {
    title: 'Tài khoản BO',
    scope: ['bo.account.role.search', 'bo.account.search', 'bo.account.scope.search'],
    showChildren: false,
    children: [
      {
        title: 'Quản lý người dùng', //-------REAL
        path: '/cong-thanh-toan/quan-ly-nguoi-dung',
        urlActive: [
          '/cong-thanh-toan/quan-ly-nguoi-dung/cap-nhat',
          '/cong-thanh-toan/quan-ly-nguoi-dung/tao-tai-khoan',
          '/cong-thanh-toan/quan-ly-nguoi-dung/cap-nhat-theo-quyen/[id]',
          '/cong-thanh-toan/user/new-role',
          '/cong-thanh-toan/quan-ly-nguoi-dung/cap-nhat/[id]',
        ],
        icon: 'icon-fa fas fa-users',
        scope: ['bo.account.search'],
      },
      {
        title: 'Quản lý nhóm quyền', //-------REAL
        path: '/cong-thanh-toan/quan-ly-quyen',
        urlActive: ['/cong-thanh-toan/quan-ly-quyen'],
        icon: 'pm pm-link',
        scope: ['bo.account.role.search'],
      },
      {
        title: 'Quản lý scope', //-------REAL
        path: '/cong-thanh-toan/quan-li-quyen',
        urlActive: ['/cong-thanh-toan/quan-li-quyen'],
        icon: 'pm pm-setting',
        scope: ['bo.account.scope.search'],
      },
    ],
  },
  {
    title: 'Vận hành',
    scope: [
      'bo.transaction.search', //------- REAL
      'bo.transaction.viewOnly', //------- REAL
      'bo.transaction.searchMismatchTransaction.action', //------- REAL
      'bo.managementCard.QueryManagementCard',
      'bo.template.search', //------- REAL
      'bo.service.smsemail', //------- REAL
      'bo.supplier.search', //------- REAL
      'bo.operator.systemConfig', //------- REAL
      'bo.transaction.searchPayout', //------- REAL
      'bo.operator.messageMc', //------- REAL
      'bo.eWalletAnnouncement.eWalletAnnounceMerchant',
      'bo.historyAccountLogin.getList',
    ],
    showChildren: false,
    children: [
      {
        title: 'Quản lý giao dịch', //-------REAL
        path: '/cong-thanh-toan/quan-ly-giao-dich',
        urlActive: ['/cong-thanh-toan/quan-ly-giao-dich'],
        icon: 'pm pm-transaction',
        scope: ['bo.transaction.search', 'bo.transaction.viewOnly'],
      },
      {
        title: 'Quản lý chuyển khoản', //-------REAL
        path: '/cong-thanh-toan/quan-ly-chuyen-khoan',
        urlActive: ['/cong-thanh-toan/quan-ly-chuyen-khoan'],
        icon: 'icon-fa fas fa-exchange-alt',
        scope: ['bo.transaction.searchMismatchTransaction.action'],
      },
      {
        title: 'Quản lý thẻ',
        path: '/cong-thanh-toan/quan-ly-the',
        urlActive: ['/cong-thanh-toan/quan-ly-the'],
        icon: 'icon-fa fab fa-cc-visa',
        scope: ['bo.managementCard.QueryManagementCard'],
      },
      {
        title: 'Báo cáo ứng lương',
        path: '/cong-thanh-toan/bao-cao-ung-luong',
        urlActive: ['/cong-thanh-toan/bao-cao-ung-luong'],
        icon: 'pm pm-page',
        scope: ['bo.advanceSalary.reportAdvanceSalary'],
      },
      {
        title: 'Danh sách ứng lương',
        path: '/cong-thanh-toan/danh-sach-ung-luong',
        urlActive: ['/cong-thanh-toan/danh-sach-ung-luong'],
        icon: 'icon-fa fab fa-elementor',
        scope: ['bo.advanceSalary.getAdvanceSalary'],
      },
      {
        title: 'Quản lý template', //-------REAL
        path: '/cong-thanh-toan/quan-ly-template',
        urlActive: ['/cong-thanh-toan/quan-ly-template'],
        icon: 'pm pm-template',
        scope: ['bo.template.search'],
      },
      {
        title: 'Quản lý email-sms', //-------REAL
        path: '/cong-thanh-toan/email-sms/quan-ly',
        urlActive: [
          '/cong-thanh-toan/email-sms/quan-ly',
          '/cong-thanh-toan/email-sms/mc',
          '/cong-thanh-toan/email-sms/lich-su',
        ],
        icon: 'icon-fa fas fa-comment-alt-lines',
        scope: ['bo.service.smsemail'],
      },
      {
        title: 'Giao dịch nhà cung cấp', //-------REAL
        path: '/cong-thanh-toan/giao-dich-nha-cung-cap',
        urlActive: ['/cong-thanh-toan/giao-dich-nha-cung-cap'],
        icon: 'icon-fa fas fa-handshake fa-sm',
        scope: ['bo.supplier.search'],
      },
      {
        title: 'Cấu hình hệ thống', //-------REAL
        path: '/cong-thanh-toan/he-thong',
        urlActive: ['/cong-thanh-toan/he-thong', '/cong-thanh-toan/he-thong/nang-cao'],
        icon: 'icon-fa fas fa-cog',
        scope: ['bo.operator.systemConfig'],
      },
      {
        title: 'Dịch vụ chi hộ / rút tiền', //-------REAL
        path: '/cong-thanh-toan/dich-vu-chi-ho-rut-tien',
        urlActive: ['/cong-thanh-toan/dich-vu-chi-ho-rut-tien'],
        icon: 'icon-fa fas fa-money-check-edit-alt fa-sm',
        scope: ['bo.transaction.searchPayout'],
      },

      {
        title: 'Thông báo', //-------REAL
        path: '/cong-thanh-toan/thong-bao',
        urlActive: ['/cong-thanh-toan/thong-bao'],
        icon: 'pm pm-message',
        scope: ['bo.operator.messageMc'],
      },
      {
        title: 'Quản lí email Merchant',
        path: '/cong-thanh-toan/quan-li-email-merchant',
        urlActive: ['/cong-thanh-toan/quan-li-email-merchant'],
        icon: 'pm pm-dashboard',
        scope: ['bo.eWalletAnnouncement.eWalletAnnounceMerchant'],
      },
      {
        title: 'Lịch sử đăng nhập',
        path: '/cong-thanh-toan/lich-su-dang-nhap',
        urlActive: ['/cong-thanh-toan/lich-su-dang-nhap'],
        icon: 'pm pm-transaction',
        scope: ['bo.historyAccountLogin.getList'],
      },
      {
        title: 'Quản lý website bị chặn',
        path: '/cong-thanh-toan/website-bi-chan',
        urlActive: ['/cong-thanh-toan/website-bi-chan'],
        icon: 'pm pm-transaction',
        scope: null,
      },
      {
        title: 'Danh sách liên quan đến hoạt động đánh bạc và xổ số',
        path: '/cong-thanh-toan/danh-sach-lien-quan-danh-bac',
        urlActive: ['/cong-thanh-toan/danh-sach-lien-quan-danh-bac'],
        icon: 'pm pm-transaction',
        scope: null,
      },
      {
        title: 'Danh sách khủng bố/TTKB',
        path: '/cong-thanh-toan/danh-sach-khung-bo',
        urlActive: ['/cong-thanh-toan/danh-sach-khung-bo'],
        icon: 'pm pm-transaction',
        scope: null,
      }
    ],
  },
  {
    title: 'Đối tác',
    scope: [
      'bo.merchant.searchPending', //------- REAL
      'bo.merchant.searchApprove', //------- REAL
      'bo.accountMerchant.search', //------- REAL
      'bo.account.scope', //------- REAL
      'bo.merchant.searchIndividual', //------- REAL
      'bo.merchant.viewOnly', //------- REAL
      'bo.accountMerchant.passwordTemporary',
      'bo.emailSmsMerchant.sendSms', //------- REAL
      'bo.store.search',
      'bo.account.scopeMClist',
      'bo.merchant.searchAppraisalMc',
      'bo.settingDeposit.search',
    ],
    showChildren: false,
    children: [
      {
        title: 'Duyệt định danh đối tác', //-------REAL
        path: '/cong-thanh-toan/duyet-mc',
        urlActive: ['/cong-thanh-toan/duyet-mc'],
        icon: 'pm pm-page',
        scope: ['bo.merchant.searchPending'],
      },
      {
        title: 'Quản lý đối tác', //-------REAL
        path: '/cong-thanh-toan/quan-ly-mc',
        urlActive: ['/cong-thanh-toan/quan-ly-mc'],
        icon: 'icon-fa fas fa-briefcase',
        scope: [
          'bo.merchant.searchApprove',
          'bo.merchant.searchIndividual',
          'bo.merchant.viewOnly',
        ],
      },
      {
        title: 'Thẩm định',
        path: '/cong-thanh-toan/tham-dinh',
        urlActive: ['/cong-thanh-toan/tham-dinh'],
        icon: 'icon-fa fab fa-elementor',
        scope: ['bo.merchant.searchAppraisalMc'],
      },
      {
        title: 'Quản lý tài khoản', //-------REAL
        path: '/cong-thanh-toan/tai-khoan',
        urlActive: ['/cong-thanh-toan/tai-khoan'],
        icon: 'pm pm-account',
        scope: ['bo.accountMerchant.search'],
      },
      {
        title: 'Gửi thông báo', //-------REAL
        path: '/cong-thanh-toan/gui-thong-bao',
        urlActive: ['/cong-thanh-toan/gui-thong-bao'],
        icon: 'icon-fa fas fa-paper-plane',
        scope: ['bo.emailSmsMerchant.sendSms'],
      },
      {
        title: 'Quản lý điểm GD',
        path: '/cong-thanh-toan/quan-ly-cua-hang',
        urlActive: [
          '/cong-thanh-toan/quan-ly-cua-hang',
          '/cong-thanh-toan/quan-ly-cua-hang/[id]',
          '/cong-thanh-toan/quan-ly-cua-hang/cap-nhat/[id]',
          '/cong-thanh-toan/quan-ly-cua-hang/thanh-vien/[id]',
        ],
        icon: 'pm pm-store',
        scope: ['bo.store.search'],
      },
      {
        title: 'Mật khẩu tạm',
        path: '/cong-thanh-toan/mat-khau-tam',
        urlActive: ['/cong-thanh-toan/mat-khau-tam'],
        icon: 'icon-fa fas fa-key',
        scope: ['bo.accountMerchant.passwordTemporary'],
      },
      {
        title: 'Quản lý scope dashboard',
        path: '/cong-thanh-toan/quan-ly-quyen-dashboard',
        urlActive: ['/cong-thanh-toan/quan-ly-quyen-dashboard'],
        icon: 'pm pm-setting',
        scope: ['bo.account.scopeMClist'],
      },
      {
        title: 'Quản lý ký quỹ',
        path: '/cong-thanh-toan/quan-ly-ky-quy',
        urlActive: ['/cong-thanh-toan/quan-ly-ky-quy'],
        icon: 'icon-fa fas fa-hand-holding-usd',
        scope: ['bo.settingDeposit.search'],
      },
    ],
  },
  {
    title: 'Kế toán',
    scope: [
      'bo.crossCheck.merchant', //------- REAL
      'bo.merchantEwallet.depositWithdrawEwallet',
      'bo.merchantEwallet.searchBalanceMerchant',
      'bo.merchantEwallet.report',
      'bo.revenueStatistics.search', //------- REAL
    ],
    showChildren: false,
    children: [
      {
        title: 'Đối soát doanh nghiệp', //-------REAL
        path: '/cong-thanh-toan/doi-soat-doanh-nghiep',
        urlActive: [
          '/cong-thanh-toan/doi-soat-doanh-nghiep',
          '/cong-thanh-toan/doi-soat-doanh-nghiep/chuyen-tien/[index]',
        ],
        icon: 'pm pm-balances',
        scope: ['bo.crossCheck.merchant'],
      },
      {
        title: 'Lịch sử số dư MC',
        path: '/cong-thanh-toan/lich-su-thay-doi-so-du',
        urlActive: ['/cong-thanh-toan/lich-su-thay-doi-so-du'],
        icon: 'icon-fa icon fas fa-history',
        scope: ['bo.merchantEwallet.searchBalanceMerchant'],
      },
      {
        title: 'Báo cáo số dư đối tác', //-------REAL
        path: '/cong-thanh-toan/bao-cao-so-du-doi-tac',
        scope: ['bo.merchantEwallet.report'],
        urlActive: ['/cong-thanh-toan/bao-cao-so-du-doi-tac'],
        icon: 'pm pm-page',
      },
      {
        title: 'Cộng trừ số dư MC',
        path: '/cong-thanh-toan/cong-tru-so-du-merchants',
        urlActive: ['/cong-thanh-toan/cong-tru-so-du-merchants'],
        icon: 'icon-fa fas fa-exchange-alt',
        scope: ['bo.merchantEwallet.depositWithdrawEwallet'],
      },
    ],
  },
  {
    title: 'Thống kê CTT',
    scope: [
      'bo.gateway.manage',
      'bo.revenueStatistics.search',
      'bo.reportMerchant.reportMerchantAmount',
      'bo.reportMerchant.countMessage',
    ],
    showChildren: false,
    children: [
      {
        title: 'Thống kê top',
        path: '/cong-thanh-toan/thong-ke-top',
        urlActive: ['/cong-thanh-toan/thong-ke-top'],
        icon: 'icon-fa fad fa-plane-departure',
        scope: ['bo.reportMerchant.reportTopTransaction'],
      },
      // {
      //   title: 'Báo cáo',
      //   path: '/cong-thanh-toan/thong-ke-CTT/bao-cao',
      //   urlActive: ['/cong-thanh-toan/thong-ke-CTT/bao-cao'],
      //   icon: 'icon-fa fal fa-comment-alt-lines',
      //   scope: ['bo.reportMerchant.reportTopTransaction'],
      // },
      {
        title: 'Báo cáo hệ thống',
        scope: ['bo.reportMerchant.reportSystemTransaction'],
        path: '/cong-thanh-toan/bao-cao-he-thong',
        urlActive: ['/cong-thanh-toan/bao-cao-he-thong'],
        icon: 'pm pm-dashboard',
      },
      {
        title: 'Thống kê doanh thu',
        scope: ['bo.revenueStatistics.search'],
        path: '/cong-thanh-toan/thong-ke-doanh-thu',
        urlActive: ['/cong-thanh-toan/thong-ke-doanh-thu'],
        icon: 'icon-fa fas fa-analytics',
      },
      {
        title: 'Thống kê giao dịch NCC',
        path: '/cong-thanh-toan/thong-ke-giao-dich-ncc',
        urlActive: ['/cong-thanh-toan/thong-ke-giao-dich-ncc'],
        icon: 'icon-fa fas fa-warehouse',
        scope: ['bo.reportMerchant.countMessage'],
      },
      {
        title: 'Số lượng merchant',
        path: '/cong-thanh-toan/so-luong-merchants',
        urlActive: ['/cong-thanh-toan/so-luong-merchants'],
        icon: 'icon-fa fas fa-atlas',
        scope: ['bo.reportMerchant.reportMerchantAmount'],
      },
    ],
  },
  {
    title: 'Ngân hàng nhà nước',
    scope: [
      'bo.reportMerchant.reportTransaction',
      'bo.ewalletStateBankReport.reportPartner', //------- REAL
      'bo.reportMerchant.getTopMerchant', //------- REAL
      'bo.ewalletStateBankReport.reportPoboOrder',
    ],
    showChildren: false,
    children: [
      {
        title: 'Báo cáo đối tác', //------- REAL
        path: '/cong-thanh-toan/bao-cao-doi-tac',
        urlActive: ['/cong-thanh-toan/bao-cao-doi-tac'],
        icon: 'icon-fa fas fa-portrait',
        scope: ['bo.ewalletStateBankReport.reportPartner'],
      },
      {
        title: 'Báo cáo tình hình GD',
        path: '/cong-thanh-toan/bao-cao-giao-dich',
        urlActive: ['/cong-thanh-toan/bao-cao-giao-dich'],
        icon: 'pm pm-transaction',
        scope: ['bo.reportMerchant.reportTransaction'],
      },
      {
        title: 'Giao dịch nhiều nhất', //------- REAL
        scope: ['bo.reportMerchant.getTopMerchant'],
        path: '/cong-thanh-toan/giao-dich-nhieu-nhat',
        urlActive: ['/cong-thanh-toan/giao-dich-nhieu-nhat'],
        icon: 'icon-fa far fa-credit-card',
      },
      // {
      //   title: 'Báo cáo thu hộ chi hộ',
      //   path: '/cong-thanh-toan/bao-cao-thu-ho-chi-ho',
      //   urlActive: ['/cong-thanh-toan/bao-cao-thu-ho-chi-ho'],
      //   icon: 'pm pm-page',
      //   scope: ['bo.ewalletStateBankReport.reportPoboOrder'],
      // },
    ],
  },
  {
    title: '',
    scope: ['bo.ewalletStateBankReport.getBankPayment'],
    showChildren: true,
    children: [
      {
        className: 'parent-sidebar',
        title: 'Ngân hàng hợp tác', // REAL
        path: '/cong-thanh-toan/ngan-hang-hop-tac',
        urlActive: ['/cong-thanh-toan/ngan-hang-hop-tac'],
        // icon: 'icon-fa fas fa-money-check-alt',
        scope: ['bo.ewalletStateBankReport.getBankPayment'],
      },
    ],
  },
  {
    title: '',
    scope: ['bo.ewalletStateBankReport.reportPoboOrder'],
    showChildren: true,
    children: [
      {
        className: 'parent-sidebar',
        title: 'Thu hộ chi hộ', // REAL
        path: '/cong-thanh-toan/bao-cao-thu-ho-chi-ho',
        urlActive: ['/cong-thanh-toan/bao-cao-thu-ho-chi-ho'],
        // icon: 'pm pm-page',
        scope: ['bo.ewalletStateBankReport.reportPoboOrder'],
      },
    ],
  },
];

export default listMenuSidebar;
