import Nodata from 'components/common/NoData/Nodata';
import numeral from 'numeral';
import React from 'react';
interface Props {
  data: any[];
  defaultLabel: string[];
  objectKeys: any;
  headerKey: string;
}

const DatatableHeaderLeft: React.FC<Props> = ({
  data,
  defaultLabel,
  objectKeys,
  headerKey,
  ...rest
}) => {
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
          <th></th>
          {data.map((item, index) => {
            return <th key={index}>{item[headerKey] || ''}</th>;
          })}
        </tr>

        {new Array(defaultLabel.length).fill(null).map((_, index) => {
          return (
            <tr className='table-basic-header-left__body-table' key={index}>
              <td>{defaultLabel[index] || ''}</td>
              {data.map((item, indexChild) => {
                const key = objectKeys[(index + 1) as keyof {}];
                const isNumberItem = typeof item[key] === 'number';
                return (
                  <td key={indexChild} style={{ textAlign: isNumberItem ? 'right' : 'left' }}>
                    {item[key] && isNumberItem
                      ? numeral(roundNumber(item[key])).format('0,0.[00000]')
                      : item[key] ?? ''}
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

export default DatatableHeaderLeft;
