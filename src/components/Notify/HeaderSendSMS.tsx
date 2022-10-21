import React, { useState, useEffect } from 'react';
import 'react-tabs/style/react-tabs.css';

interface HeaderHistoryProps {
  t: (a: string) => string;
  handleHideSmsBox: () => void;
  showFormSms: boolean;
}

const HeaderHistory: React.FC<HeaderHistoryProps> = ({ t, handleHideSmsBox, showFormSms }) => {
  const [icon, setIcon] = useState<string>('minus');

  const handleChangeIcon = () => {
    if (icon === 'minus') {
      setIcon('plus');
    } else {
      setIcon('minus');
    }
  };

  const handleHideBox = () => {
    handleChangeIcon();
    handleHideSmsBox();
  };

  return (
    <div className={`header-notify-history-container ${!showFormSms ? 'hide' : ''}`}>
      <p className='header-notify-history__title'>{t('Gửi thông báo')}</p>
      <button className={`btn hide-btn`} onClick={handleHideBox}>
        <i className={`fas fa-${icon}`}></i>
      </button>
    </div>
  );
};

export default HeaderHistory;
