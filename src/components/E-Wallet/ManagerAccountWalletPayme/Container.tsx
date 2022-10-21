import { DataGetListCompany, DataSearchEmployee, SearchEmployeeInput } from 'models'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { deleteManagertAccountWalletPayme, getListCompany, searchManagertAccountWalletPayme } from 'redux/actions'
import { formatPhone } from 'utils/helpers';
import BoxSearch from './BoxSearch'
import DataTable from './DataTable'
import Header from './Header'
import ModalAdd from './Modal/ModalAdd'
import ModalUpdate from './Modal/ModalUpdate'


interface Props {

}

const Container: React.FC<Props> = ({

}) => {

  const [showFilter, setShowFilter] = useState<boolean>(true)
  const [loadingButton, setLoadingButton] = useState<boolean>(false)
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<any>({})
  const [data, setData] = useState<DataSearchEmployee[]>([])
  const [dataCompany, setDataCompany] = useState<DataGetListCompany[]>([])
  const [refreshTable, setRefreshTable] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<any>({
    add: false,
    update: false
  })
  const [dataDetail, setDataDetail] = useState<any>({})

  const dispatch = useDispatch()

  const toggleFilter = () => setShowFilter(!showFilter)
  const onHideModalAdd = () => setShowModal({
    ...showModal,
    add: false
  });
  const onHideModalUpdate = () => setShowModal({
    ...showModal,
    update: false
  });
  const handleShowModalAdd = () => setShowModal({
    ...showModal,
    add: true
  });
  const handleShowModalUpdate = () => setShowModal({
    ...showModal,
    update: true
  })

  const handleSearchForm = (data: any) => {
    if (data?.txtSearch === '') {
      delete data.txtSearch
    }
    if (!data.accountGroupId) {
      delete data.accountGroupId
    }
    setFilter({ ...data })
    setSubmitForm(true)
  };

  const handleSearchManagerAccountsWalletPayme = (start?: number, limit?: number, sort?: {}) => {
    const payload = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      }
    };

    function getList(payload: SearchEmployeeInput) {
      setIsLoading(true)
      dispatch(
        searchManagertAccountWalletPayme(payload, (state, res) => {
          if (state) {
            setData(res || []);
            setRefreshTable(false);
            setSubmitForm(false)
          }
          setIsLoading(false)
        })
      );
    }
    return {
      payload,
      getList,
      submitForm
    };
  }

  useEffect(() => {
    dispatch(
      getListCompany((state, res) => {
        if (state) {
          setDataCompany(res)
        }
      })
    )
  }, [])

  const handleDelete = (id: number) => {
    dispatch(
      deleteManagertAccountWalletPayme({ id }, (state, res) => {
        if (state) {
          setSubmitForm(true)
        }
      })
    )
  }

  const handleDetail = (data: any, company: any) => {
    handleShowModalUpdate();
    dispatch(
      getListCompany((state, res) => {
        if (state) {
          const companyId = res.find((item : any) => item.name === data.company)
          setDataDetail({
            txtSearch: formatPhone(data?.phone ?? '', '0'),
            accountGroupId: +companyId?.id!,
            id: +data?.id
          })
        }
      })
    )
    // const payload : any = {
    //   filter : {
    //     txtSearch : data?.phone,
    //     accountGroupId : +companyId?.id!
    //   }
    // }
    // dispatch(
    //   searchManagertAccountWalletPayme(payload, (state, res) => {
    //     console.log('res', res)
    //     if(state){
    //       setDataDetail({})
    //     }
    //   })
    // )
  }

  return (
    <>
      <div className='box-payment container__manager-accounts-wallet-payme'>
        <Header
          showFilter={showFilter}
          toggleFilter={toggleFilter}
          handleShowModal={handleShowModalAdd}
        />
        <BoxSearch
          showFilter={showFilter}
          loadingButton={loadingButton}
          handleSubmitSearch={handleSearchForm}
          dataCompany={dataCompany}
        />
        <DataTable
          data={data}
          dataCompany={dataCompany}
          getDataList={handleSearchManagerAccountsWalletPayme}
          setSubmitForm={setSubmitForm}
          handleDelete={handleDelete}
          handleDetail={handleDetail}
          {...{ refreshTable }}
          isLoading={isLoading}
        />
      </div>
      <ModalAdd
        show={showModal?.add}
        dataCompany={dataCompany}
        onHide={onHideModalAdd}
        setSubmitForm={setSubmitForm}
      />
      <ModalUpdate
        show={showModal?.update}
        dataCompany={dataCompany}
        onHide={onHideModalUpdate}
        setSubmitForm={setSubmitForm}
        dataDetail={dataDetail}
      />
    </>

  )
}

export default Container