import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
import { FC } from 'react';
import formatCurrency from 'utils/helpers/formatCurrency';

interface Props {
  data: any;
  isLoading: boolean;
}

const DealerSystemReportDatatable: FC<Props> = ({ data, isLoading }) => {
  const handleRenderDate = () => {
    if (data?.data.length > 0) {
      return data.data.map((item: any) => {
        return <th>{item.date}</th>;
      });
    }
  };

  const handleRenderContent = (requiredField: any) => {
    if (data?.data.length > 0) {
      return data.data.map((item: any, index: number) => {
        return <td key={index}>{formatCurrency(item[requiredField])}</td>;
      });
    }
  };

  return (
    <table className='dealer-report-container'>
      {isLoading && <LoadingFullScreen />}
      <thead>
        <tr>
          <th></th>
          {handleRenderDate()}
          <th>Tổng</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>MC đăng ký mới</td>
          {handleRenderContent('mcNewRegister')}
          <td>{data?.sumData.totalMcNewRegister}</td>
        </tr>
        <tr>
          <td>MC đã duyệt</td>
          {handleRenderContent('mcApproved')}
          <td>{data?.sumData.totalMcApproved}</td>
        </tr>
        <tr>
          <td>MC bị reject</td>
          {handleRenderContent('mcRejected')}
          <td>{data?.sumData.totalMcRejected}</td>
        </tr>
        <tr>
          <td>MC bị khóa</td>
          {handleRenderContent('mcBlocked')}
          <td>{data?.sumData.totalMcBlocked}</td>
        </tr>
        <tr>
          <td>MC hoạt động</td>
          {handleRenderContent('mcActive')}
          <td></td>
        </tr>
        <tr>
          <td>MC CN hoạt động</td>
          {handleRenderContent('mcActiveIndividual')}
          <td></td>
        </tr>
        <tr>
          <td>MC DN hoạt động</td>
          {handleRenderContent('mcActiveEnterprise')}
          <td></td>
        </tr>
        <tr>
          <td>MC có giao dịch</td>
          {handleRenderContent('mcHasTransaction')}
          <td></td>
        </tr>
        <tr>
          <td>Số lượng giao dịch</td>
          {handleRenderContent('numberOfTransactions')}
          <td>{data?.sumData.totalNumberOfTransactions}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default DealerSystemReportDatatable;
