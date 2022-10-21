import { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import { getReportSystemTransaction } from 'redux/actions/reportSystem';
import TransferBoxsearch from './Boxsearch';
import TransferDatatable from './Datatable';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

interface Props {
  showFilter: boolean;
}

const TransferSystemReport: FC<Props> = ({ showFilter }) => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState<any>({
    date: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [transferData, setTransferData] = useState<any>();

  const handleSwitchPayload = () => {
    switch (filter?.date) {
      case '7':
        return {
          from: dayjs().subtract(7, 'day').startOf('day').utc().format(),
          to: dayjs().endOf('day').utc().format(),
        };
      case '30':
        return {
          from: dayjs().subtract(30, 'day').startOf('day').utc().format(),
          to: dayjs().endOf('day').utc().format(),
        };
      case '90':
        return {
          from: dayjs().subtract(90, 'day').startOf('day').utc().format(),
          to: dayjs().endOf('day').utc().format(),
        };
      case 'range':
        return {
          from: filter.createdAt.from,
          to: filter.createdAt.to,
        };
      default:
        return {
          from: dayjs().startOf('day').utc().format(),
          to: dayjs().endOf('day').utc().format(),
        };
    }
  };

  useEffect(() => {
    setLoading(true);
    dispatch(
      getReportSystemTransaction(
        { filter: { method: filter?.method, createdAt: handleSwitchPayload() } },
        (state, data) => {
          setLoading(false);
          if (state) {
            setTransferData(data);
          } else {
            setTransferData([]);
          }
        }
      )
    );
  }, [filter]);

  const handleFilter = (data: any) => {
    setFilter(data);
  };

  return (
    <div className='linkedbank-container'>
      <div style={{ marginTop: '12px' }}>
        {showFilter && <TransferBoxsearch handleFilter={handleFilter} />}
      </div>
      <div style={{ padding: '12px 20px', overflow: 'auto', height: '70vh' }}>
        <TransferDatatable data={transferData} isLoading={loading} />
      </div>
    </div>
  );
};

export default TransferSystemReport;
