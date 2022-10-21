import { typeGetTopTransactionByAccountReponsed, typeGetTopTransactionByDate } from 'models'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAppInfo } from 'redux/actions'
import TopTransactionBoxSearchDefault from './TopTransactionBoxSearchDefault'
import TopTransactionDataTableDefaultAmount from './TopTransactionDataTableDefaultAmount'
import TopTransactionDataTableDefaultCount from './TopTransactionDataTableDefaultCount'
import TopTransactionDataTableDefaultDay from './TopTransactionDataTableDefaultDay'
import TopTransactionHeaderDefault from './TopTransactionHeaderDefault'


interface propsType{
  isShowFilter: boolean;
  
}
const TopTransactionContainerDefault = ({ isShowFilter }:propsType) => {
  const dispatch = useDispatch();
  const [showDay, setShowDay] = useState<boolean>(true);
  const [showAmount, setShowAmount] = useState<boolean>(true);
  const [showCount, setShowCount] = useState<boolean>(true);
  const dataByAccount = useSelector<any, typeGetTopTransactionByAccountReponsed[]>(state => state.eWalletTransactionReportReducer.arrTopTransactionByAccount) || [];
  const dataByCount = useSelector<any, typeGetTopTransactionByAccountReponsed[]>(state => state.eWalletTransactionReportReducer.arrTopTransactionByCount) || [];
  const dataByDate = useSelector<any, typeGetTopTransactionByDate[]>(state => state.eWalletTransactionReportReducer.arrTopTransactionByDate) || [];
  const loadingAccount = useSelector<any, boolean>(state => state.eWalletTransactionReportReducer.loadingAccount);
  const loadingDate = useSelector<any, boolean>(state => state.eWalletTransactionReportReducer.loadingDate);




  const handleShowDay = () => setShowDay(!showDay)
  const handleShowAmount = () => setShowAmount(!showAmount)
  const handleShowCount = () => setShowCount(!showCount)

  return (
    <>
      <div className='topTransactionDefault-container'>

        {/* <TopTransactionHeaderDefault /> */}
        <TopTransactionBoxSearchDefault loading={loadingAccount} isShowFilter={isShowFilter }/>
        <TopTransactionDataTableDefaultAmount show={showAmount} handleShow={handleShowAmount} data={dataByAccount} loading={loadingAccount} />
        <TopTransactionDataTableDefaultCount show={showCount} handleShow={handleShowCount} data={dataByCount} loading={loadingAccount} />
        <TopTransactionDataTableDefaultDay show={showDay} handleShow={handleShowDay} data={dataByDate} loading={loadingDate} />
      </div>

    </>
  )
}

export default TopTransactionContainerDefault