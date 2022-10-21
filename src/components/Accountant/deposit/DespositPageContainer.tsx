import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen'
import { AccountantCrossCheck } from 'models'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getListAccountantCrossCheck } from 'redux/actions/accountantAction'
import ModalDeposit from '../Modal/ModalDeposit'
import ConfirmDeposit from './ConfirmDeposit'
import DataTableDepositUpdate from './DataTableDepositUpdate'
import ReportSummaryRevenue from './ReportSumaryRevenue'


const DespositPageContainer = () => {
    const router = useRouter()
    const { t } = useTranslation("common")
    const dispatch = useDispatch()
    const crossCheckList = useSelector<any, AccountantCrossCheck[]>((state) => state?.crossCheckReducer?.dataCrossCheck);
    const isLoading = useSelector<any, AccountantCrossCheck[]>((state) => state?.crossCheckReducer?.loading);
    const isLoadingReject = useSelector<any, AccountantCrossCheck[]>((state) => state?.crossCheckReducer?.loadingReject);
    const isLoadingConfirm = useSelector<any, AccountantCrossCheck[]>((state) => state?.crossCheckReducer?.loadingConfirm);
    let numberDespositAmount: number = 0
    crossCheckList?.map((item) => { numberDespositAmount = numberDespositAmount + item?.amountCrossCheck   })
    useEffect(() => {
        let payload = {
            filter: {
                campaignId: router.query.index
            }
        }
        dispatch( getListAccountantCrossCheck(payload, (status, res) => { }) );
    }, [])
    return (
        <>
            <div className="div" style={{height:'100vh'}}>
            <ConfirmDeposit dataAmount={numberDespositAmount} dataTable={crossCheckList} />
            <ReportSummaryRevenue data={crossCheckList} />
            < DataTableDepositUpdate
                data={crossCheckList}
            />
            {isLoadingConfirm && <LoadingFullScreen />}
            {isLoadingReject && <LoadingFullScreen />}
                {isLoading && <LoadingFullScreen />}
                </div>
        </>
    )
}

export default DespositPageContainer