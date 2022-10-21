import {
  FilterSearchParams,
  MerchantAccount,
  MerchantTypeEnum,
  SearchByRoleInput,
  stateMcEnum,
} from 'models';
import { UserBo } from 'models/user/accountMerchant';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getListAccountSale, searchApprovalMerchant, updateActiveMerchant } from 'redux/actions';
import alert from 'utils/helpers/alert';
import { clearFalsyObject } from 'utils/helpers/replaceUrl';
import BoxSearchApprovalMerchant, { approvalMerchantState } from './BoxSearchApprovalMerchant';
import DataTableApprovalMerchant from './DatatableApprovalMerchant';
import HeaderApprovalMerchantContainer from './HeaderApprovalMerchantContainer';
import ModalRejectMerchant from './modal/ModalRejectMerchant';
import { ChangeOfHistoryModal } from 'components/Merchant/approvalMerchant/modal/ChangeOfHistory';
export interface SearchParams {
  search?: string;
  type?: MerchantTypeEnum | string;
  state?: stateMcEnum | string | Array<string>;
  createdAt?: {
    from?: string;
    to?: string;
  };
  operatorAccountId?: number;
}

const ManagerMerchant: React.FC = () => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const merchantList = useSelector<any, MerchantAccount[]>(
    (state) => state?.merchantRD?.approvalMerchantArray
  );
  const router = useRouter();

  const [isShowFilter, setIsShowFilter] = useState<boolean>(true);
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [showHistory,setShowHistory] =useState<boolean>(false)
  const [merchantName,setMerchantName] =useState<string>("")
  const [merchantSelect, setMerchantSelect] = useState<number>(0);
  const [filter, setFilter] = useState<any>({
    state: ['PENDING'],
  });
  const [saleMembers, setSaleMembers] = useState<UserBo[]>([]);

  useEffect(() => {
    const payload: SearchByRoleInput = {
      filter: {
        role: 'ins.sale',
      },
      paging: {
        start: 0,
        limit: 100,
      },
    };
    dispatch(
      getListAccountSale(payload, (status, res) => {
        setSaleMembers(res);
      })
    );
  }, []);

  useEffect(() => {
    const { query }: any = router;

    if (Object.keys(query).length > 0) {
      const params = { ...router.query };

      delete params.to;
      delete params.from;

      const payload = clearFalsyObject({
        ...params,
        operatorAccountId: +(router?.query?.operatorAccountId as string) || undefined,
        type: router.query?.type !== 'ALL' ? router.query?.type : undefined,
        state:
          router.query?.state !== 'ALL'
            ? router.query?.state
            : approvalMerchantState.filter((state) => state !== 'ALL'),
        createdAt: {
          from: router.query?.from,
          to: router.query?.to,
        },
      });

      setFilter(payload);
    }
    setSubmitForm(true);
  }, []);

  const formatDataSearch = (data: SearchParams) => {
    const dataCopy: any = { ...data };

    dataCopy.type = dataCopy?.type !== 'ALL' ? dataCopy?.type : undefined;
    dataCopy.state =
      dataCopy?.state !== 'ALL'
        ? dataCopy?.state
        : approvalMerchantState.filter((state) => state !== 'ALL');

    return dataCopy;
  };

  const handleSubmitSearch = (data: SearchParams) => {
    const newData: SearchParams = formatDataSearch(data);

    setFilter({
      ...newData,
    });

    setSubmitForm(true);
  };

  const handleSearchApprovalMerchant = (start?: number, limit?: number, sort?: {}) => {
    const payload: FilterSearchParams = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
      sort: {
        updatedAt: -1,
      },
    };

    function getListApprovalMerchant(payload: FilterSearchParams) {
      setLoadingTable(true);
      dispatch(
        searchApprovalMerchant(payload, (status, response) => {
          // setTotalRow(response.totalRow);
          setSubmitForm(false);
          setLoadingTable(false);
        })
      );
    }

    return {
      payload,
      getList: getListApprovalMerchant,
      submitForm,
    };
  };

  const handleCloseMerchant: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const target = e.target as HTMLInputElement;
    const merchantId = +(target.getAttribute('data-index') || 0);
    dispatch(
      updateActiveMerchant({ merchantId }, (state, res) => {
        !state && alert('error', res.message, t);
        setSubmitForm(state);
      })
    );
  };

  const handleRejectMerchant: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    const target = e.target as HTMLInputElement;
    const merchantId = +(target.getAttribute('data-index') || 0);
    setShow(true);
    setMerchantSelect(merchantId);
  };


  const handleToggleHistory: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    const target = e.target as HTMLInputElement;
    const merchantId = +(target.getAttribute('data-index') || 0);
    const merchantNameIp = target.getAttribute('data-name') || "";
    setShowHistory(true);
    setMerchantName(merchantNameIp);
    setMerchantSelect(merchantId);
  };

  return (
    <>
      <div className='approval-merchant-container'>
        <HeaderApprovalMerchantContainer
          isShowFilter={isShowFilter}
          onClickExport={() => {}}
          onClickFilter={() => {
            setIsShowFilter(!isShowFilter);
          }}
        />
        <div className='box-payment'>
          {isShowFilter && (
            <BoxSearchApprovalMerchant
              loading={loadingTable}
              submitForm={submitForm}
              saleMembers={saleMembers}
              handleSubmitSearch={handleSubmitSearch}
              setSubmitForm={setSubmitForm}
            />
          )}
          <DataTableApprovalMerchant
            data={merchantList}
            getDataList={handleSearchApprovalMerchant}
            onCloseMerchant={handleCloseMerchant}
            onRejectMerchant={handleRejectMerchant}
            onToggleHistory={handleToggleHistory}
            {...{ isLoading: loadingTable }}
          />
        </div>
      </div>
      <ModalRejectMerchant
        merchantId={merchantSelect}
        show={show}
        onHide={(type) => {
          setShow(false);
          type === 'RESET_FORM' && setSubmitForm(true);
        }}
      />
      <ChangeOfHistoryModal
        show={showHistory}
        onHide={() => {
          setShowHistory(!showHistory);
        }}
        merchantId={merchantSelect.toString()}
        merchantName={merchantName}
      />
    </>
  );
};

export default ManagerMerchant;
