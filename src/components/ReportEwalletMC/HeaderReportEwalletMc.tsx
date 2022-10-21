import React from 'react'
import { useTranslation } from 'react-i18next';

interface Props {
  showFilter?: boolean;
  toggleFilter: () => void;
}

const HeaderReportEwalletMc: React.FC<Props> = ({
  showFilter,
  toggleFilter,
}) => {

  const { t } = useTranslation('common')

  return (
    <div className='header-title-payment'>
      <div className='title-payment'>{t('Báo cáo số dư đối tác')}</div>
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
        {/* <button type="button" className="btn disableHover btn-export" style={{whiteSpace: 'nowrap'}}>
          <img src="/assets/icon/export-icon.png" alt="export=icon"/>
          Xuất file
        </button> */}
      </div>
    </div>
  )
}

export default HeaderReportEwalletMc