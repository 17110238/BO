import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Column, useAbsoluteLayout, useBlockLayout, useTable, useFlexLayout } from 'react-table';

interface Props {
  columns: Column<any>[];
  data: any[];
  isLoading?: boolean;
  isShowDisplayRowOption?: boolean;
  isShowFooter?: boolean;
}
const DatatableHook: React.FC<Props> = ({
  columns,
  data,
  isLoading = false,
  isShowDisplayRowOption = true,
  isShowFooter = false,
}) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, footerGroups, prepareRow } =
    useTable(
      {
        columns,
        data,
      },
      useFlexLayout
    );

  return (
    <div className='border border-table' style={{ borderRadius: '12px', overflow: 'auto' }}>
      <table {...getTableProps()} className='react-table-basic '>
        <thead>
          {headerGroups.map((headerGroup) => {
            return (
              <tr
                {...headerGroup.getHeaderGroupProps()}
                className='react-table-basic__header-table'>
                {headerGroup.headers.map((col) => {
                  return (
                    <th {...col.getHeaderProps()} className='header-table__item'>
                      {col.render('Header')}
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className='react-table-basic__body'>
                {row.cells.map((cell, index) => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
        {isShowFooter && (
          <tfoot>
            {footerGroups.map((footerGroup) => {
              return (
                <tr {...footerGroup.getFooterGroupProps()} className='react-table-basic__footer'>
                  {footerGroup.headers.map((col) => {
                    return <td {...col.getFooterProps()}>{col.render('Footer')}</td>;
                  })}
                </tr>
              );
            })}
          </tfoot>
        )}
      </table>
    </div>
  );
};

export default DatatableHook;
