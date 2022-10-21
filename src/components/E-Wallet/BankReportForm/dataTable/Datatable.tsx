import Nodata from 'components/common/NoData/Nodata';
import numeral from 'numeral';
import React from 'react';
interface Props {
  data: any[];
  defaultHeader: string[];
}

const Datatable: React.FC<Props> = ({ data, defaultHeader, ...rest }) => {
  if (!data?.length) {
    return (
      <Nodata
        style={{
          width: '100%',
          backgroundColor: 'white',
          border: '1px solid #dfdfdf',
          borderRadius: 10,
        }}
      />
    );
  }
  return (
    <div className='w-100 border-table' style={{ overflow: 'hidden' }}>
      <table className='table-basic-header-left'>
        <tr className='table-basic-header-left__header-table'>
          <th style={{ minWidth: 20 }}>STT</th>
          {defaultHeader.map((item, index) => {
            return <th key={index}>{item || ''}</th>;
          })}
        </tr>

        {data.map((item, index) => {
          return (
            <tr className='table-basic-header-left__body-table' key={index}>
              <td style={{ minWidth: 20 }}>{index + 1 || ''}</td>
              {Object.keys(item).map((itemKey, keyIndex) => {
                const isNumberItem = typeof item[itemKey] === 'number';
                return (
                  <td
                    style={{
                      textAlign: isNumberItem ? 'right' : 'left',
                      minWidth: keyIndex === 0 ? '200px' : 'unset',
                    }}
                    key={keyIndex}>
                    {item[itemKey] && isNumberItem
                      ? numeral(roundNumber(item[itemKey])).format('0,0.[00000]')
                      : item[itemKey] ?? ''}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </table>
    </div>
  );
};

const roundNumber = (num?: number) => {
  const length = num?.toString().split('.')[1]?.length;
  const fixedNumber = Math.pow(10, length || 1);
  return num ? Math.round(num * fixedNumber) / fixedNumber : 0;
};

export default Datatable;
