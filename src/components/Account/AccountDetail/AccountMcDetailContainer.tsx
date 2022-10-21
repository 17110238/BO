import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export interface AccountMcDetailProps {
  show?: boolean;
  handleToggleModalDetail: () => void;
}

const AccountMcDetailContainer: React.FC<AccountMcDetailProps> = ({
  show,
  handleToggleModalDetail,
}) => {
  const { t } = useTranslation('common');
  return (
    <>
      <Modal show={show} onHide={handleToggleModalDetail}>
        <Modal.Header closeButton>
          <Modal.Title>{t('Cập nhập thông tin')}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '0' }}>
          <div className='detail-account-mc-container w-100 h-100 bg-white p-4'>
            <div className='body-detail-account-mc-profile'>
              <form className='section-form'>
                <div className='section-body'>
                  <div className='inputs-group'>
                    <div className='form-group'>
                      <label>{t('ID')}</label>
                      <input readOnly />
                    </div>
                    <div className='form-group'>
                      <label>{t('Tên đăng nhập')}</label>
                      <input />
                    </div>
                    <div className='form-group'>
                      <label>{t('Số điện thoại')}</label>
                      <input />
                    </div>
                    <div className='form-group'>
                      <label>{t('Email')}</label>
                      <input />
                    </div>
                    <div className='form-group'>
                      <label>{t('Status')}</label>
                      <select name='status' className='form-control'>
                        <option value='ALL'>{t('All')}</option>
                        <option value='ACTIVE'>{t('Active')}</option>
                        <option value='INACTIVE'>{t('Inactive')}</option>
                      </select>
                    </div>
                    <div className='form-group'>
                      <label>{t('Ngày sinh')}</label>
                      <input placeholder='DD/MM/YYYY' />
                    </div>
                    <div className='form-group'>
                      <label>{t('Số CMND')}</label>
                      <input />
                    </div>
                    <div className='form-group'>
                      <label>{t('Ngày cấp')}</label>
                      <input />
                    </div>
                    <div className='form-group'>
                      <label>{t('Nơi cấp')}</label>
                      <input />
                    </div>
                    <div className='form-group'>
                      <label>{t('Số điện thoại')}</label>
                      <input />
                    </div>
                    <div className='form-group'>
                      <label>{t('Email')}</label>
                      <input />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '25px' }}>
            <Button variant='primary' onClick={handleToggleModalDetail}>
              {t('Cập nhập')}
            </Button>
            <Button
              variant='secondary'
              style={{ marginLeft: '10px' }}
              onClick={handleToggleModalDetail}>
              {t('Đóng')}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AccountMcDetailContainer;
