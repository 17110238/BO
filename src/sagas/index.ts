import { all, fork } from 'redux-saga/effects';
import authSaga from 'sagas/authSaga/auth.saga';
import changePassAuth from 'sagas/authSaga/changePasswordAuth';
import getListRole from 'sagas/roleManage/getListRole';
import getListScope from 'sagas/roleManage/getListScope';
import updateScopeRole from 'sagas/roleManage/updateScopeRole';
import createScope from 'sagas/scopeSaga/createScope.saga';
import deleteScope from 'sagas/scopeSaga/deleteScope.saga';
import updateScope from 'sagas/scopeSaga/updateScope.saga';
import createUser from 'sagas/userSaga/createUser';
import createUserScope from 'sagas/userSaga/createUserScope';
import getDetailUser from 'sagas/userSaga/getDetailUser';
import updateUser from 'sagas/userSaga/updateUser';
import updateUserScope from 'sagas/userSaga/updateUserScope';
import getLocationCity from 'sagas/utility/getLocationCityList';
import getMccCode from 'sagas/utility/getMccCodeList';
import getPaymentMethods from 'sagas/utility/getPaymentMethodList';
import getSubLocation from 'sagas/utility/getSubLocationList';
import accountMerchantSaga from '../api/graphql/sagas/accountMerchant.saga';
import managerUserPayMESaga from '../api/graphql/sagas/managerUserPayME.saga';
import CancelCrossCheck from './accountantCrossCheck/cancelCrossCheck';
import completeCrossCheck from './accountantCrossCheck/completeCrossCheck';
import ContinuePauseCrossCheck from './accountantCrossCheck/continuePauseCrossCheck';
import createAccountantCrossCheck from './accountantCrossCheck/createAccountantCrossCheck';
import exportAccountantCrossCheck from './accountantCrossCheck/exportAccountantCrossCheck';
//Accountant
import approveCrossCheck from './accountantCrossCheck/approveCrosskCheck';
import getListAccountantCrossCheck from './accountantCrossCheck/getListAccountantCrossCheck';
import PauseCrossCheck from './accountantCrossCheck/pauseCrossCheck';
import rejectCrossCheck from './accountantCrossCheck/rejectCrossCheck';
import updateStateCrossCheck from './accountantCrossCheck/updateStateCrossCheck';
import updateStateDepositFinalProcess from './accountantCrossCheck/updateStateDepositFinalProcess';
import transferCrosskCheck from './accountantCrossCheck/transferCrosskCheck';
//Accountant
import getListRoles from './accountMerchant/getListRoleAccMc';
import getListSaleAccount from './accountMerchant/getListSaleAccount';
import passwordTemporary from './accountMerchant/passwordTemporary';
import requestActiveAccount from './accountMerchant/requestActiveAccMc';
import searchAccountMerchant from './accountMerchant/searchAccountMerchant';
import unlockAccountMc from './accountMerchant/unlockAccountMc';
import updateAccountMerchant from './accountMerchant/updateAccountMerchant';
import updateActiveAccMc from './accountMerchant/updateActiveAccMc';
import updatePassword from './accountMerchant/updatePassword';
import alertLogs from './alertLogs/getAlertLogs';
import getListRoleOfAppUserAPI from './authSaga/getListRoleOfAuth.saga';
import getReportMerchant from './chartMerchant/getListMerchantsReport';
import getMerchantTypeReport from './chartMerchant/getListMerchantTypeReport';
import getTopIncomeMerchant from './chartMerchant/getListTopIncomeMerchant';
import getLocationReport from './chartMerchant/getPaymentLocationsReport';
import getPaymentMethodReport from './chartMerchant/getPaymentMethodReport';
import createCttCoopBankSaga from './cttCooperativeBanks/createCoopBankSaga';
import getCttCoopBankListSaga from './cttCooperativeBanks/getCoopBankListSaga';
import updateCttCoopBankSaga from './cttCooperativeBanks/updateCoopBankSaga';
import exportLoginHistory from './cttLoginHistory/exportLoginHistory';
import getLoginHistory from './cttLoginHistory/getLoginHistory';
import cttGetReportTransaction from './cttReportTransaction/cttGetReportTransaction';
import addReplyTicket from './customerSupport/addRelyDashBoardTicket';
import addTicket from './customerSupport/addTicket';
import getAssignTarget from './customerSupport/getAssignTarget';
import getDataDashBoardTicket from './customerSupport/getDataDashBoardTicket';
import getDetailCustomerSupport from './customerSupport/getDetailCustomerSupport';
import getDetailDataDashBoardTicket from './customerSupport/getDetailDataDashBoardTicket';
import getFilterValueCustomerSupport from './customerSupport/getFilterValue';
import getListCustomerSupport from './customerSupport/getListCustomerSupport';
import getLogsCustomerSupport from './customerSupport/getLog';
import getListReplyTicket from './customerSupport/getRelyDashBoardTicket';
import getSupportStaff from './customerSupport/getSupportStaff';
import sendMailCustomerSupport from './customerSupport/sendMail';
import setStateDashBoardTicket from './customerSupport/setStateDashBoardTicket';
import updateTicket from './customerSupport/updateTicket';
import addMoneyDepositWithdraw from './depositWithdraw/addMoney';
import DepositWithdrawEwallet from './depositWithdrawEwallet';
import createEmailSmsProduct from './emailSms/createEmailSmsProduct';
import getEmailSmsHistory from './emailSms/getEmailSmsHistory';
import getEmailSmsMerchant from './emailSms/getEmailSmsMerchant';
import getEmailSmsProduct from './emailSms/getEmailSmsProduct';
import updateEmailSmsProduct from './emailSms/updateEmailSmsProduct';
import getChangedEwalletAccountInfo from './eWalletAccount/getChangedEwalletAccountInfo';
import getListConnectedUser from './eWalletAccount/getListConnectedUser';
import unlinkConnectedUser from './eWalletAccount/unlinkConnectedUser';
import ExportSearchBalanceMerchant from './eWalletBalanceMerchant/exportBalanceMerchant';
import getlistBalanceMerchant from './eWalletBalanceMerchant/getListBalanceMerchant';
import getListEwalletBankReportBillTT23 from './eWalletBankReport/getListEwalletBankReportBillTT23Saga';
import getListEwalletBankReportDetailEwalletTT23 from './eWalletBankReport/getListEwalletBankReportDetailEwalletTT23Saga';
import getListEwalletBankReportEwalletTT23 from './eWalletBankReport/getListEwalletBankReportEwalletTT23Saga';
import getListEwalletBankReportMerchantTT23 from './eWalletBankReport/getListEwalletBankReportMerchantTT23Saga';
import exportEwalletBankTransaction from './eWalletBankTransaction/exportEwalletBankTransactionSaga';
import getListEwalletBankTransactionReport from './eWalletBankTransaction/getListEwalletBankTransactionReport';
import getListEwalletBankTransaction from './eWalletBankTransaction/getListEwalletBankTransactionSaga';
import getListCodeEWalletIsec from './eWalletIsecReport/getListCodeEWalletIsecSaga';
import getListEWalletIsecReportByAccount from './eWalletIsecReport/getListEWalletIsecReportByAccountSaga';
import getListEWalletIsecReport from './eWalletIsecReport/getListEWalletIsecReportSaga';
import getListEWalletIsecReportTransaction from './eWalletIsecReport/getListEWalletIsecReportTransactionSaga';
import getDataListHistoryLogin from './eWalletLoginHistory/getDataListWalletLoginHistory';
import exportPartnerService from './eWalletPartnerService/exportPartnerService';
import getBankReport from './eWalletPartnerService/getBankReport';
import getEwalletGateReport from './eWalletPartnerService/getEwalletGateReport';
import getEwalletHistoryReport from './eWalletPartnerService/getEwalletHistoryReport';
import getEwalletServiceBillReport from './eWalletPartnerService/getEwalletServiceBillReport';
import getEwalletSsccReport from './eWalletPartnerService/getEwalletSsccReport';
import addPaymeTransfer from './eWalletPaymeTransfer/addPaymeTransfer';
import confirmPaymeTransfer from './eWalletPaymeTransfer/confirmPaymeTransfer';
import createCommandPaymeTransfer from './eWalletPaymeTransfer/createCommandPaymeTransfer';
import getDetailPaymeTransfer from './eWalletPaymeTransfer/getDetailPaymeTransfer';
import getListPaymeTransferHistory from './eWalletPaymeTransfer/getListPaymeTransferHistory';
import getListPaymeTransferLog from './eWalletPaymeTransfer/getListPaymeTransferLog';
import reportUserFileExport from './EwalletReport/exportFile';
import getEwalletReportSaga from './EwalletReport/getEwalletReport';
import getReportUser from './EwalletReport/getReportUser';
import getStatisticUser from './EwalletReport/getStatisticUser';
import getReportCustomer from './eWalletReportService/getReportCustomer';
import eWalletReportTransaction from './eWalletReportTransaction/getReportTransaction';
import getListReportEwalletSocial from './eWalletSocialPayment/getListReportEwalletSocialSaga';
import getListEWalletSocialPayment from './eWalletSocialPayment/getListSocialPaymentSaga';
import eWalletTransaction from './eWalletTransaction';
import eWalletTransactionFileExport from './eWalletTransaction/exportFile';
import getEWalletTransactionDetails from './eWalletTransaction/getEWalletTransactionDetails';
import getTopTransactionByAccountAmount from './eWalletTransaction/getListTransactionAccountAmount';
import getListEWalletTransactionSupplier from './eWalletTransaction/getListTransactionSupplier';
import getServiceSearchTransaction from './eWalletTransaction/getServiceSearchTransaction';
import getTopTransactionByAccount from './eWalletTransaction/getTopTransactionByAccount';
import getTopTransactionByDate from './eWalletTransaction/getTopTransactionByDate';
import eWalletTransactionRefund from './eWalletTransaction/refund';
import getListEWalletFillter from './eWalletWordFillter/getListEWalletWordFillter';
import updateEWalletFillter from './eWalletWordFillter/updateEWalletWordFillter';
import accountExport from './exportFile/accountExport';
import handleDowload from './exportFile/handleDowload';
import merchantExport from './exportFile/merchantExport';
import merchantExportSoxket from './exportFile/merchantExportSoxket';
import transactionExport from './exportFile/transactionExport';
import getListAvatarImage from './infoCensor/avatarImage';
import refuseAliasName from './infoCensor/refuseAliasName';
import refuseAvatar from './infoCensor/refuseAvatar';
import updateAliasName from './infoCensor/updateAliasName';
import exportEmailMerchant from './informationEmailMerchant/exportEmailMerchant';
import getInformationEmailMerchantSaga from './informationEmailMerchant/getInformationEmailMerchantSaga';
import resendEmailMerchant from './informationEmailMerchant/resendEmailMerchant';
import getLinkedBanks from './linkedBanks/getLinkedBanks';
import unlinkBank from './linkedBanks/unlinkBank';
import lockedCards from './lockedCards';
import getLockedCards from './lockedCards/getLockedCards';
import updateLockedCard from './lockedCards/updateLockedCard';
import createBankTransferTransaction from './manualBank/createBankTransferTransaction';
import CreateDeposit from './manualBank/CreateDeposit';
import getListAccountBank from './manualBank/getListAccountBank';
import getListBank from './manualBank/getListBank';
import getListDeposit from './manualBank/getListDeposit';
import getListManualBank from './manualBank/getListManualBank';
import updateDeposit from './manualBank/updateDeposit';
import updateDepositPayment from './manualBank/updateDepositPayment';
import addDelegateMerchant from './merchant/addDelegateMerchantSaga';
import approveMerchant from './merchant/approveMerchantSaga';
import approvePendingMerchant from './merchant/approvePendingMerchantSaga';
import changePasswordMerchant from './merchant/changePasswordMerchantSaga';
import createAccountMerchant from './merchant/createMerchantSaga';
import createSettlementMerchant from './merchant/createSettlementMerchantSaga';
import disableMailSettlementMerchant from './merchant/disableMailSettlementMerchantSaga';
import getAccountActiveInfo from './merchant/getAccountActiveInfo';
import getBussinessDetail from './merchant/getBussinessDetailSaga';
import getChangedInfoMC from './merchant/getChangedInfoSaga';
import getDefaultMerchantFee from './merchant/getDefaultMerchantFeeSaga';
import getImageMerchant from './merchant/getImageMerchantSaga';
import getListDelegateMC from './merchant/getListDelegateMCSaga';
import getLogTransactionFee from './merchant/getLogTransactionFeeSaga';
import getMerchantActiveInfo from './merchant/getMerchantActiveInfo';
import getMerchantFee from './merchant/getMerchantFeeSaga';
import getMerchantLogSaga from './merchant/getMerchantLogSaga';
import getPendingListMerchant from './merchant/getPendingListMerchantSaga';
import getProfileMerchant from './merchant/getProfileMerchantSaga';
import getTotalPendingMerchant from './merchant/getTotalPendingMerchantSaga';
import rejectMerchant from './merchant/rejectMerchantSaga';
import rejectPendingMerchant from './merchant/rejectPendingMerchantSaga';
import requestActiveMerchant from './merchant/requestActiveMerchantSaga';
import requestUpdateInfoMerchant from './merchant/requestUpdateInfoMerchantSaga';
import requestUpdateMerchantFee from './merchant/requestUpdateMerchantFeeSaga';
import resendMailApprovalMerchant from './merchant/resendMailApprovalMerchantSaga';
import searchApprovalMerchant from './merchant/searchApprovalMerchantSaga';
import searchExpertiseMerchant from './merchant/searchExpertiseMerchantSaga';
import searchMerchant from './merchant/searchMerchantSaga';
import sendContractMC from './merchant/sendContractMerchantSaga';
import updateActiveAccountMerchant from './merchant/updateActiveAccountMerchantSaga';
import updateActiveMerchant from './merchant/updateActiveMerchantSaga';
import updateConfigFeeMerchant from './merchant/updateConfigFeeMerchantSaga';
import updateContractMerchant from './merchant/updateContractMerchantSaga';
import updateInfoMerchant from './merchant/updateInfoMerchantSaga';
import getMerchantChangeHistory from './merchantInfo/getMerchantChangeHistory';
import getMerchantInforList from './merchantInfo/getMerchantInforList';
import getMerchantLinkedBanks from './merchantInfo/getMerchantLinkedBanks';
import getMerchantSessions from './merchantInfo/getMerchantSessions';
import getMerchantTransactionHistory from './merchantInfo/getMerchantTransactionHistory';
import getMerchantTransactionReport from './merchantInfo/getMerchantTransactionReport';
import requestCancelMerchantWallet from './merchantInfo/requestCancelMerchantWallet';
import resetMerchantPassword from './merchantInfo/resetMerchantPassword';
import searchMerchantInfo from './merchantInfo/searchMerchantInfo';
import unlockKyc from './merchantInfo/unlockKyc';
import updateAccountInfoEWallet from './merchantInfo/updateAccountInfoEWalletSaga';
import requestChangedMessage from './message/getRequestChangedMessage';
import sendMail from './message/sendEmail';
import requestMessage from './message/sendRequestMessage';
import sendTestMail from './message/sendTestMail';
import updateNotificationCustomer from './notificationCustomer/updateNotificationCustomer';
import getHistory from './notify/getHistory';
import sendSms from './notify/sendSms';
import addPayin from './payint/addPayin';
import approvePayint from './payint/approvePayint';
import uploadPayint from './payint/reviewPayint';
import changePOBO from './pobo/changePOBO';
import exportPoboOrder from './pobo/exportPoboOrder';
import exportWithDraw from './pobo/exportWithDraw';
import getListPOBO from './pobo/getPOBO';
import createProcessingFlow from './processingFlow/createProcessingFlow';
import getListProcessingFlow from './processingFlow/getListProcessingFlow';
import updateProcessingFlow from './processingFlow/updateProcessingFlow';
import getDataQuantityMerchantAmount from './quantityMerchant/getDataQuantityMerchantAmount';
import getListDataQuantityMerchant from './quantityMerchant/getListDataQuantityMerchant';
import getListTopAgent from './quantityMerchant/getTopAgent';
import getTopMerchantCategory from './quantityMerchant/getTopMerchantCateGory';
import getListTopTransaction from './quantityMerchant/getTopSystemTransaction';
import getListReport from './reportBill';
import exportReportEwalletMc from './reportEwalletMc/exportEwalletMc';
import reportEwalletMc from './reportEwalletMc/getReportEwalletMc';
import reportEwalletServiceItem from './reportEwalletService/getAppReportItem';
import getEwalletEnumServices from './reportEwalletService/getEwalletEnumServices';
import reportEwalletService from './reportEwalletService/getEwalletServiceReport';
import getDetailRevenueStatistics from './reportMerchant/getDetailRevenueStatisticsSaga';
import getRevenueStatistics from './reportMerchant/getRevenueStatisticsSaga';
import getSumRevenueStatistics from './reportMerchant/getSumRevenueStatisticsSaga';
import getReportPartnerSaga from './reportPartner/getReportPartnerSaga';
import getReportTopUpPhone from './ReportTopUpPhone';
import getDataReportTransationSupplier from './reportTransactionSupplier/getDataReportTransationSupplier';
import getBalanceReportWallet from './reportWallet/getBalanceReportWallet';
import getReportKYC from './reportWallet/getReportKYC';
import getReportWallet from './reportWallet/getReportWallet';
import createMCScope from './scopeSaga/createMCScope';
import deleteMCScope from './scopeSaga/deleteMCScope';
import getListMCScope from './scopeSaga/getListMCScope';
import getScope from './scopeSaga/getListScope.saga';
import updateMCScope from './scopeSaga/updateMCScope';
import createSettingDeposit from './settingDeposit/createSettingDepositSaga';
import getSettingDeposit from './settingDeposit/getSettingDepositSaga';
import updateSettingDeposit from './settingDeposit/updateSettingDepositSaga';
import getSettingSystem from './settingSystem/getSettingSystemSaga';
import updateSettingSystem from './settingSystem/updateSettingSystemSaga';
import getRevenueStatisticsSaga from './statisticsRevenueSDK/getRevenueStatisticsSaga';
import approvalAlipayStore from './store/approvalAlipayStore';
import checkAlipayStore from './store/checkAlipayStore';
import getDelegateStore from './store/getDelegateStore';
import getListStore from './store/getListStore';
import getLogStore from './store/getLogStore';
import searchMerchantSaga from './store/getMerchantStore';
import updateStore from './store/updateStore';
import getReportTelcoDate from './telcoReport/getReportTelcoDate';
import getReportTelcoPrice from './telcoReport/getReportTelcoPrice';
import createTemplate from './template/createTemplate';
import createTemplateWallet from './template/createTemplateWallet';
import getListTemplate from './template/getListTemplate';
import getListTemplateWallet from './template/getListTemplateWallet';
import updateTemplate from './template/updateTemplate';
import updateTemplateWallet from './template/updateTemplateWallet';
import getTopTransfer from './topTransfer/getTopTransfer';
import cancelTransaction from './transaction/cancelTransaction';
import getDetailSupplierManage from './transaction/getDetailSupplierManager';
import getDetailTransaction from './transaction/getDetailTransaction';
import getListSupplierManage from './transaction/getListSupplierManage';
import getListTransaction from './transaction/getListTransaction';
import getRefundAmountTransaction from './transaction/getRefundAmount';
import getTransactionBankState from './transaction/getTransactionBankState';
import refundTransaction from './transaction/refundTransaction';
import exportFileMismatchTransactions from './transfer/exportFileMismatchTransactions';
import getMismatchTransactions from './transfer/getMismatchTransactions';
import updateMismatchTransaction from './transfer/updateMismatchTransaction';
import deleteUser from './userSaga/deleteUser';
import userSaga from './userSaga/searchUserMerchant';
import getAppInfo from './utility/getAppInfo';
import getChangedInfoFee from './utility/getChangedInfoFee';
import getListInfoBank from './utility/getListInfoBank';
import getLogs from './utility/getLogs';
import getMCSDKList from './utility/getMCSDKList';
import getPaymentFullType from './utility/getPaymentMethodFullType';
import updateEcommerceFeeDefault from './utility/updateEcommerceFeeDefaultSaga';
import updateMccCodeItem from './utility/updateMccCodeItemSaga';
import updatePoboFeeDefault from './utility/updatePoboFeeDefaultSaga';
import getVersionApp from './version/getVersionAppSaga';
import updateVersionApp from './version/updateVersionAppSaga';
import createCoopBankSaga from './wallet/coopBank/createCoopBankSaga';
import getCoopBankListSaga from './wallet/coopBank/getCoopBankListSaga';
import updateCoopBankSaga from './wallet/coopBank/updateCoopBankSaga';
import createIssuerSaga from './wallet/systemConfig/createIssuerSaga';
import createSupplierSaga from './wallet/systemConfig/createSupplierSaga';
import getBankListSaga from './wallet/systemConfig/getBankListSaga';
import getSettingAdvanceSaga from './wallet/systemConfig/getSettingAdvanceSaga';
import getWalletIssuersSaga from './wallet/systemConfig/getWalletIssuersSaga';
import getWalletSupplierSaga from './wallet/systemConfig/getWalletSupplierSaga';
import getWalletVersionSaga from './wallet/systemConfig/getWalletVersionSaga';
import updateBankSaga from './wallet/systemConfig/updateBankSaga';
import updateIssuerSaga from './wallet/systemConfig/updateIssuerSaga';
import updateSettingAdvanceSaga from './wallet/systemConfig/updateSettingAdvanceSaga';
import updateSupplierSaga from './wallet/systemConfig/updateSupplierSaga';
import updateWalletVersionSaga from './wallet/systemConfig/updateWalletVersionSaga';
import getListWalletKYC from './walletEKYC/getListWalletKYCSaga';
import getLogsWalletKYC from './walletEKYC/getLogsWalletKYCSaga';
import rejectWalletKYCIC from './walletEKYC/rejectWalletKYCICSaga';
import rejectWalletKYC from './walletEKYC/rejectWalletKYCSaga';
import requestApprovalAutoWalletKYC from './walletEKYC/requestApprovalAutoWalletKYCSaga';
import requestWalletKYCIC from './walletEKYC/requestWalletKYCICSaga';
import requestWalletKYC from './walletEKYC/requestWalletKYCSaga';
import updateListWalletKYC from './walletEKYC/updateListWalletKYCSaga';
import getWalletHistory from './walletHistory/getWalletHistory';
import getLinkedBankListSaga from './walletReport/getLinkedBankListSaga';
import changeWithdraw from './withdrawal/changeWithdraw';
import getListWithdraw from './withdrawal/getListWithdraw';
import getListTopMerchant from './reportBill/reportTop';
import getReportAgent from './reportSystem/getReportAgent.saga';
import getReportSystemTransaction from './reportSystem/getReportSystemTransaction.saga';
import getListLoanPackage from './eWalletLoanPackage/getListLoanPackage';
import updateLoanPackage from './eWalletLoanPackage/updateLoanPackage';
import reportSalaryAdvance from './SalaryAdvance/reportSalaryAdvance';
import salaryAdvance from './SalaryAdvance/getSalaryAdvance';
import getMerchantReportCrossCheck from './accountantCrossCheck/getMerchantReportCrossCheck';
import sendMailMerchantReportCrossCheck from './reportMerchant/sendMailMerchantReportCrossCheck';
import getInfoKycReportWallet from './reportWallet/getInfoKycReportWallet';
import getChangedStateCoboPobo from './utility/getChangeStateCoboPobo';
import getDataOverviewReportWallet from './overviewReportWalletSaga/getDataSaga';
import getTotalUser from './overviewReportWalletSaga/getTotalUser';
import getReportWalletDaily from './overviewReportWalletSaga/getReportEwalletDailySaga';
import getDataTop10WalletCount from "./top10Wallet/getDataTop10Wallet";
import getDataTop10WalletAmount from "./top10Wallet/getDataTop10WalletAmount";
import getAccountStatementSecureWallet from './overviewReportWalletSaga/getAccountStatment';
import getNationalData from './utility/getNationalData';
import searchManagerAccountsWalletPayme from './eWalletAccountsPaymeSaga/searchSaga';
import addManagerAccountsWalletPayme from './eWalletAccountsPaymeSaga/addSaga';
import updateManagerAccountsWalletPayme from './eWalletAccountsPaymeSaga/updateSaga';
import deleteManagerAccountsWalletPayme from './eWalletAccountsPaymeSaga/DeleteSaga'
import getListCompany from './eWalletAccountsPaymeSaga/getListCompanySaga';

