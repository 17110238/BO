import React from 'react'
import { useTranslation } from 'react-i18next';

const IcExport = '/assets/img/emailsms/export.svg';


interface Props {
    showFilter? : boolean
}

const HeaderAccount : React.FC<Props> = ({
    showFilter
}) => {
    const { t } = useTranslation('common');
    return (
        <div className='header-title-payment'>
            <div className='title-payment'>{t('Manage accounts')}</div>
            <div className='box-btn-payment'>
                {/* <button
                    className={`btn btn-filter${showFilter ? '-active' : ''} mr-3`}
                    onClick={() => toggleFilter()}>
                    <img
                        src={`/assets/img/Icon-filter${showFilter ? '_active.png' : '.png'}`}
                        className='mr-2'
                        alt=''></img>
                    {showFilter ? t('Hide filter') : t('Filter')}
                </button> */}
                {/* <button className="export-btn-account-mc btn" 
                    // onClick={onClickExport}
                    >
                    <span className="export-btn__image"></span>
                    {t("Xuất File")}
                </button> */}
            </div>
        </div>
    )
}
export default HeaderAccount
