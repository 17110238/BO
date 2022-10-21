import dayjs from 'dayjs';
import { GetDetailTransactionReponse, StateTransactionEnum, TransactionResponse } from 'models';
import renderState from 'constants/State';
import renderStatus from 'constants/Status';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDetailTransaction } from 'redux/actions';
import formatCurrency from 'utils/helpers/formatCurrency';
import ModalRefund from 'components/TransactionsPage/refunds/ModalRefund';
import checkPermisson from 'utils/helpers/checkPermission';
import dynamic from 'next/dynamic';
const ReactJson = dynamic(import('react-json-view'), { ssr: false });
interface DetailTransDrawerProps {
  idDetail: string;
  closeDrawerDetail?: () => void;
  showOtherDetail?: ((type: string, itemId: number) => void) | undefined;
  handleRecall?: (a: boolean) => void;
  t: (a: string) => string;
}
interface TransactionInfo {
  transactionId?: string;
  partnerId?: string;
}
export interface scopeUserProps {
  scope: string[];
  link: string;
  refcode: string;
}

export default function DetailTransDrawer(props: DetailTransDrawerProps) {
  const {
    idDetail, //payment id để gọi api
    closeDrawerDetail, // đặt lại openDetailTrans false
    showOtherDetail, // hiển thị popup khác
    handleRecall,
    t,
  } = props;
  const dispatch = useDispatch();
  const [isShowModalRefund, setShowModalRefund] = useState<boolean>(false);
  const [transactionInfo, setTransactionInfo] = useState<TransactionInfo>({
    transactionId: '',
    partnerId: '',
  });
  const [data, setData] = useState<GetDetailTransactionReponse>();
  const payload = {
    paymentId: idDetail,
  };
  const accountInfo = useSelector<any, scopeUserProps>((state) => state?.authReducers?.accountInfo);
  const checkPermissionRefund = !accountInfo?.scope.includes('bo.transaction.viewOnly');

  useEffect(() => {
    dispatch(
      getDetailTransaction(payload, (status, response) => {
        if (status) {
          setData(response);
        }
      })
    );
  }, []);

  return (
    <>
      <div className='atbd-drawer__header d-flex aling-items-center justify-content-between'>
        <h6 className='drawer-title'>
          {data?.transactionId && (
            <>
              {t('Mã đơn hàng')}:<span className='title-id'>{data?.transactionId}</span>
            </>
          )}
        </h6>
        <img
          src='/assets/img/icon-close-modal.svg'
          className='icon-close-modal icon-close'
          onClick={closeDrawerDetail}
          alt=''
        />
      </div>
      <div className='box-body-payment'>
        {data?.paymentId && (
          <div className='d-flex justify-content-between row-custom'>
            <div className='col-left'>{t('Mã thanh toán')}:</div>
            <div className='col-right text-right'>{data?.paymentId}</div>
          </div>
        )}
        <div className='d-flex justify-content-between row-custom'>
          <div className='col-left'>{t('Giá trị GD')}:</div>
          <div className='col-right text-right'>{formatCurrency(data?.amount)} đ</div>
        </div>
        <div className='d-flex justify-content-between row-custom'>
          <div className='col-left'>{t('Phí đối soát')}:</div>
          <div className='col-right text-right'>{formatCurrency(data?.fee)} đ</div>
        </div>
        <div className='d-flex justify-content-between row-custom'>
          <div className='col-left'>{t('Thực nhận')}:</div>
          <div className='col-right text-right'>{formatCurrency(data?.total)} đ</div>
        </div>
        {data?.createdAt && (
          <div className='d-flex justify-content-between row-custom'>
            <div className='col-left'>{t('TG tạo:')}</div>
            <div className='col-right text-right'>
              {dayjs(data?.createdAt).format('HH:mm:ss DD/MM/YYYY')}
            </div>
          </div>
        )}
        {data?.updatedAt && (
          <div className='d-flex justify-content-between row-custom'>
            <div className='col-left'>{t('TG cập nhật:')}</div>
            <div className='col-right text-right'>
              {dayjs(data?.updatedAt).format('HH:mm:ss DD/MM/YYYY')}
            </div>
          </div>
        )}
        {data?.finishedAt && (
          <div className='d-flex justify-content-between row-custom'>
            <div className='col-left'>{t('TG hoàn thành:')}</div>
            <div className='col-right text-right'>
              {dayjs(data?.finishedAt).format('HH:mm:ss DD/MM/YYYY')}
            </div>
          </div>
        )}
        {data?.description && (
          <div className='d-flex justify-content-between align-items-center row-custom'>
            <div className='col-left'>{t('Mô tả:')}</div>
            <div className='col-right text-right'>{data?.description}</div>
          </div>
        )}
        {data?.paymentSubType && (
          <div className='d-flex justify-content-between align-items-center row-custom'>
            <div className='col-left'>{t('Hình thức:')}</div>
            <div className='col-right text-right'>{t(data?.paymentSubType)}</div>
          </div>
        )}
        {/* --------------------------- HOÀN TIỀN ------------------------------- */}
        {data?.state === 'SUCCEEDED' && checkPermissionRefund && (
          <div className='d-flex justify-content-between row-custom'>
            <div className='col-left'>{t('Hoàn tiền:')}</div>
            <div className='col-right refunde-right text-right d-flex flex-column align-items-end'>
              <button
                className='btn btn-refund'
                onClick={() => {
                  setTransactionInfo({
                    ...transactionInfo,
                    transactionId: data?.transactionId,
                    partnerId: data?.partnerTransaction,
                  });
                  setShowModalRefund(true);
                }}>
                {t('Issue Refund')}
              </button>
            </div>
          </div>
        )}
        {/* --------------------------- ------------------ ------------------------------- */}
        {data?.state && (
          <div className='d-flex justify-content-between align-items-center row-custom'>
            <div className='col-left'>{t('Trạng thái:')}</div>
            {data?.state && (
              <div className='col-right text-right'>
                <span className={`${renderStatus(data?.state)}`}>
                  {t(renderState(data?.state))}
                </span>
              </div>
            )}
          </div>
        )}
        {data?.accountId && (
          <div className='d-flex justify-content-between row-custom'>
            <div className='col-left'>{t('Mã tài khoản:')}</div>
            <div className='col-right text-right'>{data?.accountId}</div>
          </div>
        )}
        {data?.partnerTransaction && (
          <div className='d-flex justify-content-between row-custom'>
            <div className='col-left'>{t('Mã doanh nghiệp:')}</div>
            <div className='col-right text-right'>{data?.merchantId}</div>
          </div>
        )}
        {data?.merchantName && (
          <div className='d-flex justify-content-between row-custom'>
            <div className='col-left'>{t('Doanh nghiệp:')}</div>
            <div className='col-right text-right'>{data?.merchantName}</div>
          </div>
        )}
        {data?.cardType && (
          <div className='d-flex justify-content-between row-custom'>
            <div className='col-left'>{t('Loại thẻ:')}</div>
            <div className='col-right text-right'>{data?.cardType}</div>
          </div>
        )}
        {data?.cardNumber && (
          <div className='d-flex justify-content-between row-custom'>
            <div className='col-left'>{t('Mã số thẻ:')}</div>
            <div className='col-right text-right'>{data?.cardNumber}</div>
          </div>
        )}
        {data?.crossCheckId && (
          <div className='d-flex justify-content-between row-custom'>
            <div className='col-left'>{t('Mã đối soát:')}</div>
            <div className='col-right text-right'>{data?.crossCheckId}</div>
          </div>
        )}
        {data && (
          <div className='d-flex justify-content-between align-items-center row-custom'>
            <div className='col-left'>{t('Trạng thái đối soát:')}</div>
            <div
              className={`col-right text-white ${data?.crossCheckState === 'PAID'
                ? 'state-success-modal'
                : data?.crossCheckState === 'PENDING'
                  ? 'state-pending-modal'
                  : 'state-cancel-modal'
                }`}>
              {data?.crossCheckState === 'PENDING'
                ? t('Chờ đối soát')
                : data?.crossCheckState === 'PAID'
                  ? t('Đã đối soát')
                  : t('Chưa đối soát')}
            </div>
          </div>
        )}
        {data?.supplierId && (
          <div className='d-flex justify-content-between row-custom'>
            <div className='col-left'>{t('Mã GD NCC:')}</div>
            <div className='col-right text-right'>{data?.supplierTransaction}</div>
          </div>
        )}
        {data?.supplierName && (
          <div className='d-flex justify-content-between row-custom'>
            <div className='col-left'>NCC:</div>
            <div className='col-right text-right'>{data?.supplierName}</div>
          </div>
        )}
        {data?.issuerName && (
          <div className='d-flex justify-content-between row-custom'>
            <div className='col-left'>NPH:</div>
            <div className='col-right text-right'>{data?.issuerName}</div>
          </div>
        )}
        {data?.method && (
          <div className='d-flex justify-content-between row-custom'>
            <div className='col-left'>PTTT:</div>
            <div className='col-right text-right'>{t(data?.method)}</div>
          </div>
        )}
        {data?.paymentMainType && (
          <div className='d-flex justify-content-between row-custom'>
            <div className='col-left'>{t('Loại GD:')}</div>
            <div className='col-right text-right'>{t('TRANSACTION_' + data?.paymentMainType)}</div>
          </div>
        )}
        {data?.storeId && (
          <div className='d-flex justify-content-between row-custom'>
            <div className='col-left'>Mã cửa hàng:</div>
            <div className='col-right text-right'>{data.storeId}</div>
          </div>
        )}
        {data?.storeName && (
          <div className='d-flex justify-content-between row-custom'>
            <div className='col-left'>Tên cửa hàng:</div>
            <div className='col-right text-right'>{data.storeName}</div>
          </div>
        )}
        {data?.clientIp && (
          <div className='d-flex justify-content-between row-custom'>
            <div className='col-left'>Client IP:</div>
            <div className='col-right text-right'>{data.clientIp}</div>
          </div>
        )}
        <div className=''>
          <div className='col-left w-100'>Extend Data:</div>
          <div className='col-right text-left w-100 json-data'>
            <ReactJson
              collapsed
              displayDataTypes={false}
              name='value'
              src={JSON.parse(data?.extraData as any || '{}')}></ReactJson>
          </div>
        </div>
        <div className='mt-2'>
          <div className='col-left w-100'>PayME Requested:</div>
          <div className='col-right text-left w-100 json-data'>
            <ReactJson
              collapsed
              displayDataTypes={false}
              name='value'
              src={JSON.parse(data?.paymeRequested as any || '{}')}></ReactJson>
          </div>
        </div>
        <div className='mt-2'>
          <div className='col-left w-100'>Supplier Response:</div>
          <div className='col-right text-left w-100 json-data'>
            {
              data?.supplierResponsed!.map(item => {
                return <ReactJson
                  collapsed
                  displayDataTypes={false}
                  name='value'
                  src={JSON.parse(item as any || '{}')}>
                </ReactJson>
              })
            }
          </div>
        </div>
      </div>
      <ModalRefund
        t={t}
        show={isShowModalRefund}
        handleClose={() => setShowModalRefund(false)}
        transactionInfo={transactionInfo}
        handleRecall={handleRecall}
      />
    </>
  );
}
