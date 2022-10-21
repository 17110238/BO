import React from 'react';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import ReactSelect from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';

interface PropsComponent {
  isShow: boolean;
  onHide: () => void;
}

export default function ModalTempPassword({ isShow, onHide }: PropsComponent) {
  const { t } = useTranslation('common');
  const option = [
    {
      label: 'Hết hạn sau 5 phút',
      value: '5minute',
    },
    {
      label: 'Hết hạn sau 10 phút',
      value: '10minute',
    },
    {
      label: 'Hết hạn sau 20 phút',
      value: '20minute',
    },
    {
      label: 'Hết hạn sau 30 phút',
      value: '30minute',
    },
    {
      label: 'Hết hạn sau 1 giờ',
      value: '1hour',
    },
  ];
  return (
    <>
      <Modal
        className='modal-storeMember modal-tempPassword'
        show={isShow}
        onHide={onHide}
        backdrop='static'>
        <Modal.Header closeButton>
          <div className='modal-storeMember__title'>
            <p>{t('Thêm Nhân Viên')}</p>
          </div>
        </Modal.Header>
        <Modal.Body>
          <form className='modal-storeMember__content'>
            <div className='modal-storeMember__group'>
              <label>{t('Thời gian hết hạn')}</label>
              <ReactSelect
                styles={customStyles}
                className='storeMember-select'
                classNamePrefix='storeMember-select'
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: '#EFF2F7',
                    primary: '#00be00',
                  },
                })}
                noOptionsMessage={() => t('Không có kết quả tìm kiếm')}
                options={option}
              />
            </div>
            <div className='modal-storeMember__group'>
              <label>
                {t('Tên Tài Khoản')}
                <span className='text-danger'>(*)</span>
              </label>
              <input type='text' className='modal-storeMember__input' placeholder='Tên tài khoản' />
            </div>
            <div className='modal-storeMember__submit'>
              <button className='btn btn-primary'>Lấy thông tin</button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}
