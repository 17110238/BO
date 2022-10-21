import React from 'react'
import { useTranslation } from 'react-i18next'

const HeaderWordFillter = () => {
  const {t}= useTranslation('common')
  return (
    <>
      <div className='deposit-manage-container deposit-manage'>
        <div className='deposit-manage__header-block'>
          <h4 className='header-block__title'>{t('Quản lý word-filter')}</h4>
          <div className='header-block__group-btn'>
           
          </div>
        </div>
      </div>
    </>
  )
}

export default HeaderWordFillter