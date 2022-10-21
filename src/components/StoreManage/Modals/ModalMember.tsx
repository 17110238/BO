import React from 'react';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import ReactSelect from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';

interface PropsComponent {
  isShow: boolean;
  isEdit: boolean;
  onHide: () => void;
}

export default function ModalMember({ isShow, isEdit, onHide }: PropsComponent) {
  const { t } = useTranslation('common');
  return (
    <>
      <Modal className='modal-storeMember' show={isShow} onHide={onHide} backdrop='static'>
        <Modal.Header closeButton>
          <div className='modal-storeMember__title'>
            <p>{t('Thêm Nhân Viên')}</p>
          </div>
        </Modal.Header>
        <Modal.Body>
          <form className='modal-storeMember__content'>
            <div className='modal-storeMember__group'>
              <label>
                {t('Tên Tài Khoản')}
                <span className='text-danger'>(*)</span>
              </label>
              <input type='text' className='modal-storeMember__input' placeholder='Tên tài khoản' />
            </div>
            <div className='modal-storeMember__group'>
              <label>
                {t('Tên Đăng Nhập')}
                <span className='text-danger'>(*)</span>
              </label>
              <input type='text' className='modal-storeMember__input' placeholder='Tên đăng nhập' />
            </div>
            <div className='modal-storeMember__group'>
              <label>{t('Phone')}</label>
              <input type='text' className='modal-storeMember__input' placeholder='Số điện thoại' />
            </div>
            <div className='modal-storeMember__group'>
              <label>
                {t('Mật khẩu')}
                <span className='text-danger'>(Nhập 6 ký tự số)</span>
              </label>
              <input type='text' className='modal-storeMember__input' placeholder='Mật khẩu' />
            </div>
            <div className='modal-storeMember__group'>
              <label>{t('Loại tài khoản')}</label>
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
              />
            </div>
            <div className='modal-storeMember__group'>
              <label>{t('Trạng thái')}</label>
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
              />
            </div>
            <div className='modal-storeMember__group select-custom'>
              <label>{t('Cửa hàng phụ trách')}</label>
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
              />
            </div>
            <div className='modal-storeMember__submit'>
              <button className='btn btn-primary'>Thêm mới</button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}
