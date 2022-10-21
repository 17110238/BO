import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
import { FC } from 'react';
import formatCurrency from 'utils/helpers/formatCurrency';

interface Props {
  data: any;
  isLoading: boolean;
}

const DealerSystemReportDatatable: FC<Props> = ({ data, isLoading }) => {
  const handleRenderDate = () => {
    return data?.data?.map((item: any) => {
      return <th>{item.date}</th>;
    });
  };

  const handleRenderContent = (requiredField: any) => {
    return data?.data?.map((item: any, index: number) => {
      return <td key={index}>{formatCurrency(item[requiredField])}</td>;
    });
  };

  return (
    <>
      {isLoading && <LoadingFullScreen />}
      <table className='dealer-report-container'>
        <thead>
          <tr>
            <th></th>
            {handleRenderDate()}
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Tổng số dư</td>
            {handleRenderContent('totalBalance')}
            <td></td>
          </tr>
          <tr>
            <td>Tổng tiền TT</td>
            {handleRenderContent('amountTotal')}
            <td>{formatCurrency(data?.sumData.sumAmountTotal)}</td>
          </tr>
          <tr>
            <td>Giá trị GD</td>
            {handleRenderContent('total')}
            <td>{formatCurrency(data?.sumData.sumTotal)}</td>
          </tr>
          <tr>
            <td>Tổng phí TT</td>
            {handleRenderContent('feeTotal')}
            <td>{formatCurrency(data?.sumData.sumFeeTotal)}</td>
          </tr>
          <tr>
            <td>Tổng phí xử lý GD</td>
            {handleRenderContent('merchantFeeTotal')}
            <td>{formatCurrency(data?.sumData.sumMerchantFeeTotal)}</td>
          </tr>
          <tr>
            <td>Số lượng GD</td>
            {handleRenderContent('transactionTotal')}
            <td>{formatCurrency(data?.sumData.sumTransactionTotal)}</td>
          </tr>
          <tr>
            <td>Tổng tiền hoàn</td>
            {handleRenderContent('refundedAmountTotal')}
            <td>{formatCurrency(data?.sumData.sumRefundedAmountTotal)}</td>
          </tr>
          <tr>
            <td>Số GD hoàn</td>
            {handleRenderContent('refundedTransactionTotal')}
            <td>{formatCurrency(data?.sumData.sumRefundedTransactionTotal)}</td>
          </tr>
          <tr>
            <td>Số GD hủy</td>
            {handleRenderContent('canceledTransactionTotal')}
            <td>{formatCurrency(data?.sumData.sumCanceledTransactionTotal)}</td>
          </tr>
          <tr>
            <td>Số GD thất bại</td>
            {handleRenderContent('failedTransactionTotal')}
            <td>{formatCurrency(data?.sumData.sumFailedTransactionTotal)}</td>
          </tr>
          <tr>
            <td>Số GD hết hạn</td>
            {handleRenderContent('expiredTransactionTotal')}
            <td>{formatCurrency(data?.sumData.sumExpiredTransactionTotal)}</td>
          </tr>
          <tr>
            <td>Tổng tiền đối soát</td>
            {handleRenderContent('waitingCrosscheckAmountTotal')}
            <td>{formatCurrency(data?.sumData.sumWaitingCrosscheckAmountTotal)}</td>
          </tr>
          <tr>
            <td>Tổng tiền chưa đối soát</td>
            {handleRenderContent('crossCheckAmountTotal')}
            <td>{formatCurrency(data?.sumData.sumCrossCheckAmountTotal)}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default DealerSystemReportDatatable;
