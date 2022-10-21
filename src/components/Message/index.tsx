import { GetEmailTemplateInput } from 'models';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getListTemplate } from 'redux/actions';
import MessageForm from './form';

interface Props {}

const Message: FC<Props> = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation('common');
  const [emailTemplates, setEmailTemplates] = useState<any>([]);

  useEffect(() => {
    const payload: GetEmailTemplateInput = {
      filter: {},
      paging: {
        start: 0,
        limit: 50,
      },
    };
    dispatch(
      getListTemplate(payload, (status, res) => {
        if (status) {
          if (res.data.length > 0) {
            res.data.map((template: any) => {
              setEmailTemplates((prevTemplates: any) => [
                ...prevTemplates,
                { value: template.content, label: template.title },
              ]);
            });
          }
        }
      })
    );
  }, [getListTemplate]);

  return (
    <div id='Message'>
      <div className='title'>
        <p className='header__title'>{t('Thông báo')}</p>
      </div>
      {emailTemplates.length > 0 && <MessageForm emailTemplates={emailTemplates} />}
    </div>
  );
};

export default Message;
