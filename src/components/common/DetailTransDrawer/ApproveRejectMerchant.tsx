import React, { useState } from 'react';
import ModalReject from 'components/Merchant/pendingListMerchant/ModalReject';
import { useDispatch } from 'react-redux';
import { approvePendingMerchant, getTotalPendingMerchant } from 'redux/actions';
import alert from 'utils/helpers/alert';

interface ApproveRejectMerchantProps {
  t: (a: string) => string;
  info: {
    requestId: number,
    state: string,
    isTurn: boolean,
  };
  closeDrawerDetail?: () => void;
  handleRecall?: (a: boolean) => void;
}

const ApproveRejectMerchant: React.FC<ApproveRejectMerchantProps> = ({
  t,
  info,
  closeDrawerDetail,
  handleRecall,
}) => {
  const dispatch = useDispatch();
  const { requestId, isTurn, state } = info || {};
  const [show, setShow] = useState<boolean>(false);

  const handleAprroveMerchant = () => {
    const payload = {
      requestId,
    };

    dispatch(
      approvePendingMerchant(payload, (status, response) => {
        if (status) {
          alert('success', response.message, t);
          closeDrawerDetail && closeDrawerDetail();
          handleRecall && handleRecall(true);

          dispatch(
            getTotalPendingMerchant(
              {
                filter: {
                  state: 'PENDING',
                },
              },
              (status) => {
                if (status) {
                  console.log('Lấy tổng merchant chờ duyệt thành công!');
                }
              }
            )
          );
        } else {
          alert('error', response.message, t);
        }
      })
    );
  };

  return (
    <>
      {isTurn && state === 'PENDING' && (
        <div className='approve-merchant-wrapper mb-3'>
          <div className='col-left mx-2'>
            <button className='btn btn-approve' onClick={handleAprroveMerchant}>
              <i className='fas fa-check'></i>
              {t('Duyệt')}
            </button>
          </div>
          <div className='col-right mx-2'>
            <button className='btn btn-cancel' onClick={() => setShow(true)}>
              <i className='fas fa-times'></i>
              {t('Từ chối')}
            </button>
          </div>
        </div>
      )}
      <ModalReject
        t={t}
        show={show}
        handleClose={() => setShow(false)}
        requestId={requestId}
        handleRecall={handleRecall}
        closeDrawerDetail={closeDrawerDetail}
      />
    </>
  )
}

export default ApproveRejectMerchant;