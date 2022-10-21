import React, { useState } from "react";
import BoxSearchReportTransaction from "./BoxSearchReportTransaction";
import DataTableReportTransaction from "./DataTableReportTransaction";
import HeaderReportTransaction from "./HeaderReportTransaction"
import { useTranslation } from 'react-i18next';
import { useRouter } from "next/router";
import TransactionReportContainer from "components/E-Wallet/MerchantInfo/TransactionReport/TransactionReportContainer";

interface Props {
  showFilter? : boolean
}

const ReportTransactionContainer : React.FC<Props> = ({
  showFilter
}) => {

  const [filter, setFilter] = useState<any>({});
  const [loadingTable, setLoadingTable] = useState<boolean>(true);
  const { t } = useTranslation('common');

  const handleSubmitSearch = (data: any) => {
    setFilter(data);
  };

  
  return (
    <>
      {/* <div className="approval-merchant-container report-transaction-container">
        <HeaderReportTransaction 
          isShowFilter={isShowFilter}
          onClickExport={() => {}}
          onClickFilter={() => {
            setIsShowFilter(!isShowFilter);
          }}
        />
      </div> */}
      <div className='box-payment box-payment-report-transaction'>
          <TransactionReportContainer
            getAllData={true}
            isShowFilter={showFilter}
          />
        </div>
    </>
  )
}

export default ReportTransactionContainer