const arrFork = [
  fork(authSaga),
  fork(changePassAuth),
  fork(managerUserPayMESaga),
  fork(reportSalaryAdvance),
  fork(accountMerchantSaga),
  fork(searchMerchant),
  fork(getProfileMerchant),
  fork(searchAccountMerchant),
  fork(searchApprovalMerchant),
  fork(salaryAdvance),
  fork(updateAccountMerchant),
  fork(getReportAgent),
  fork(passwordTemporary),
  fork(unlockAccountMc),
  fork(updatePassword),
  fork(getListRoles),
  fork(updateActiveAccMc),
  fork(getLinkedBanks),
  fork(unlinkBank),
  fork(addMoneyDepositWithdraw),
  fork(alertLogs),
  fork(sendTestMail),
  fork(reportEwalletService),
  fork(reportEwalletServiceItem),
  fork(getReportSystemTransaction),
  fork(requestMessage),
  fork(userSaga),
  fork(createUser),
  fork(createUserScope),
  fork(getEwalletEnumServices),
  fork(updateUserScope),
  fork(getListRoleOfAppUserAPI),
  fork(getListTransaction),
  fork(getPaymentMethods),
  fork(getLocationCity),
  fork(getSubLocation),
  fork(getDetailTransaction),
  fork(getDetailUser),
  fork(getMccCode),
  fork(updateUser),
  fork(getListScope),
  fork(getListRole),
  fork(updateScopeRole),
  fork(updateInfoMerchant),
  fork(createAccountMerchant),
  fork(getEwalletReportSaga),
  fork(getTopTransfer),

  fork(uploadPayint),
  fork(approvePayint),
  fork(addPayin),

  fork(refundTransaction),
  fork(getRefundAmountTransaction),
  fork(cancelTransaction),

  fork(getScope),
  fork(createScope),
  fork(updateScope),
  fork(deleteScope),
  fork(getMerchantFee),
  fork(getDefaultMerchantFee),
  fork(updateConfigFeeMerchant),
  fork(approveMerchant),
  fork(rejectMerchant),
  fork(changePasswordMerchant),
  fork(updateActiveMerchant),
  fork(getImageMerchant),
  fork(getListProcessingFlow),
  fork(createProcessingFlow),
  fork(updateProcessingFlow),
  fork(getReportMerchant),
  fork(getLocationReport),
  fork(getPaymentMethodReport),
  fork(getMerchantTypeReport),
  fork(getTopIncomeMerchant),

  fork(updateActiveAccountMerchant),
  fork(getListDelegateMC),
  fork(addDelegateMerchant),
  fork(getPendingListMerchant),
  fork(getTotalPendingMerchant),
  fork(sendContractMC),
  fork(approvePendingMerchant),
  fork(rejectPendingMerchant),
  fork(getBussinessDetail),
  fork(getListStore),
  fork(getChangedInfoMC),
  fork(getChangedInfoFee),
  fork(getLogs),

  fork(requestUpdateInfoMerchant),
  fork(requestUpdateMerchantFee),
  fork(getListSupplierManage),
  fork(merchantExport),
  fork(accountExport),
  fork(transactionExport),

  fork(getListSaleAccount),
  fork(getHistory),
  fork(sendSms),
  fork(merchantExportSoxket),
  fork(getListTemplate),
  fork(createTemplate),
  fork(updateTemplate),

  fork(searchMerchantInfo),
  fork(getMerchantSessions),
  fork(getMerchantTransactionHistory),
  fork(getMerchantLinkedBanks),
  fork(requestCancelMerchantWallet),
  fork(getMerchantChangeHistory),
  fork(getMerchantTransactionReport),
  fork(resetMerchantPassword),
  fork(unlockKyc),

  fork(getEmailSmsProduct),
  fork(getEmailSmsMerchant),
  fork(getEmailSmsHistory),
  fork(createEmailSmsProduct),
  fork(updateEmailSmsProduct),
  fork(getVersionApp),
  fork(merchantExportSoxket),
  fork(updateVersionApp),

  fork(updateEcommerceFeeDefault),
  fork(updatePoboFeeDefault),
  fork(updateMccCodeItem),

  fork(getListWithdraw),
  fork(changeWithdraw),

  fork(getListPOBO),
  fork(changePOBO),

  fork(handleDowload),

  fork(getSettingDeposit),
  fork(updateSettingDeposit),
  fork(createSettingDeposit),
  fork(getDetailSupplierManage),

  fork(getListAccountantCrossCheck),
  fork(createAccountantCrossCheck),

  fork(getRevenueStatistics),
  fork(getSumRevenueStatistics),

  fork(getDetailRevenueStatistics),
  fork(requestChangedMessage),
  fork(sendMail),

  fork(getMismatchTransactions),
  fork(updateMismatchTransaction),
  fork(exportFileMismatchTransactions),

  fork(getLockedCards),
  fork(updateLockedCard),

  fork(getMerchantLogSaga),

  fork(getSettingSystem),
  fork(updateSettingSystem),
  fork(getListWalletKYC),
  fork(getListTemplateWallet),
  fork(createTemplateWallet),
  fork(updateTemplateWallet),
  fork(getListCustomerSupport),
  fork(addTicket),
  fork(sendMailCustomerSupport),
  fork(getLogsCustomerSupport),
  fork(updateTicket),
  fork(updateStateCrossCheck),
  fork(updateStateDepositFinalProcess),
  fork(rejectCrossCheck),
  fork(CancelCrossCheck),
  fork(PauseCrossCheck),
  fork(ContinuePauseCrossCheck),
  fork(completeCrossCheck),
  fork(exportAccountantCrossCheck),
  fork(getListInfoBank),
  fork(updateStore),

  fork(getWalletHistory),

  fork(getDataDashBoardTicket),
  fork(updateListWalletKYC),
  fork(getAssignTarget),

  fork(requestWalletKYC),
  fork(rejectWalletKYC),
  fork(addReplyTicket),
  fork(setStateDashBoardTicket),
  fork(getListReplyTicket),
  fork(getLogStore),
  fork(eWalletTransaction),
  fork(getAppInfo),
  fork(eWalletTransactionRefund),
  fork(eWalletTransactionFileExport),
  fork(getListEWalletFillter),
  fork(updateEWalletFillter),
  fork(getDataListHistoryLogin),

  fork(getWalletVersionSaga),
  fork(updateWalletVersionSaga),
  fork(getBankListSaga),
  fork(updateBankSaga),
  fork(getWalletIssuersSaga),
  fork(createIssuerSaga),
  fork(updateIssuerSaga),

  fork(getWalletSupplierSaga),
  fork(createSupplierSaga),
  fork(updateSupplierSaga),

  fork(getSettingAdvanceSaga),
  fork(updateSettingAdvanceSaga),

  fork(getLogsWalletKYC),

  fork(getListConnectedUser),
  fork(unlinkConnectedUser),
  fork(updateNotificationCustomer),
  fork(requestApprovalAutoWalletKYC),

  fork(updateContractMerchant),
  fork(resendMailApprovalMerchant),
  fork(createSettlementMerchant),
  fork(disableMailSettlementMerchant),

  fork(updateAccountInfoEWallet),
  fork(getListAccountBank),
  fork(getListBank),
  fork(getListManualBank),
  fork(getReportTelcoPrice),
  fork(getReportTelcoDate),
  fork(getListEwalletBankTransaction),

  fork(getListCodeEWalletIsec),
  fork(getListAvatarImage),
  fork(refuseAvatar),
  fork(updateAliasName),
  fork(refuseAliasName),

  fork(getTopTransactionByDate),
  fork(getTopTransactionByAccount),

  fork(getLinkedBankListSaga),
  fork(getReportWallet),
  fork(getListEWalletIsecReport),
  fork(getListEWalletIsecReportTransaction),

  fork(getListEWalletSocialPayment),
  fork(getListReportEwalletSocial),
  fork(getListEWalletTransactionSupplier),
  fork(getReportTopUpPhone),
  fork(getListReport),
  fork(getListDeposit),
  fork(createBankTransferTransaction),
  fork(CreateDeposit),
  fork(updateDeposit),
  fork(updateDepositPayment),
  fork(getTopMerchantCategory),
  fork(getDataQuantityMerchantAmount),
  fork(getInformationEmailMerchantSaga),
  fork(resendEmailMerchant),
  fork(exportEmailMerchant),
  fork(getListDataQuantityMerchant),
  fork(getListEwalletBankTransactionReport),

  fork(getEwalletServiceBillReport),
  fork(getBankReport),
  fork(getEwalletGateReport),
  fork(getEwalletHistoryReport),
  fork(getListEWalletIsecReportByAccount),
  fork(getListMCScope),
  fork(deleteMCScope),
  fork(getCoopBankListSaga),
  fork(createCoopBankSaga),
  fork(updateCoopBankSaga),
  fork(addPaymeTransfer),
  fork(getListPaymeTransferLog),
  fork(getListPaymeTransferHistory),
  fork(createCommandPaymeTransfer),
  fork(getDetailPaymeTransfer),
  fork(confirmPaymeTransfer),

  fork(requestActiveMerchant),
  fork(createMCScope),
  fork(updateMCScope),
  fork(getPaymentFullType),
  fork(requestActiveAccount),
  fork(getTransactionBankState),
  fork(getTopTransactionByAccountAmount),

  fork(getReportCustomer),

  fork(getReportKYC),

  fork(getRevenueStatisticsSaga),
  fork(eWalletReportTransaction),

  fork(checkAlipayStore),
  fork(approvalAlipayStore),
  fork(exportPartnerService),
  fork(getReportUser),
  fork(reportUserFileExport),
  fork(DepositWithdrawEwallet),
  fork(getlistBalanceMerchant),
  fork(reportEwalletMc),
  fork(getLogTransactionFee),
  fork(getStatisticUser),
  fork(getDetailCustomerSupport),
  fork(getBalanceReportWallet),
  fork(getDetailDataDashBoardTicket),
  fork(searchExpertiseMerchant),
  fork(getAccountActiveInfo),
  fork(getMerchantActiveInfo),

  fork(cttGetReportTransaction),
  fork(getReportPartnerSaga),
  fork(rejectWalletKYCIC),
  fork(requestWalletKYCIC),
  fork(getDelegateStore),
  fork(ExportSearchBalanceMerchant),
  fork(getEWalletTransactionDetails),
  fork(getDataReportTransationSupplier),

  fork(searchMerchantSaga),
  fork(getChangedEwalletAccountInfo),
  fork(lockedCards),
  fork(getCttCoopBankListSaga),
  fork(createCttCoopBankSaga),
  fork(updateCttCoopBankSaga),
  fork(getMerchantInforList),
  fork(getServiceSearchTransaction),

  fork(getLoginHistory),
  fork(exportLoginHistory),
  fork(getEwalletSsccReport),
  fork(exportEwalletBankTransaction),

  fork(getMCSDKList),
  fork(getListEwalletBankReportMerchantTT23),
  fork(getFilterValueCustomerSupport),
  fork(getSupportStaff),
  fork(exportReportEwalletMc),
  fork(getListTopAgent),
  fork(getListTopTransaction),
  fork(deleteUser),
  fork(getListEwalletBankReportEwalletTT23),
  fork(getListEwalletBankReportDetailEwalletTT23),
  fork(getListEwalletBankReportBillTT23),
  fork(exportPoboOrder),
  fork(exportWithDraw),
  fork(approveCrossCheck),
  fork(getListTopMerchant),
  fork(transferCrosskCheck),
  fork(getListLoanPackage),
  fork(updateLoanPackage),
  fork(getMerchantReportCrossCheck),

  fork(sendMailMerchantReportCrossCheck),
  fork(getInfoKycReportWallet),
  fork(getChangedStateCoboPobo),
  fork(getNationalData),
  fork(getDataOverviewReportWallet),
  fork(getTotalUser),
  fork(getReportWalletDaily),
  fork(getDataTop10WalletCount),
  fork(getDataTop10WalletAmount),

  fork(getAccountStatementSecureWallet),

  fork(searchManagerAccountsWalletPayme),
  fork(addManagerAccountsWalletPayme),
  fork(updateManagerAccountsWalletPayme),
  fork(deleteManagerAccountsWalletPayme),
  fork(getListCompany),
];

function* rootSaga() {
  yield all(arrFork); // all effect like promise.all
}

export default rootSaga;
