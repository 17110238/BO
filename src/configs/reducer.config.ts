import { combineReducers } from 'redux';
import AccountMerchant from 'redux/reducers/accountMerchantReducer';
import authReducers from 'redux/reducers/authReducers';
import chartMerchantReducers from 'redux/reducers/chartMerchant';
import crossCheckReducer from 'redux/reducers/crossCheckReducer';
import customerSupportReducer from 'redux/reducers/customerSupportReduces';
import dowloadReducers from 'redux/reducers/dowloadUrlReducers';
import EmailSmsReducer from 'redux/reducers/emailSmsReducer';
import eWalletHistoryLoginReducer from 'redux/reducers/eWalletLoginHistoryReducers';
import walletPaymeTransfer from 'redux/reducers/eWalletPaymeTransferHistoryReducer';
import eWalletReportTransactionReducer from 'redux/reducers/eWalletReportTransactionReducer';
import eWalletTransactionReducer from 'redux/reducers/eWalletTransactionReducer';
import eWalletTransactionReportReducer from 'redux/reducers/eWalletTransactionReportReducer';
import infoCensorReducer from 'redux/reducers/infoCensorReducer';
import informationEmailMerchantReducer from 'redux/reducers/informationEmailMerchantReducer';
import lockedCardReducer from 'redux/reducers/lockedCardReducer';
import manualBankReducer from 'redux/reducers/manualBankReducer';
import merchantInfoReducer from 'redux/reducers/merchantInfoReducer';
import merchantRD from 'redux/reducers/merchantReducer';
import notifyReducer from 'redux/reducers/notifyReducer';
import poboReducer from 'redux/reducers/poboReducer';
import processingFlow from 'redux/reducers/processingFlowReducer';
import quanTityMerchantReducer from 'redux/reducers/quantityMerchantReducer';
import ReportBillReducer from 'redux/reducers/reportBill';
import reportKycReducer from 'redux/reducers/reportKycReducers';
import reportMerchantReducer from 'redux/reducers/reportMerchantReducer';
import reportTelcoReducer from 'redux/reducers/reportTelcoReducer';
import ReportTopUpPhoneReducer from 'redux/reducers/reportTopUpPhoneReducer';
import reportWalletReducer from 'redux/reducers/reportWalletReducer';
import roleManage from 'redux/reducers/roleManageReducer';
import scopeReducer from 'redux/reducers/scopeReducer';
import storeReducer from 'redux/reducers/storeReducer';
import supplierManageReducers from 'redux/reducers/supplierManageReducer';
import templateReducer from 'redux/reducers/templateReducer';
import transaction from 'redux/reducers/transactionReducer';
import transferReducer from 'redux/reducers/transferReducer';
import userReducers from 'redux/reducers/userReducer';
import utilityReducers from 'redux/reducers/utilityReducer';
import versionReducer from 'redux/reducers/versionReducer';
import walletHistoryReducer from 'redux/reducers/walletHistoryReducer';
import walletReducer from 'redux/reducers/walletReducer';
import withdrawalReducer from 'redux/reducers/withdrawalReducer';
import EwalletPartnerService from 'redux/reducers/eWalletPartnerService';
import EwalletReportService from 'redux/reducers/eWalletReportService';
import eWalletReportReducer from 'redux/reducers/eWalletReportReducer';
import eWalletBalanceReducer from 'redux/reducers/eWalletBalanceMerchant';
import loginHistoryReducer from 'redux/reducers/loginHistoryReducer';
import ReportSystem from 'redux/reducers/ReportSystem';
import loanPackageReducer from 'redux/reducers/loanPackageReducer';
import ManagerAccountWalletPaymeReducer from 'redux/reducers/eWalletManagerAccountWalletPaymeReducer';

const rootReducer = combineReducers({
  merchantRD: merchantRD,
  AccountMerchant: AccountMerchant,
  authReducers: authReducers,
  userReducers: userReducers,
  utility: utilityReducers,
  transactions: transaction,
  roleReducer: roleManage,
  scopeReducer: scopeReducer,
  processingFlowReducer: processingFlow,
  chartMerchantReducers: chartMerchantReducers,
  supplierManageReducers,
  withdrawalReducer,
  poboReducer,
  storeReducer: storeReducer,
  templateReducer: templateReducer,
  notifyReducer: notifyReducer,
  EmailSmsReducer: EmailSmsReducer,
  versionReducer: versionReducer,
  dowloadReducer: dowloadReducers,
  reportMerchant: reportMerchantReducer,
  transferReducer: transferReducer,
  lockedCardReducer: lockedCardReducer,
  merchantInfoReducer: merchantInfoReducer,
  walletHistoryReducer: walletHistoryReducer,
  crossCheckReducer: crossCheckReducer,
  customerSupport: customerSupportReducer,
  eWalletTransactionReducer: eWalletTransactionReducer,
  eWalletHistoryLoginReducer: eWalletHistoryLoginReducer,
  wallet: walletReducer,
  walletPaymeTransfer: walletPaymeTransfer,
  quanTityMerchantReducer: quanTityMerchantReducer,
  informationEmailMerchantReducer: informationEmailMerchantReducer,
  manualBankReducer: manualBankReducer,
  eWalletTransactionReportReducer: eWalletTransactionReportReducer,
  infoCensorReducer,
  reportTelcoReducer: reportTelcoReducer,

  reportWalletReducer: reportWalletReducer,
  ReportTopUpPhoneReducer: ReportTopUpPhoneReducer,
  ReportBillReducer: ReportBillReducer,
  EwalletPartnerService,
  EwalletReportService,
  eWalletReportTransactionReducer: eWalletReportTransactionReducer,
  reportKycReducer: reportKycReducer,
  eWalletReportReducer,
  eWalletBalanceReducer: eWalletBalanceReducer,
  loginHistoryReducer: loginHistoryReducer,
  ReportSystem: ReportSystem,
  loanPackageReducer: loanPackageReducer,
  ManagerAccountWalletPaymeReducer: ManagerAccountWalletPaymeReducer,
});

export default rootReducer;
