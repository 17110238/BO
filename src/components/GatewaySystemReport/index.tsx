import DataTableQuantityMerchant from 'components/QuantityMerchant/DataTableQuantityMerchant';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { getMerchantQuantity } from 'redux/actions';
import DealerSystemReport from './DealerReport';
import TransferSystemReport from './TransferReport';

const GatewaySystemReportContainer = () => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [dataMerchants, setDataMerchants] = useState();
  const [totalRow, settotalRow] = useState();
  const [filter, setFilter] = useState();
  const [submitForm, setSubmitForm] = useState(true);

  const handleGetMerchants = (start?: number, limit?: number, sort?: {}) => {
    const payload = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };
    function getMerchants(payload: any) {
      dispatch(
        getMerchantQuantity({ filter: payload.filter, paging: payload?.paging }, (state, res) => {
          if (state) {
            setDataMerchants(res);
            settotalRow(res?.length);
          }
        })
      );

      setSubmitForm(false);
    }

    return {
      payload,
      getList: getMerchants,
      submitForm,
    };
  };

  return (
    <div className='quantityMerchantContainer box-content'>
      <div className='system-report-container'>
        <DataTableQuantityMerchant
          t={t}
          loading={loading}
          data={dataMerchants}
          totalFilter={totalRow}
          getDataList={handleGetMerchants}
        />
      </div>
    </div>
  );
};

export default GatewaySystemReportContainer;
