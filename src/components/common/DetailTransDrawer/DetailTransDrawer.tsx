import dynamic from 'next/dynamic';
import React from 'react';
import DrawerRight from 'ui/DrawerRight';

const DetailTransaction = dynamic(import('./DetailTransaction'));
const DetailApproveMerchant = dynamic(import('./DetailApproveMerchant'));
const DetailApproveStore = dynamic(import('./DetailApproveStore'));
const DetailChangedInfoMerchant = dynamic(import('./DetailChangedInfoMerchant'));
const DetailChangedInfoEwalletAccount = dynamic(import('./DetailChangedInfoEwalletAccount'));
const DetailChangedInfoFee = dynamic(import('./DetailChangedInfoFee'));
const DetailApproveMessage = dynamic(import('./DetailApproveMessage'));
const DetailSupplierManage = dynamic(import('./DetailSupplierManager'));
const DetailApproveActiveMerchant = dynamic(import('./DetailApproveActiveMerchant'));
const DetailApproveActiveAccount = dynamic(import('./DetailApproveActiveAccount'));
const DetailChangeStateCoboPobo = dynamic(import('./DetailChangeStateCoboPobo'));
interface DetailTransDrawerProps {
  width?: string;
  data?: any[];
  type?: string;
  idDetail: number | string;
  closeDrawerDetail?: () => void;
  showOtherDetail?: (type: string, itemId: number) => void;
  getListPayment?: () => void;
  t: (a: string) => string;
  isSecondDrawer?: boolean;
  handleOpenSecondDrawer?: () => void;
  handleRecall?: (a: boolean) => void;
  submitForm?: boolean;
  info?: any;
  filter?: any;
  rowData?: any;
}

export default function DetailTransDrawer(props: DetailTransDrawerProps) {
  const {
    width,
    data = null,
    type, // show hide detail
    idDetail, //payment id để gọi api
    closeDrawerDetail, // đặt lại openDetailTrans false
    showOtherDetail, // hiển thị popup khác (type, id)
    getListPayment,
    t,
    isSecondDrawer,
    handleOpenSecondDrawer, // pass vào drawer khi muốn mở cùng lúc 2 drawer
    info,
    handleRecall,
    submitForm,
    filter,
    rowData,
  } = props;
  const arrType = [
    'TRANSACTION',
    'APPROVE_MERCHANT',
    'APPROVE_STORE',
    'CHANGE_MERCHANT',
    'CHANGE_FEE',
    'APPROVE_MESSAGE',
    'SUPPLIER_DETAIL',
    'APPROVE_ACTIVE_MERCHANT',
    'APPROVE_ACTIVE_ACCOUNT',
    'CHANGE_WALLET_ACCOUNT',
    'CHANGE_STATE_COBO_POBO',
  ];
  return (
    <>
      <DrawerRight
        overlay={true}
        width={width}
        isShow={arrType.find((elm) => elm === type) ? true : false}
        closeDrawer={closeDrawerDetail}
        isSecondDrawer={isSecondDrawer}>
        {type === 'TRANSACTION' && (
          <DetailTransaction
            idDetail={idDetail as string}
            closeDrawerDetail={closeDrawerDetail}
            showOtherDetail={showOtherDetail}
            handleRecall={handleRecall}
            t={t}
          />
        )}
        {type === 'APPROVE_MERCHANT' && (
          <DetailApproveMerchant
            info={info}
            idDetail={idDetail as number}
            closeDrawerDetail={closeDrawerDetail}
            showOtherDetail={showOtherDetail}
            handleRecall={handleRecall}
            submitForm={submitForm}
            t={t}
          />
        )}
        {type === 'APPROVE_STORE' && (
          <DetailApproveStore
            info={info}
            idDetail={idDetail as number}
            closeDrawerDetail={closeDrawerDetail}
            showOtherDetail={showOtherDetail}
            handleRecall={handleRecall}
            submitForm={submitForm}
            t={t}
          />
        )}
        {type === 'CHANGE_MERCHANT' && (
          <DetailChangedInfoMerchant
            info={info}
            idDetail={idDetail as number}
            closeDrawerDetail={closeDrawerDetail}
            showOtherDetail={showOtherDetail}
            handleRecall={handleRecall}
            submitForm={submitForm}
            t={t}
          />
        )}
        {type === 'CHANGE_FEE' && (
          <DetailChangedInfoFee
            info={info}
            idDetail={idDetail as number}
            closeDrawerDetail={closeDrawerDetail}
            showOtherDetail={showOtherDetail}
            handleRecall={handleRecall}
            submitForm={submitForm}
            t={t}
          />
        )}
        {type === 'APPROVE_MESSAGE' && (
          <DetailApproveMessage
            info={info}
            idDetail={idDetail as number}
            closeDrawerDetail={closeDrawerDetail}
            showOtherDetail={showOtherDetail}
            handleRecall={handleRecall}
            submitForm={submitForm}
            t={t}
          />
        )}
        {type === 'SUPPLIER_DETAIL' && (
          <DetailSupplierManage
            // info={info}
            filter={filter}
            // row={rowData}
            idDetail={idDetail as string}
            closeDrawerDetail={closeDrawerDetail}
            showOtherDetail={showOtherDetail}
            handleRecall={handleRecall}
            submitForm={submitForm}
            t={t}
          />
        )}
        {type === 'APPROVE_ACTIVE_MERCHANT' && (
          <DetailApproveActiveMerchant
            info={info}
            idDetail={idDetail as number}
            closeDrawerDetail={closeDrawerDetail}
            showOtherDetail={showOtherDetail}
            handleRecall={handleRecall}
            submitForm={submitForm}
            t={t}
          />
        )}
        {type === 'APPROVE_ACTIVE_ACCOUNT' && (
          <DetailApproveActiveAccount
            info={info}
            idDetail={idDetail as number}
            closeDrawerDetail={closeDrawerDetail}
            showOtherDetail={showOtherDetail}
            handleRecall={handleRecall}
            submitForm={submitForm}
            t={t}
          />
        )}
        {type === 'CHANGE_WALLET_ACCOUNT' && (
          <DetailChangedInfoEwalletAccount
            info={info}
            idDetail={idDetail as number}
            closeDrawerDetail={closeDrawerDetail}
            showOtherDetail={showOtherDetail}
            handleRecall={handleRecall}
            submitForm={submitForm}
            t={t}
          />
        )}
        {type === 'CHANGE_STATE_COBO_POBO' && (
          <DetailChangeStateCoboPobo
            info={info}
            idDetail={idDetail as number}
            closeDrawerDetail={closeDrawerDetail}
            showOtherDetail={showOtherDetail}
            handleRecall={handleRecall}
            submitForm={submitForm}
            t={t}
          />
        )}
      </DrawerRight>
    </>
  );
}
