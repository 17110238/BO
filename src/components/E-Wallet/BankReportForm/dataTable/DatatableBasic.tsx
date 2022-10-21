import Nodata from 'components/common/NoData/Nodata';
import numeral from 'numeral';
import React from 'react';
interface Props {
  data: any[];
  defaultHeader: any[];
  keyArray?: string[];
}

const DatatableBasic: React.FC<Props> = ({ data, defaultHeader, keyArray, ...rest }) => {
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
      <table className='table-basic' style={{ overflowX: 'auto' }}>
        <tr className='table-basic__header-table--col-row-span'>
          <td
            className='header-table__item'
            rowSpan={2}
            style={{
              width: '80px',
            }}>
            STT
          </td>
          {defaultHeader.map((item, index) => {
            return (
              <td
                key={index}
                className='header-table__item'
                {...(item ? item?.option ?? {} : {})}
                style={{
                  padding: '10px',
                  textAlign: 'center',
                  minWidth: '120px',
                }}>
                {item && item.name}
              </td>
            );
          })}
        </tr>
        <tr className='table-basic__header-table--col-row-span'>
          {defaultHeader.map((item, index) => {
            if (!item?.children?.length) return <React.Fragment key={index}></React.Fragment>;
            return item?.children.map((itemChild: any, indexChild: any) => {
              return (
                <td
                  key={indexChild}
                  className='header-table__item'
                  {...(itemChild ? itemChild?.option ?? {} : {})}
                  style={{
                    padding: '10px',
                    minWidth: '100px',
                    textAlign: 'center',
                  }}>
                  {itemChild && itemChild.name}
                </td>
              );
            });
          })}
        </tr>

        {data.map((item, index) => {
          return (
            <tr className='table-basic__body--col-row-span' key={index}>
              <td
                style={{
                  width: '80px',
                }}>
                {index + 1}
              </td>
              {[...(keyArray ? keyArray : Object.keys(item || {}))].map((itemKey, indexKey) => {
                const hasNumberFormat = new RegExp(/(Amount|Price|Count)/g).test(itemKey);
                const renderItem =
                  hasNumberFormat && item[itemKey]
                    ? numeral(roundNumber(item[itemKey])).format('0,0.[00000]')
                    : item[itemKey];
                return (
                  <td
                    key={indexKey}
                    style={{
                      padding: '10px',
                      wordBreak: !hasNumberFormat ? 'break-word' : 'unset',
                      textAlign: hasNumberFormat ? 'right' : 'left',
                    }}>
                    {renderItem ?? ''}
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

export default DatatableBasic;
