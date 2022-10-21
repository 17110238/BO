import React, { FC, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import TagsInput from 'react-tagsinput';

interface Props {
  show: boolean;
  onHide: () => void;
  emailList: string[];
  handleChangeTags: (tags: any) => void;
  handleSendTestMail: () => void;
}

const MessageCustomeModal: FC<Props> = ({
  show,
  onHide,
  emailList,
  handleChangeTags,
  handleSendTestMail,
}) => {
  const { t } = useTranslation('common');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setError('');
  }, [show]);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Danh sách gửi thử</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='form-group'>
          <TagsInput
            value={emailList}
            validationRegex={
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            }
            onChange={handleChangeTags}
            className='form-control base-input'
            addKeys={[188, 13]}
            inputProps={{
              placeholder: t('Nhập email khách hàng cách nhau dấu ,'),
              style: { minWidth: '250px' },
            }}
            addOnBlur={true}
          />
          {error.length > 0 && <span style={{ color: 'red' }}>{error}</span>}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          style={{ height: 'fit-content', fontSize: 'medium', lineHeight: '40px' }}
          onClick={() => {
            emailList.length > 0
              ? handleSendTestMail()
              : setError('Vui lòng nhập danh sách người nhận');
          }}
          className='btn btn-success py-0'>
          {t('Gửi thử')}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default MessageCustomeModal;
