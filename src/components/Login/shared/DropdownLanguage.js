import { useOnClickOutside } from 'utils/hooks';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

function DropdownLanguage() {
  const dropdownRef = useRef(null);
  const { t, i18n } = useTranslation('common');
  const [isDropdown, setIsDropdown] = useState(false);
  useOnClickOutside(dropdownRef, () => setIsDropdown(false));

  const handleSelectLanguage = () => {
    setIsDropdown(!isDropdown);
  };

  const handleChangeLanguage = (lang) => {
    setIsDropdown(false);
    i18n.changeLanguage(lang || 'vi');
    if (typeof window !== 'undefined') {
      localStorage.setItem('NEXT_LOCALE', lang);
    }
  };

  return (
    <div className='dropdown-lang' ref={dropdownRef}>
      <div className='dropdown-lang-content' onClick={handleSelectLanguage}>
        <img src={t('flag')} alt='' />
        <span>{t('flagContent')}</span>
        <img className='ml-1' src='/assets/images/dropdown.svg' alt='' />
      </div>
      {isDropdown && (
        <div className='languages'>
          <div className='lang-item' onClick={() => handleChangeLanguage('vi')}>
            <img src='/assets/images/vi.png' alt='' />
            <span>Tiếng Việt</span>
          </div>
          <div className='lang-item' onClick={() => handleChangeLanguage('en')}>
            <img src='/assets/images/en.png' alt='' />
            <span>English</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default DropdownLanguage;
