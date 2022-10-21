import { MccCodeListType, PayloadFilterMccCodeType } from 'models';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getMccCodeList } from 'redux/actions';
import BoxSearchTransactionValue from '../commons/ModalConfigTransactionValue/BoxSearchTransactionValue';
import DatatableTransactionValue from '../commons/ModalConfigTransactionValue/DataTableTransactionValue';

interface Props {
  show: boolean;
  onHide: (type?: string) => void;
  onClickRow?: (data: MccCodeListType) => React.MouseEventHandler<HTMLDivElement>;
  refreshData?: boolean;
}

const ModalConfigTransactionValue: React.FC<Props> = ({
  refreshData,
  show,
  onHide,
  onClickRow,
}) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const mccCodeList = useSelector<any, MccCodeListType[]>((state) => state?.utility?.mccCodes);

  const [filter, setFilter] = useState<any>({});
  const [refresh, setRefreshTable] = useState<boolean>(false);
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [data, setData] = useState<MccCodeListType[]>([]);
  const handleSearchForm = (data: any) => {
    setFilter(data);

    setRefreshTable(true);
  };

  const handleSearchTransactionValue = (start?: number, limit?: number, sort?: {}) => {
    const payload: PayloadFilterMccCodeType = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
      sort: {
        createdAt: -1,
      },
    };
    const getList = (payload: PayloadFilterMccCodeType) => {
      setLoadingTable(true);
      dispatch(
        getMccCodeList(payload, (state, res) => {
          setRefreshTable(false);
          setLoadingTable(false);
          setData(res?.data || []);
        })
      );
    };
    return {
      payload,
      getList,
      submitForm: refresh,
    };
  };

  useEffect(() => {
    show && setRefreshTable(true);
  }, [refreshData]);

  useEffect(() => {
    if (show) {
      setRefreshTable(true);
    }
  }, [show]);

  return (
    <>
      <Modal
        show={show}
        onHide={() => {
          onHide && onHide();
          setTimeout(() => {
            setFilter({});
            setData([]);
          }, 500);
        }}
        className='modal-system-config modal-config-transaction-value'
        backdrop='static'
        //keyboard={false}
        >
        <Modal.Header closeButton>{t('Cấu hình giá trị giao dịch tối đa')}</Modal.Header>
        <Modal.Body>
          <>
            <BoxSearchTransactionValue loading={refresh} onSubmitForm={handleSearchForm} />
            <DatatableTransactionValue
              data={data || []}
              getDataList={handleSearchTransactionValue}
              handleClickRow={onClickRow}
              {...{ isLoading: loadingTable }}
            />
          </>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ModalConfigTransactionValue;
