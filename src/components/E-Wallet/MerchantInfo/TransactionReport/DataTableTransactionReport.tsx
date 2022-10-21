import React, { Fragment, useEffect } from 'react';
import Nodata from 'components/common/NoData/Nodata';
import ExpandButton from './utils/ExpandButton';
import numeral from 'numeral';
import LoadingInline from 'components/common/Loading/LoadingInline';

interface Props {
  reportData: any[];
  columnTitles: any[];
  isLoading: boolean;
  toggleChildren: (id: number) => void;
}

function DataTableTransactionReport({
  reportData,
  columnTitles,
  isLoading,
  toggleChildren,
}: Props) {
  return (
    <div
      className={`transaction-report-data-table-container ${
        isLoading || !reportData.length ? 'min' : ''
      }`}>
      <div className='no-data-custom'>
        {reportData.length === 0 && <Nodata imageDataEmpty='' messageDataEmpty='' />}
      </div>
      <LoadingInline loading={isLoading} />
      <table>
        <thead>
          <tr>
            {columnTitles?.map((col: any) => (
              <th key={col.field}>{col.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {reportData?.map((row: any) => (
            <Fragment key={row.id}>
              <tr>
                <th>
                  {row?.children?.length > 0 && (
                    <ExpandButton onClick={() => toggleChildren(row.id)} />
                  )}
                  <span>{row.title}</span>
                </th>
                {columnTitles?.slice(1).map((col: any, index: number) => (
                  <td key={index}>
                    {row[col.field] !== -1
                      ? numeral(row[col.field]).format('0,0.[0000]')
                      : '******'}
                  </td>
                ))}
              </tr>

              {row?.showChildren &&
                row?.children?.map((child: any) => (
                  <tr key={child.id} className='child'>
                    <th>{child.title}</th>
                    {columnTitles?.slice(1).map((col: any, index: number) => (
                      <td key={index}>
                        {row[col.field] !== -1
                          ? numeral(child[col.field]).format('0,0.[0000]')
                          : '******'}
                      </td>
                    ))}
                  </tr>
                ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTableTransactionReport;
