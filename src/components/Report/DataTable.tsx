import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import dayjs from 'dayjs';
import useWindowDimensions from 'hook/useWindowDimension';
import React, { useEffect, useMemo, useState } from 'react';
import { TableColumn } from 'react-data-table-component';
import _ from 'lodash';
import { DataReportUser, ReportUserInput } from 'models';
import { getStatisticEwalletReportUser } from 'redux/actions';
import { useDispatch } from 'react-redux';
interface Props {
  t: (a: string) => string;
  data: DataReportUser[] | undefined;
  onRowSelected?: any;
  deleteDefault?: boolean;
  getDataList?: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: any;
    getList: (payload: any) => void;
  };
  heightBoxSearch?: number;
  rest?: any;
  submitForm: boolean;
  isLoading: boolean;
  filter: any;
}

const DataTable: React.FC<Props> = ({
  t,
  data,
  deleteDefault,
  getDataList,
  heightBoxSearch,
  filter,
  submitForm,
  isLoading,
  ...rest
}) => {
  const lang: string = localStorage.getItem('NEXT_LOCALE') ?? 'vi';
  const { height: screenHeight } = useWindowDimensions();
  const totalFixedHeightDatatable = heightBoxSearch && screenHeight - heightBoxSearch - 243; // 243 is total header + footer
  const [totalApp, setTotalApp] = useState<number>(0);
  const [totalUser, setTotalUser] = useState<number>(0);
  const dispatch = useDispatch();
  useEffect(() => {
    if (submitForm) {
      const payload: ReportUserInput = {
        filter,
        paging: {},
      };
      dispatch(
        getStatisticEwalletReportUser(payload, (status, res) => {
          if (status) {
            setTotalApp(res.totalApp);
            setTotalUser(res.totalUser);
          }
        })
      );
    }
  }, [submitForm]);

  return (
    <>
      <table className='table table-bordered table-hover'>
        <thead>
          <tr>
            <th scope='col' style={{ width: '400px' }}>
              Thời gian
            </th>
            <th scope='col'>First</th>
            <th scope='col'>Last</th>
            <th scope='col'>Handle</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className='d-flex justify-content-between' style={{ width: '400px' }}>
              {/* <div className='pl-5'>MC ID</div>
              <div className='pr-5'>Tên Merchant</div> */}
              ád
            </td>
            <td>Larry the Bird</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope='row'>2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <th scope='row'>3</th>
            <td>Larry the Bird</td>
            <td>@twitter</td>
            <td>@twitter</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default DataTable;
