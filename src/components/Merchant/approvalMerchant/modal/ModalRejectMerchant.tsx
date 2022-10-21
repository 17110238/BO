import React, { useMemo } from 'react';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import ReactSelect from 'react-select';
import { useDispatch } from 'react-redux';
import { rejectMerchant } from 'redux/actions';
import alert from 'utils/helpers/alert';

interface Props {
  merchantId: number;
  show: boolean;
  onHide?: (type?: string) => void;
}

interface RejectPayload {
  rejectReason: string[];
}

const ModalRejectMerchant: React.FC<Props> = ({ merchantId, show = false, onHide }) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const { control, handleSubmit } = useForm<RejectPayload>({
    defaultValues: {
      rejectReason: [],
    },
  });
  const lang = localStorage.getItem('NEXT_LOCALE');

  const rejectOptions = useMemo(
    () =>
      [
        'Hình ảnh giấy tờ tùy thân bị mờ.',
        'Hình ảnh giấy tờ tùy thân bị loé sáng.',
        'Hình ảnh giấy tờ tùy thân bị mất góc.',
        'Hình ảnh không phải là giấy tờ tuỳ thân.',
        'Hình ảnh giấy tờ tùy thân mặt trước và mặt sau giống nhau.',
        'Hình ảnh giấy tờ tùy thân không chụp từ bản gốc.',
        'Hình ảnh giấy tờ tùy thân chụp từ màn hình thiết bị khác.',
        'Giấy tờ tuỳ thân hết hạn sử dụng.',
        'Giấy tờ tuỳ thân không còn giá trị sử dụng.',
        'Thông tin cá nhân đã được sử dụng để đăng ký tài khoản khác.',
        'Hộ chiếu chỉ dùng để định danh cho người nước ngoài.',
        'Hình ảnh giấy phép đăng ký kinh doanh không chụp từ bản gốc.',
        'Hình ảnh giấy phép đăng ký kinh doanh bị mờ.',
        'Hình ảnh giấy phép đăng ký kinh doanh bị loé sáng.',
        'Hình ảnh giấy phép đăng ký kinh doanh bị mất góc.',
        'Hình ảnh giấy phép đăng ký kinh doanh bị thiếu thông tin.',
        'Hình ảnh không phải là giấy phép đăng ký kinh doanh.',
        'Hình ảnh giấy phép đăng ký kinh doanh chụp từ màn hình thiết bị khác.',
        'Mã số thuế trên giấy phép đăng ký kinh doanh đã được đăng ký cho tài khoản khác.',
        'Mã số thuế của doanh nghiệp đã bị đóng.',
        'Hình ảnh giấy tờ tùy thân đã qua chỉnh sửa.',
        'Giấy tờ tùy thân đã qua chỉnh sửa',
        'Ngành nghề kinh doanh không cụ thể',
        'Thiếu thông tin, giấy tờ liên quan',
        'Quá hạn đăng ký nhưng đối tác không phản hồi',
        'Quá hạn đăng ký nhưng không liên hệ được đối tác',
      ].map((ele) => ({
        value: ele,
        label: t(ele),
      })),
    [lang]
  );

  const handleSubmitFormReject: SubmitHandler<RejectPayload> = (data, e) => {
    e?.preventDefault();

    dispatch(
      rejectMerchant(
        {
          merchantId,
          ...data,
        },
        (state, res) => {
          if (state) {
            onHide && onHide('RESET_FORM');
            alert('success', res.message, t);
          } else {
            alert('error', res.message, t);
          }
        }
      )
    );
  };

  return (
    <Modal show={show} onHide={onHide} className='modal-reject-merchant' backdrop='static'>
      <Modal.Header closeButton>
        <p className='modal-reject-merchant__title m-0'>
          {t('Từ chối KYC ')}
          <span>[MC {merchantId}]</span>
        </p>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(handleSubmitFormReject)}>
          <div className='inputs-group'>
            <div className='form-group'>
              <label>{t('Lý do không duyệt')}</label>
              <Controller
                control={control}
                name='rejectReason'
                render={({ field }) => {
                  return (
                    <ReactSelect
                      className='select-input-form'
                      classNamePrefix='input-select'
                      placeholder={t('Chọn lý do')}
                      options={rejectOptions}
                      isMulti={true}
                      onChange={(newValue) => {
                        field.onChange(newValue.map((ele) => ele.value));
                      }}
                    />
                  );
                }}
              />
            </div>
          </div>
          <div>
            <button className='btn btn-danger w-25 mt-3 mx-auto'>{t('Reject')}</button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalRejectMerchant;
