import { useQuery } from '@apollo/client';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import dayjs from 'dayjs';
import {
  LoanPackageFilter,
  InputLoanPackage,
  InputUpdateLoanPackage,
  LoanPackageTypes,
} from 'models';
import { useRouter } from 'next/router';
import numeral from 'numeral';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getListLoanPackage, updateLoanPackage } from 'redux/actions/loanPackageAction';
import { updateURLParameter } from 'utils/helpers';
import alert from 'utils/helpers/alert';

export default function ManageLoanPackage({ ...rest }) {
  const { t } = useTranslation('common');
  const { query } = useRouter();
  const dispatch = useDispatch();
  const loading = useSelector((state: any) => state.loanPackageReducer.loading);
  const [listPackage, setListPackage] = useState<Array<LoanPackageTypes>>([]);
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const [totalRow, setTotalRow] = useState<number>(0);
  const [filter, setFilter] = useState<LoanPackageFilter>({});
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const columns: TableColumn<LoanPackageTypes>[] = useMemo(
    () => [
      {
        name: t('Mã người dùng'),
        minWidth: '150px',
        maxWidth: '150px',
        cell: (row, index) => {
          return <>{row?.accountId}</>;
        },
      },
      {
        name: t('Họ tên'),
        minWidth: '200px',
        maxWidth: '250px',
        cell: (row, index) => {
          return <>{row?.fullname}</>;
        },
      },
      {
        name: t('Số điện thoại'),
        minWidth: '150px',
        maxWidth: '150px',
        cell: (row, index) => {
          return <>{row?.phone}</>;
        },
      },
      {
        name: t('Email'),
        minWidth: '150px',
        maxWidth: '150px',
        cell: (row, index) => {
          return <>{row?.email}</>;
        },
      },
      {
        name: t('Tên ngân hàng'),
        minWidth: '150px',
        maxWidth: '150px',
        cell: (row, index) => {
          return <>{row?.supplierInfo?.title}</>;
        },
      },
      {
        name: t('Số tiền'),
        minWidth: '150px',
        maxWidth: '150px',
        cell: (row, index) => {
          return <>{numeral(row?.amount).format('0,0')}</>;
        },
      },
      {
        name: t('Thời hạn'),
        minWidth: '150px',
        maxWidth: '150px',
        cell: (row, index) => {
          return <>{row?.termTitle}</>;
        },
      },
      {
        name: t('Ngày đăng kí'),
        minWidth: '150px',
        maxWidth: '150px',
        cell: (row, index) => {
          return <>{row?.createdAt ? dayjs(row?.createdAt).format('HH:mm:ss DD-MM-YYYY') : ''}</>;
        },
      },
      {
        name: t('Ngày cập nhật'),
        minWidth: '150px',
        maxWidth: '150px',
        cell: (row, index) => {
          return <>{row?.updatedAt ? dayjs(row?.updatedAt).format('HH:mm:ss DD-MM-YYYY') : ''}</>;
        },
      },
      {
        name: t('Trạng thái'),
        minWidth: '150px',
        maxWidth: '150px',
        cell: (row, index) => {
          return <>{t(row?.state || '')}</>;
        },
      },
      {
        name: t('Thao tác'),
        minWidth: '100px',
        maxWidth: '120px',
        cell: (row, index) => {
          return (
            <>
              {row?.state === 'REQUESTED' && (
                <Dropdown className='merchant-manage-table-dropdown'>
                  <Dropdown.Toggle
                    className='p-0 w-100'
                    style={{
                      backgroundColor: 'rgba(0,0,0,0)',
                      borderColor: 'rgba(0,0,0,0)',
                    }}
                    id='dropdown-menu-align-end'>
                    <div className='d-flex justify-content-center w-100'>
                      <i className='fas fa-th-large m-0 text-muted'></i>
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu style={{ borderRadius: '12px' }}>
                    <Dropdown.Item
                      onClick={(e: any) => {
                        e.preventDefault();
                        handleUpdateLoanPackage('APPROVED', row?.id);
                      }}>
                      {t('Duyệt')}
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={(e: any) => {
                        e.preventDefault();
                        handleUpdateLoanPackage('REJECTED', row?.id);
                      }}>
                      {t('Từ chối')}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </>
          );
        },
      },
    ],
    [t]
  );
  const handleUpdateLoanPackage = (state: string, id?: number) => {
    setSubmitForm(false);
    let payload: InputUpdateLoanPackage = {
      id,
      state,
    };
    dispatch(
      updateLoanPackage(payload, (successed, response) => {
        if (successed) {
          getListLoanPackageRequest();
          alert('success', response.message, t);
        } else {
          getListLoanPackageRequest();
          alert('error', response.message, t);
        }
      })
    );
  };
  const handleGetListLoanPackage = (start?: number, limit?: number, sort?: {}) => {
    const payload: InputLoanPackage = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };
    const getListData = (payload: InputLoanPackage) => {
      dispatch(
        getListLoanPackage(payload, (state, response) => {
          if (state) {
            setListPackage(response);
          }
        })
      );
    };
    return {
      payload,
      getList: getListData,
      submitForm,
      setSubmitForm,
    };
  };
  const getListLoanPackageRequest = () => {
    let payload: InputLoanPackage = {
      paging: {
        start: 0,
        limit: 999,
      },
      filter,
    };
    dispatch(
      getListLoanPackage(payload, (state, response) => {
        if (state) {
          setListPackage(response);
        }
      })
    );
  };
  const handleSearchForm = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (filter?.search) {
      window.history.replaceState(
        '',
        '',
        updateURLParameter(window.location.href, 'search', encodeURIComponent(filter.search))
      );
      getListLoanPackageRequest();
    } else {
      const parseUrl = window.location.search.split('?')[1];
      const params = new URLSearchParams(parseUrl);
      params.delete('search');
      window.history.replaceState('', '', '/vi-dien-tu/quan-ly-goi-vay');
      setFilter({});
      getListLoanPackageRequest();
    }
  };
  useEffect(() => {
    if (!query?.search) {
      setSubmitForm(true);
    } else {
      setFilter({ ...filter, search: query?.search.toString() });
      setSubmitForm(true);
    }
  }, [query]);
  return (
    <Fragment>
      <div className='manualBank-container'>
        <div className='manualBank-header'>
          <div className='manualBank-header__title'>
            <h5>{t('Quản lý gói vay')}</h5>
          </div>
          <div className='manualBank-header__btn'>
            <button
              className='filter-btn btn btn-active'
              style={showFilter ? {} : { borderColor: '#647081' }}
              onClick={() => {
                setShowFilter(!showFilter);
              }}>
              <svg
                width={14}
                height={12}
                xmlns='http://www.w3.org/2000/svg'
                style={{ transition: 'all 0.3s ease 0s' }}>
                <path
                  d='M6.99.005c1.977 0 3.954.001 5.93-.001.409 0 .73.151.938.507.237.405.177.817-.179 1.231-1.49 1.737-2.982 3.475-4.48 5.205a.762.762 0 0 0-.206.558c.014.614-.003 1.229.01 1.843.006.288-.094.49-.339.65-.93.61-1.854 1.23-2.779 1.85-.19.127-.381.215-.61.096-.237-.125-.279-.336-.278-.58.004-1.28-.004-2.56.005-3.841a.816.816 0 0 0-.212-.587C3.305 5.222 1.833 3.496.348 1.78.034 1.417-.114 1.037.103.583.318.13.706-.002 1.183 0 3.12.008 5.054.003 6.99.003v.002z'
                  fill={showFilter ? '#00BE00' : '#647081'}
                  fillRule='evenodd'
                />
              </svg>
              <p style={showFilter ? {} : { color: '#647081' }}>
                {t(showFilter ? 'Ẩn lọc' : 'Hiện')}
              </p>
            </button>
          </div>
        </div>
        {showFilter && (
          <form
            className='manualBank-search'
            style={{ marginTop: '10px' }}
            onSubmit={handleSearchForm}>
            <div className='manualBank-group'>
              <div className='manualBank-group__content'>
                <input
                  type='text'
                  className='manualBank-group__input form-control'
                  placeholder='Nhập ID user, SĐT, Họ tên, Email'
                  onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                />
              </div>
            </div>
            <div className='manualBank-group'>
              <div className='manualBank-group__content'>
                <button className='manualBank-group__btn btn btn-primary btn-search'>
                  <i className='fas fa-search'></i>
                  {t('Tìm Kiếm')}
                </button>
              </div>
            </div>
          </form>
        )}
        <div className='manualBank-content' style={{ padding: '0px', marginTop: '20px' }}>
          <DataTableCustom
            dataList={listPackage}
            columns={columns}
            t={t}
            isLoading={loading}
            nameDataTable='colApprovalMerchant'
            className='approval-merchant-table'
            isSorting={true}
            fixedHeader={true}
            getDataList={handleGetListLoanPackage}
            paginationTotalRows={totalRow}
            {...rest}
          />
        </div>
      </div>
    </Fragment>
  );
}
