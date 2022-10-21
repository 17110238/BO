import React from 'react';
import { useTranslation } from 'react-i18next';

interface Prop {
  onClickHeader?: () => void;
  title?: string;
  rightControlElement?: any;
}

const HeaderMerchantContainer: React.FC<Prop> = ({ onClickHeader, title, rightControlElement }) => {
  const { t } = useTranslation('common');
  return (
    <>
      <div className='block-section-body__top-section'>
        <p className='top-section__title' onClick={onClickHeader}>
          {t(title || '')}
        </p>

        {rightControlElement}
      </div>
    </>
  );
};

export default HeaderMerchantContainer;
