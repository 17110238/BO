import Loading from 'components/common/Loading/LoadingFullScreen';
import ModalReject from 'components/Merchant/pendingListMerchant/ModalReject';
import { MerchantAccount, MerchantState } from 'models';
import React, { ReactNode, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { requestChangedMessage, sendMail } from 'redux/actions/messageActions';
import { CKEditor, CKEditorEventHandler } from 'ckeditor4-react';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import alert from 'utils/helpers/alert';
import { approvePendingMerchant, getTotalPendingMerchant } from 'redux/actions';
import ApproveRejectMerchant from './ApproveRejectMerchant';
interface DetailTransDrawerProps {
  idDetail: number;
  closeDrawerDetail?: () => void;
  showOtherDetail?: ((type: string, itemId: number) => void) | undefined;
  t: (a: string) => string;
  info: {
    requestId: number,
    isTurn: boolean,
    state: string,
  };
  handleRecall?: (a: any) => void;
  submitForm?: boolean;
}

const DetailApproveMessage: React.FC<DetailTransDrawerProps> = ({
  idDetail, //payment id để gọi api
  closeDrawerDetail, // đặt lại openDetailTrans false
  showOtherDetail, // hiển thị popup khác
  t,
  info,
  handleRecall,
  submitForm,
}) => {
  const dispatch = useDispatch();
  const [data, setData] = useState<MerchantAccount | any>();
  const [show, setShow] = useState<boolean>(false);
  const { requestId, isTurn, state } = info || {};
  const isLoading = useSelector<any, MerchantState>((state) => state?.merchantRD?.loading);
  const [templateContent, setTemplateContent] = useState<ReactNode | any>('');
  const [emailList, setEmailList] = useState<any>([]);

  useEffect(() => {
    dispatch(
      requestChangedMessage({ id: requestId }, (status, response) => {
        if (status) {
          setData(response?.data);
        }
      })
    );
  }, []);

  const handleSendEmail = () => {
    const joinEmail = emailList.join(',');
    if (!joinEmail) return;

    const payload = {
      content: data?.content,
      email: joinEmail,
      title: data?.title,
    }

    dispatch(
      sendMail(payload, (status, response) => {
        if (status) {
          alert('success', response.message, t);
        } else {
          alert('error', response.message, t);
        }
      })
    )
  }

  const renderEmailList = (emailList: string[]) => {
    return emailList?.map((email: string, index: number) => (
      <div
        key={index}
        className='email-item'
      >
        {email}
      </div>
    ))
  }

  const handleChangeTags = (tags: any) => {
    setEmailList(tags);
  };

  return (
    <>
      <div className='atbd-drawer__header d-flex aling-items-center justify-content-between'>
        <h6 className='drawer-title'>
          {t('Chi tiết yêu cầu ')} <span className='title-id'>{requestId}</span>
        </h6>
        <img
          src='/assets/img/icon-close-modal.svg'
          className='icon-close-modal icon-close'
          onClick={closeDrawerDetail}
          alt='close-icon'
        />
      </div>
      <div className='box-body-payment'>
        <div className='row-custom'>
          <div className='col-left'>{t('Tiêu đề')}:</div>
          <div className='col-right text-right'>
            {data?.title}
          </div>
        </div>
        <div className='row-custom'>
          <div className='col-left'>{t('Danh sách email')}:</div>
          <div className='col-right col-email text-right'>
            {
              data?.customer === 'ALL' ?
                'Tất cả'
                :
                <div className="email-list-wrapper">
                  {renderEmailList(data?.accountList)}
                </div>
            }
          </div>
        </div>
        <div className='row-custom'>
          <div className='col-left'>{t('Gửi thử')}:</div>
          <div className='text-right send-email-wrapper'>
            <TagsInput
              value={emailList}
              validationRegex={
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              }
              onChange={handleChangeTags}
              addKeys={[188, 13]}
              inputProps={{
                placeholder: t('Nhập email khách hàng cách nhau dấu ,'),
                style: { minWidth: '250px' },
              }}
              addOnBlur={true}
            />
            <button
              className='btn btn-primary'
              onClick={handleSendEmail}
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>

        <div className='row-custom'>
          <div className='col-left'>{t('Nội dung')}:</div>
        </div>
        <div className=''>
          {
            data?.content &&
            <CKEditor<{ onChange: CKEditorEventHandler<'change'> }>
              initData={data?.content}
              onChange={(evt) => setTemplateContent(evt.editor.getData())}
              config={{
                toolbar: [],
                readOnly: true,
                allowedContent: true,
                height: '580px',
              }}
            />
          }
        </div>
      </div>
      <ApproveRejectMerchant
        t={t}
        info={info}
        closeDrawerDetail={closeDrawerDetail}
        handleRecall={handleRecall}
      />
      {isLoading && <Loading />}
    </>
  );
};

export default DetailApproveMessage;
