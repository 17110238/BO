import React, { useEffect, useRef, useState } from 'react';
import formatCurrency from 'utils/helpers/formatCurrency';
import _ from 'lodash';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import DrawerRight from 'ui/DrawerRight';
import { useDispatch } from 'react-redux';
import { getEWalletTransactionDetails } from 'redux/actions';
import { EWalletTransactionBO, GetEWalletTransactionDetailInput } from 'models';
const ReactJson = dynamic(import('react-json-view'), { ssr: false });

interface Props {
  t: (a: string) => string;
  show: boolean;
  handleClose: () => void;
  _id: number;
}

const Details = ({ t, show, handleClose, _id }: Props) => {
  const handleConvertObj = (param: any) => {
    const convert1 = JSON.parse(param);
    return convert1[0];
  };
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [transactionHistory, setTransactionHistoryDetails] = useState<EWalletTransactionBO>({});
  const [submitForm, setSubmitForm] = useState<boolean>(false);

  useEffect(() => {
    if (show) {
      const payload: GetEWalletTransactionDetailInput = {
        id: _id,
      };
      dispatch(
        getEWalletTransactionDetails(payload, (status, res) => {
          setSubmitForm(false);
          setTransactionHistoryDetails(res);
          setLoading(false);
        })
      );
    }
  }, [show]);

  const {
    accountId,
    amount,
    appId,
    bonus,
    cashback,
    changed,
    createdAt,
    description,
    discount,
    extraData,
    fee,
    id,
    isVisible,
    method,
    partnerId,
    payment,
    paymentMethod,
    phone,
    publishedAt,
    service,
    state,
    supplierBill,
    supplierMobileCard,
    supplierMobileTopup,
    tags,
    total,
    transactionId,
    transport,
    updatedAt,
    via,
  } = transactionHistory;

  return (
    <>
      <DrawerRight
        overlay={true}
        width={600}
        isShow={show}
        closeDrawer={handleClose}
        isSecondDrawer={false}>
        <div className='atbd-drawer__header d-flex aling-items-center justify-content-between'>
          <h5>
            {' '}
            {t('Transaction')}: {transactionId}
          </h5>
          <img
            src='/assets/img/icon-close-modal.svg'
            className='icon-close-modal icon-close'
            onClick={handleClose}
            alt=''
          />
        </div>

        <div className='box-body-payment'>
          <div className='d-flex justify-content-between row-custom'>
            <span className='col-left'>ID:</span>
            <span className='col-right text-right'>{id}</span>
          </div>
          <div className='d-flex justify-content-between row-custom'>
            <span className='col-left'>{t('Mã giao dịch')}:</span>
            <span className='col-right text-right'>{transactionId}</span>
          </div>
          <div className='d-flex justify-content-between row-custom'>
            <span className='col-left'>User ID:</span>
            <span className='col-right text-right'>{accountId} </span>
          </div>
          <div className='d-flex justify-content-between row-custom'>
            <span className='col-left'>{t('Service')}:</span>
            <span className='col-right text-right'>{service?.code}</span>
          </div>
          <div className='d-flex justify-content-between row-custom'>
            <span className='col-left'>{t('Changed')}:</span>
            <span className='col-right text-right'>{changed}</span>
          </div>

          <div className='d-flex justify-content-between row-custom'>
            <span className='col-left'>{t('Giá trị GD')}:</span>
            <span className='col-right text-right'>{formatCurrency(amount)} đ</span>
          </div>
          <div className='d-flex justify-content-between row-custom'>
            <span className='col-left'>{t('Phí')}:</span>
            <span className='col-right text-right'>{formatCurrency(fee)} đ</span>
          </div>
          <div className='d-flex justify-content-between row-custom'>
            <span className='col-left'>{t('Giảm giá')}:</span>
            <span className='col-right text-right'>{formatCurrency(discount)} đ</span>
          </div>
          <div className='d-flex justify-content-between row-custom'>
            <span className='col-left'>Bonus:</span>
            <span className='col-right text-right'>{formatCurrency(bonus)} đ</span>
          </div>
          <div className='d-flex justify-content-between row-custom'>
            <span className='col-left'>Cashback:</span>
            <span className='col-right text-right'>{formatCurrency(cashback)} đ</span>
          </div>

          <div className='d-flex justify-content-between row-custom'>
            <span className='col-left'>{t('Tổng')}</span>
            <span className='col-right text-right'>{formatCurrency(total)} đ</span>
          </div>
          <div className='d-flex justify-content-between row-custom'>
            <span className='col-left'>{t('Trạng thái')}:</span>
            <span className='col-right text-right'>
              <span
                className={`${
                  state === 'PROCESSING'
                    ? 'state-refunded-modal'
                    : state === 'EXPIRED'
                    ? 'state-cancel-payment-modal'
                    : state === 'SUCCEEDED'
                    ? 'state-success-modal'
                    : state === 'PENDING'
                    ? 'state-pending-modal'
                    : state === 'CANCELED' || state === 'FAILED'
                    ? 'state-cancel-modal'
                    : 'state-cancel-modal'
                } `}>
                {t(`${state}`)}
              </span>
            </span>
          </div>
          <div className='d-flex justify-content-between row-custom'>
            <span className='col-left'>{t('Thời điểm giao dịch')}:</span>
            <span className='col-right text-right'>
              {createdAt ? dayjs(createdAt).format('HH:mm:ss DD/MM/YYYY') : '-'}
            </span>
          </div>
          <div className='d-flex justify-content-between row-custom'>
            <span className='col-left'>{t('Mô tả')}:</span>
            <span className='col-right text-'>{description}</span>
          </div>
          <div className='d-flex justify-content-between row-custom'>
            <span className='col-left'>{t('Reference Id')}:</span>
            <span className='col-right text-right'>{service?.id}</span>
          </div>
          <div className='d-flex justify-content-between row-custom'>
            <span className='col-left'>{t('Chi tiết dịch vụ')}:</span>
            <div className='col-right text-right'>
              {service ? <ReactJson src={service} collapsed={0} displayDataTypes={false} /> : ''}
            </div>
          </div>

          <div className='d-flex justify-content-between row-custom'>
            <span className='col-left'>paymentData:</span>
            <div className='col-right text-right'>
              {payment && <ReactJson src={payment} collapsed={0} displayDataTypes={false} />}
            </div>
          </div>

          <div className='d-flex justify-content-between row-custom'>
            <span className='col-left'>transportData:</span>
            <div className='col-right text-right'>
              {transport && <ReactJson src={transport} collapsed={0} displayDataTypes={false} />}
            </div>
          </div>

          <div className='d-flex justify-content-between row-custom'>
            <span className='col-left'>Tags:</span>
            <div className='col-right text-right'>{tags ? <span>{tags[0]}</span> : ''}</div>
          </div>

          <div className='d-flex justify-content-between row-custom'>
            <span className='col-left'>extraData:</span>
            <div className='col-right text-right'>
              {extraData ? (
                <ReactJson src={JSON.parse(extraData)} collapsed={0} displayDataTypes={false} />
              ) : (
                ''
              )}
            </div>
          </div>

          {service?.code === 'MOBILE_CARD' ||
          service?.code === 'MOBILE_TOPUP' ||
          service?.code === 'BILL' ? (
            <div className='border-top'>
              <h5 className='py-3'> {t('NCC giao dịch')}</h5>
              <div className='break-all-text'>
                {service?.code === 'MOBILE_CARD' ? (
                  <>
                    <div className='d-flex justify-content-between row-custom'>
                      <span className='col-left'>{t('Trạng thái')}:</span>
                      <div className='col-right text-right'>
                        {supplierMobileCard?.state && (
                          <span
                            className={`${
                              supplierMobileCard?.state === 'PROCESSING'
                                ? 'state-refunded-modal'
                                : supplierMobileCard?.state === 'EXPIRED'
                                ? 'state-cancel-payment-modal'
                                : supplierMobileCard?.state === 'SUCCEEDED'
                                ? 'state-success-modal'
                                : supplierMobileCard?.state === 'PENDING'
                                ? 'state-pending-modal'
                                : supplierMobileCard?.state === 'CANCELED' ||
                                  supplierMobileCard?.state === 'FAILED'
                                ? 'state-cancel-modal'
                                : 'state-cancel-modal'
                            } `}>
                            {t(supplierMobileCard?.state)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className='d-flex justify-content-between row-custom'>
                      <span className='col-left'>{t('Nội dung')}:</span>
                      <span className='col-right text-right'>
                        {supplierMobileCard?.description}
                      </span>
                    </div>

                    <div className='d-flex justify-content-between row-custom'>
                      <span className='col-left'>{t('Mệnh giá')}:</span>
                      <span className='col-right text-right'>{supplierMobileCard?.amount}</span>
                    </div>

                    <div className='d-flex justify-content-between row-custom'>
                      <span className='col-left'>{t('Nhà mạng')}:</span>
                      <span className='col-right text-right'>{supplierMobileCard?.supplier}</span>
                    </div>

                    <div className='d-flex justify-content-between row-custom'>
                      <span className='col-left'>Serial:</span>
                      <div className='col-right text-right'>
                        {supplierMobileCard?.cardInfo
                          ? supplierMobileCard.cardInfo?.map((mobileCard: any, index: number) => {
                              return (
                                <div key={index}>
                                  <span className='text-right'>{mobileCard.serial}</span> <br />
                                </div>
                              );
                            })
                          : ''}
                      </div>
                    </div>

                    <div className='d-flex justify-content-between row-custom'>
                      <span className='col-left'>{t('Thời điểm GD')}:</span>
                      <span className='col-right text-right'>
                        {supplierMobileCard?.createdAt &&
                          dayjs(supplierMobileCard.createdAt).format('HH:mm:ss DD/MM/YYYY')}
                      </span>
                    </div>

                    <div className='d-flex justify-content-between row-custom'>
                      <span className='col-left'>{t('supplierResponsed')}:</span>
                      <div className='col-right text-left'>
                        {supplierMobileCard?.supplierResponsed ? (
                          <ReactJson
                            src={JSON.parse(JSON.parse(supplierMobileCard.supplierResponsed))}
                            collapsed={0}
                            displayDataTypes={false}
                          />
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  ''
                )}

                {service?.code === 'MOBILE_TOPUP' ? (
                  <>
                    <div className='d-flex justify-content-between row-custom'>
                      <span className='col-left'>{t('Trạng thái')}:</span>
                      <span className='col-right text-right'>
                        {supplierMobileTopup?.state && (
                          <span
                            className={
                              supplierMobileTopup?.state === 'PROCESSING'
                                ? 'state-refunded-modal'
                                : supplierMobileTopup?.state === 'EXPIRED'
                                ? 'state-cancel-payment-modal'
                                : supplierMobileTopup?.state === 'SUCCEEDED'
                                ? 'state-success-modal'
                                : supplierMobileTopup?.state === 'PENDING'
                                ? 'state-pending-modal'
                                : supplierMobileTopup?.state === 'CANCELED' ||
                                  supplierMobileTopup?.state === 'FAILED'
                                ? 'state-cancel-modal'
                                : 'state-cancel-modal'
                            }>
                            {t(supplierMobileTopup?.state)}
                          </span>
                        )}
                      </span>
                    </div>

                    <div className='d-flex justify-content-between row-custom'>
                      <span className='col-left'>{t('Nội dung')}:</span>
                      <span className='col-right text-right'>
                        {supplierMobileTopup?.description}
                      </span>
                    </div>

                    <div className='d-flex justify-content-between row-custom'>
                      <span className='col-left'>{t('Mệnh giá')}:</span>
                      <span className='col-right text-right'>
                        {supplierMobileTopup?.amount && formatCurrency(supplierMobileTopup?.amount)}{' '}
                        đ
                      </span>
                    </div>

                    <div className='d-flex justify-content-between row-custom'>
                      <span className='col-left'>{t('Nhà mạng')}:</span>
                      <span className='col-right text-right'>{supplierMobileTopup?.amount}</span>
                    </div>

                    <div className='d-flex justify-content-between row-custom'>
                      <span className='col-left'>{t('Thời điểm GD')}:</span>
                      <span className='col-right text-right'>
                        {supplierMobileTopup?.createdAt &&
                          dayjs(supplierMobileTopup.createdAt).format('HH:mm:ss DD/MM/YYYY')}
                      </span>
                    </div>

                    <div className='d-flex justify-content-between row-custom'>
                      <span className='col-left'>{t('supplierResponsed')}:</span>
                      <div className='col-right text-left'>
                        {supplierMobileTopup?.supplierResponsed ? (
                          <ReactJson
                            src={handleConvertObj(supplierMobileTopup.supplierResponsed)}
                            collapsed={0}
                            displayDataTypes={false}
                          />
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  ''
                )}

                {service?.code === 'BILL' ? (
                  <>
                    <div className='d-flex justify-content-between row-custom'>
                      <span className='col-left'>{t('Trạng thái')}:</span>
                      <span className='col-right text-right'>
                        {supplierBill?.state && (
                          <span
                            className={
                              supplierBill?.state === 'PROCESSING'
                                ? 'state-refunded-modal'
                                : supplierBill?.state === 'EXPIRED'
                                ? 'state-cancel-payment-modal'
                                : supplierBill?.state === 'SUCCEEDED'
                                ? 'state-success-modal'
                                : supplierBill?.state === 'PENDING'
                                ? 'state-pending-modal'
                                : supplierBill?.state === 'CANCELED' ||
                                  supplierBill?.state === 'FAILED'
                                ? 'state-cancel-modal'
                                : 'state-cancel-modal'
                            }>
                            {t(supplierBill?.state)}
                          </span>
                        )}
                      </span>
                    </div>

                    <div className='d-flex justify-content-between row-custom'>
                      <span className='col-left'>{t('Nội dung')}:</span>
                      <span className='col-right text-right'>{supplierBill?.description}</span>
                    </div>

                    <div className='d-flex justify-content-between row-custom'>
                      <span className='col-left'>{t('Giá trị GD')}:</span>
                      <span className='col-right text-right'>
                        {supplierBill?.amount && formatCurrency(supplierBill?.amount)} đ
                      </span>
                    </div>

                    <div className='d-flex justify-content-between row-custom'>
                      <span className='col-left'>{t('Tên khách hàng')}:</span>
                      <span className='col-right text-right'>
                        {supplierBill?.customerInfo?.fullname}
                      </span>
                    </div>

                    <div className='d-flex justify-content-between row-custom'>
                      <span className='col-left'>{t('Customer Id')}:</span>
                      <span className='col-right text-right'>{supplierBill?.customerInfo?.id}</span>
                    </div>

                    <div className='d-flex justify-content-between row-custom'>
                      <span className='col-left'>{t('Mã NCC')}:</span>
                      <span className='col-right text-right'>
                        {supplierBill?.supplierInfo?.code}
                      </span>
                    </div>

                    <div className='d-flex justify-content-between row-custom'>
                      <span className='col-left'>{t('Tên NCC')}:</span>
                      <span className='col-right text-right'>
                        {supplierBill?.supplierInfo?.fullname}
                      </span>
                    </div>

                    <div className='d-flex justify-content-between row-custom'>
                      <span className='col-left'>{t('Gateway')}:</span>
                      <span className='col-right text-right'>{supplierBill?.gateway}</span>
                    </div>

                    <div className='d-flex justify-content-between row-custom'>
                      <span className='col-left'>{t('Loại')}:</span>
                      <span className='col-right text-right'>{supplierBill?.type}</span>
                    </div>

                    <div className='d-flex justify-content-between row-custom'>
                      <span className='col-left'>{t('Thời điểm GD')}:</span>
                      <span className='col-right text-right'>
                        {supplierBill?.createdAt &&
                          dayjs(supplierBill.createdAt).format('HH:mm:ss DD/MM/YYYY')}
                      </span>
                    </div>

                    <div className='d-flex justify-content-between row-custom'>
                      <span className='col-left'>{t('supplierResponsed')}:</span>
                      <div className='col-right text-left'>
                        {supplierBill?.supplierResponsed ? (
                          <ReactJson
                            src={handleConvertObj(supplierBill?.supplierResponsed)}
                            collapsed={0}
                            displayDataTypes={false}
                          />
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  ''
                )}
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
      </DrawerRight>
    </>
  );
};

export default Details;
