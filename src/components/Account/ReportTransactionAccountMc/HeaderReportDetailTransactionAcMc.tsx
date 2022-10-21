import React from 'react'
import { useTranslation } from "react-i18next";



interface Props {
    onClickHeader? : () => void;
    title?: string;
}

const HeaderReportDetailTransactionAcMc : React.FC<Props> = ({
    onClickHeader,
    title,
}) => {
    const { t } = useTranslation("common");
    return (
        <div className='header-detail-report-transaction'>
            <p className='header-detail-report-transaction__title' onClick={onClickHeader} >
                {t(title || '')}
            </p>
        </div>
    )
}

export default HeaderReportDetailTransactionAcMc