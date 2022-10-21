import dayjs from 'dayjs';
import { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getReportAgent } from 'redux/actions/reportSystem';
import DealerBoxsearch from './Boxsearch';
import DealerSystemReportDatatable from './Datatable';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

interface Props {
  showFilter: boolean;
}

const DealerSystemReport: FC<Props> = ({ showFilter }) => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState<any>({ state: '' });
  const [agentData, setAgentData] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSwitchPayload = () => {
    switch (filter?.state) {
      case '7':
        return {
          typeDate: 'DATE',
          createdAt: {
            from: dayjs().subtract(7, 'day').startOf('day').utc().format(),
            to: dayjs().endOf('day').utc().format(),
          },
        };
      case '30':
        return {
          typeDate: 'DATE',
          createdAt: {
            from: dayjs().subtract(30, 'day').startOf('day').utc().format(),
            to: dayjs().endOf('day').utc().format(),
          },
        };
      case '90':
        return {
          typeDate: 'DATE',
          createdAt: {
            from: dayjs().subtract(90, 'day').startOf('day').utc().format(),
            to: dayjs().endOf('day').utc().format(),
          },
        };
      case 'range':
        return {
          typeDate: 'DATE',
          createdAt: filter.createdAt,
        };
      case 'month':
        return {
          typeDate: 'MONTH',
          createdAt: filter.createdAt,
        };
      default:
        return {
          typeDate: 'DATE',
          createdAt: {
            from: dayjs().startOf('day').utc().format(),
            to: dayjs().endOf('day').utc().format(),
          },
        };
    }
  };

  useEffect(() => {
    setIsLoading(true);
    dispatch(
      getReportAgent({ filter: handleSwitchPayload() }, (state, data) => {
        setIsLoading(false);
        if (state) {
          setAgentData(data);
        } else {
          setAgentData([]);
        }
      })
    );
  }, [filter]);

  const handleFilter = (data: any) => {
    setFilter(data);
  };
  return (
    <div className='linkedbank-container'>
      <div style={{ marginTop: '12px' }}>
        {showFilter && <DealerBoxsearch handleFilter={handleFilter} />}
      </div>
      <div style={{ padding: '12px 20px', overflow: 'scroll', height: '70vh' }}>
        <DealerSystemReportDatatable data={agentData} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default DealerSystemReport;
