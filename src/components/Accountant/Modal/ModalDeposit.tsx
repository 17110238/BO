import React, { memo, useEffect, useMemo, useRef, useState } from 'react'
import { Button, Modal } from 'react-bootstrap';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import ReactSelect from 'react-select';
import { useTranslation } from 'react-i18next';
import { Input } from 'ui/Form';
import utc from 'dayjs/plugin/utc';
import numeral from 'numeral';
import { AccountantCrossCheck, AccountantCrossCheckFormat } from 'models';
import formatCurrency from 'utils/helpers/formatCurrency';
import { getpaymentMethodList } from 'redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import alert from 'utils/helpers/alert';
import { createAccountantCrossCheck, updateStateAccountantCrossCheck } from 'redux/actions/accountantAction';
import dayjs from 'dayjs';
import DataTableDesposit from '../Sum/DataTableDesposit';
import ReportSummaryRevenue from '../Sum/ReportSumaryRevenue';
import Router from 'next/router';
dayjs.extend(utc);
import { TypehandleEditAmount } from '../DataTableAccountant';
import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
interface TypeModalDeposit {
    show: boolean,
    onHide: () => void
    data: AccountantCrossCheckFormat[]
    handleDelete: (id: string) => void
    handleSubmitSearch: (value: any) => void
    handleEditAmount: (event:any,amount:any ) => void
    handleEditNote: (event: any, note: any) => void
    handleDeleteData: ()=>void
}
interface FormLoginSubmit {
    merchantId: number | string,
    amount: number | string,
    methodList: string[],
    description: string,
    birthday: Date,
    createdAt: {
        from: Date,
        to: Date
    }
}
interface Role {
    key?: string;
    name?: string;
    description?: string
}
interface mapIteam {
    iteam?: {};
    index: number;
}
const rulesForm = {
    merchantId: { required: true, isVNumber: true },
    amount: { required: true, isVNumber: true, },
    methodList: { required: true, },
    description: { required: true, },
    birthday: { required: true },

};
const ModalDeposit = (props: TypeModalDeposit) => {
    const { t } = useTranslation('common')
    const { show, onHide, data, handleDelete, handleSubmitSearch, handleEditAmount, handleEditNote, handleDeleteData } = props
    const isLoadingUpdate = useSelector<any, AccountantCrossCheck[]>((state) => state?.crossCheckReducer?.loadingUpdate);


    const dispatch = useDispatch()
    const approveAccountID = useSelector<any>((state) => state.authReducers.accountInfo?.profile.accountId)
    const handleSubmitCreateCrossCheck = (data: any) => {
        if (data?.length === 0 || !data) {
            alert('error', 'Sai dữ liệu tham số đầu vào', t);
        } else {
            let dataFormat = data?.map((item: AccountantCrossCheckFormat) => {
                return { amount: item.amountEdit, crossCheckId: item.crossCheckId, note: item?.note || '' }
            })
            let params = {
                crossCheckList: dataFormat,
                approvedAccountId: approveAccountID
            }
            dispatch(updateStateAccountantCrossCheck(params, (status: boolean, response: any) => {
                console.log('respon-------status', response, status);
                if (status) {
                    Router.push(`/cong-thanh-toan/doi-soat-doanh-nghiep/chuyen-tien/${response.campaignId}`)
                } else {
                    alert('error', response.message, t);
                }
            }))
        }
    }
    useEffect(() => {
        return () => {
            const defaultValues = {
                createdAt: {
                    from: dayjs().subtract(5, 'day').toISOString(),
                    to: dayjs().endOf('date').toISOString(),
                },
                typeSearch: "tranId"
            }
            return handleDeleteData()
            //return  handleSubmitSearch && handleSubmitSearch(defaultValues)
        }
    }, []);


    return (
        <>
            <Modal show={show} onHide={onHide} backdrop="static" className="modal__deposit" >
                <Modal.Header closeButton>
                    <Modal.Title>{t("Đối soát doanh nghiệp")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <button className='d-flex btn' onClick={() => handleSubmitCreateCrossCheck(data)} >
                    <i className="fas fa-angle-double-right"></i>
                        {t("Tiếp tục")}</button>
                    <ReportSummaryRevenue data={data} />
                    <DataTableDesposit data={data} handleDelete={handleDelete} handleEditAmount={handleEditAmount} handleEditNote={handleEditNote} />
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
            {isLoadingUpdate && <LoadingFullScreen />}

        </>
    );
}

export default memo(ModalDeposit)
