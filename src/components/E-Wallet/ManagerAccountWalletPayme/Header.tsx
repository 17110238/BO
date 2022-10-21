import React from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  showFilter?: boolean;
  toggleFilter: () => void;
  handleShowModal: () => void;
}

const Header: React.FC<Props> = ({
  showFilter,
  toggleFilter,
  handleShowModal,
}) => {

  const { t } = useTranslation('common')

  return (
    <div className='header-title-payment'>
      <div className='title-payment'>{t('Quản lý tài khoản ví nhân viên payme')}</div>
      <div className='box-btn-payment'>
        <button
          className={`btn btn-filter${showFilter ? '-active' : ''}`}
          onClick={() => toggleFilter()}>
          <img
            src={`/assets/img/Icon-filter${showFilter ? '_active.png' : '.png'}`}
            className='mr-2'
            alt=''></img>
          {showFilter ? t('Hide filter') : t('Filter')}
        </button>
        <button className='btn btn-secondary btn-add ml-3' onClick={() => handleShowModal()}>
          <i className="fa fa-user-plus mr-0" style={{ fontSize: "1.25rem" }}></i>
        </button>
      </div>
    </div>
  )
}

export default Header