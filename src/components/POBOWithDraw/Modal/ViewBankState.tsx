import dayjs from 'dayjs';
import { GetRefundAmountInput, StateTransactionEnum, TransactionResponse } from 'models';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import formatCurrency from 'utils/helpers/formatCurrency';
import DrawerRight from 'ui/DrawerRight';
import { getTransactionBankState } from 'redux/actions';
import transaction from 'redux/reducers/transactionReducer';
interface Props {
  transactionId: string;
  handleClose?: () => void;
  t: (a: string) => string;
  show: boolean;
}

export default function ViewBankState(props: Props) {
  const { transactionId, handleClose, t, show } = props;
  const dispatch = useDispatch();
  const [bankSate, setBankState] = useState<any>([]);
  const noData = '/assets/img/no-data.png';

  useEffect(() => {
    if (show) {
      const payload: GetRefundAmountInput = {
        transactionId,
      };
      dispatch(
        getTransactionBankState(payload, (status, bankState) => {
          setBankState(bankState);
        })
      );
    }
  }, [show]);

  return (
    <DrawerRight
      overlay={true}
      width={500}
      isShow={show}
      closeDrawer={handleClose}
      isSecondDrawer={false}>
      <div className='atbd-drawer__header d-flex aling-items-center justify-content-between'>
        <h6 className='drawer-title font-weight-bold'>{t('Xem TT NH')}</h6>
        <img
          src='/assets/img/icon-close-modal.svg'
          className='icon-close-modal icon-close'
          onClick={handleClose}
          alt=''
        />
      </div>

      <div className='box-body-payment'>
        {Object.keys(bankSate).length > 0 ? (
          <>
            <div className='d-flex justify-content-between row-custom'>
              <span className='col-left'>{t('supplierTransaction')}</span>
              <span className='col-right text-right'>{bankSate?.supplierTransaction || '-'}</span>
            </div>
            <div className='d-flex justify-content-between row-custom'>
              <span className='col-left'>{t('transactionId')}</span>
              <span className='col-right text-right'>{bankSate?.transactionId || '-'}</span>
            </div>
            <div className='d-flex justify-content-between row-custom'>
              <span className='col-left'>{t('amount')}</span>
              <span className='col-right text-right'>{`${
                bankSate?.amount === 0 || bankSate?.amount
                  ? formatCurrency(bankSate?.amount) + ' đ'
                  : '-'
              }`}</span>
            </div>
            <div className='d-flex justify-content-between row-custom'>
              <span className='col-left'>{t('Mô tả')}</span>
              <span className='col-right text-right'>{bankSate?.description || '-'}</span>
            </div>
            <div className='d-flex justify-content-between row-custom'>
              <span className='col-left'>{t('Trạng thái')}</span>
              <span className='col-right text-right'>{bankSate?.state || '-'}</span>
            </div>
            <div className='d-flex justify-content-between row-custom'>
              <span className='col-left'>{t('Người thay đổi trạng thái')}</span>
              <span className='col-right text-right'>{bankSate?.requester || '-'}</span>
            </div>
            <div className='d-flex justify-content-between row-custom'>
              <span className='col-left'>{t('Người duyệt')}</span>
              <span className='col-right text-right'>{bankSate?.approveser || '-'}</span>
            </div>

            {/* <div className='d-flex justify-content-between row-custom'>
              <span className='col-left'>{t('Người thay đổi trạng thái')}</span>
              <span className='col-right text-right'>{bankSate?.state || '-'}</span>
            </div>

            <div className='d-flex justify-content-between row-custom'>
              <span className='col-left'>{t('Người duyệt')}</span>
              <span className='col-right text-right'>{bankSate?.state || '-'}</span>
            </div> */}
          </>
        ) : (
          <div className='d-flex flex-column align-items-center'>
            <img src={noData} />
            <span className='text-muted mt-1'>{t('No data')}</span>
          </div>
        )}
      </div>
    </DrawerRight>
  );
}
