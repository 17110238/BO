import { t } from 'i18next';
import React from 'react';
import PasswordTemporaryForm from './PasswordTemporaryForm';

const PasswordTemporaryContainer: React.FC = (props: any) => {

  const onSubmitForm = (data: any) => {
    console.log({data});
  }

  return (
    <div className='box-content password-temporary-container'>
      <div className="password-temporary-header">
        <h5>Mật khẩu tạm</h5>
      </div>
      <div className="password-temporary-body">
        <div className="password-modal">
          <div className="password-modal__header">
            <h5>Tạo mật khẩu tạm</h5>
          </div>
          <PasswordTemporaryForm onSubmitForm={onSubmitForm} />
        </div>
      </div>
    </div>
  );
};

export default PasswordTemporaryContainer;
