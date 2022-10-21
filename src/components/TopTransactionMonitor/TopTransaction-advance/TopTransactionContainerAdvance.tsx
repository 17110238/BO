import { typeGetTopTransactionByAccountReponsed } from 'models'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { boolean } from 'yup'
import TopTransactionBoxSearchAdvance from './TopTransactionBoxSearchAdvance'
import TopTransactionDataTableAdvance from './TopTransactionDataTableAdvance'

import TopTransactionHeaderAdvance from './TopTransactionHeaderAdvance'
interface propsType {
  isShowFilter: boolean;
}
const TopTransactionContainerAdvance = ({isShowFilter}:propsType) => {
  const router = useRouter();
  const [showDay, setShowDay] = useState<boolean>(true)
  const dataByAccount = useSelector<any, typeGetTopTransactionByAccountReponsed[]>(state => state.eWalletTransactionReportReducer.arrTopTransactionByAccount) || [];
  const loadingAccount = useSelector<any, boolean>(state => state.eWalletTransactionReportReducer.loadingAccount);
  const handleShowDay = () => setShowDay(!showDay);

  return (
    <>
      <div className='topTransactionDefault-container'>

        {/* <TopTransactionHeaderAdvance /> */}
        <TopTransactionBoxSearchAdvance loadingAccount={loadingAccount} isShowFilter={ isShowFilter}/>
        <TopTransactionDataTableAdvance show={showDay} handleShow={handleShowDay} data={dataByAccount} loadingAccount={loadingAccount} />
      </div>

    </>
  )
}

export default TopTransactionContainerAdvance