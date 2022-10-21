import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux';
import { Input } from 'ui/Form'
import { approveCrossCheck, boRejectCrossCheck, updateStateDeposiFinaltProcess } from 'redux/actions/accountantAction'
import { useRouter } from 'next/router'
import alert from 'utils/helpers/alert';
import numeral from 'numeral';
import Swal from 'sweetalert2';
const rulesForm = {
    username: { required: true, minLength: 3, maxLength: 30, isUserName: true, trim: true, isUsernameBo: true, },
    password: { required: true, isVNumber: true, minLength: 6, maxLength: 6 },
    repassword: { required: true, isVNumber: true, minLength: 6, maxLength: 6 },
    fullname: { required: true, minLength: 3, maxLength: 30, isUserName: true, trim: true, },
    phone: { required: true, minLength: 10, maxLength: 10, isVNumber: true, isPhoneNumber: true },
    email: { required: true, isEmail: true },
    gender: { required: true },
    birthday: { required: true },
    isActive: { required: true },
    role: { required: true },

};
interface TypeConfirmDeposit {
    depositTransaction: string
}
const ConfirmDeposit = ({ dataAmount, dataTable }: any) => {
    const { t } = useTranslation('common')
    const dispatch = useDispatch()
    const router = useRouter()
    const { register, formState: { errors }, handleSubmit, clearErrors, setError, setValue, getValues, reset, control, } = useForm<TypeConfirmDeposit>({ mode: 'onSubmit', reValidateMode: 'onSubmit', });
    const approveAccountID = useSelector<any>((state) => state.authReducers.accountInfo?.profile.accountId)
    const handleReject = () => {
        Swal.fire({
            title: t('Bạn có đồng ý hủy lệnh đối soát này không?'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: t('Đồng ý!'),
            cancelButtonText: t("Hủy")
        }).then((result) => {
            if (result.isConfirmed) {
                let payload = {
                    campaignId: router.query?.index,
                    approvedAccountId: approveAccountID
                }
                dispatch(boRejectCrossCheck(payload, (status, res) => {
                    console.log('responsive', res);

                    if (status) {
                        alert('success', res.message, t)
                        router.replace('/cong-thanh-toan/doi-soat-doanh-nghiep')
                    } else {
                        alert('error', res.message, t)
                    }
                }))
            }

        })
    }
    const handleConfirm = (data: TypeConfirmDeposit) => {
        const payload = {
            campaignId: router.query?.index,
            approvedAccountId: approveAccountID,
            depositTransaction: data?.depositTransaction
        }
        dispatch(updateStateDeposiFinaltProcess(payload, (status, res) => {
            if (status) {
                alert('success', res.message, t)
                router.replace('/cong-thanh-toan/doi-soat-doanh-nghiep')
            } else {
                alert('error', res.message, t)
            }
        }))
    }

    const handleConfirmApprove = (data: TypeConfirmDeposit) => {
        const payload = {
            campaignId: router.query?.index,
            approvedAccountId: approveAccountID,
            depositTransaction: data?.depositTransaction
        }
            dispatch(approveCrossCheck(payload, (status, res) => {
                if (status) {
                    alert('success', res.message, t)
                    router.replace('/cong-thanh-toan/doi-soat-doanh-nghiep')
                } else {
                    alert('error', res.message, t)
                }
           })) 
    }
    return (
        <>
            <div className="confirmdeposit">
                <div className="confirmdeposit__content">
                    <div className="title">
                        <h5>{t("Xác nhận chuyển khoản")}</h5>
                        <p>{t("Để thực hiện đối soát, hệ thống cần thông tin chuyển khoản vào tài khoản đối ứng như bên dưới")}</p>

                    </div>
                    <div className="content">

                        <div className="container__infor">
                            <div className="d-flex">
                                <div className="label ">
                                    <p> {t("Hình thức đối soát")}</p>
                                </div>
                                <div className="content ml-3">
                                    <strong>{t("MerchantBalance")}</strong>
                                </div>
                            </div>
                            <div className="d-flex">
                                <div className="label">
                                    <p>   {t("Số Tài Khoản")}</p>
                                </div>
                                <div className="content ml-3">
                                    <strong></strong>
                                </div>
                            </div>
                            <div className="d-flex">
                                <div className="label">
                                    <p>    {t("Số dư cần đối soát")}</p>
                                </div>
                                <div className="content ml-3">
                                    <strong> {numeral(dataAmount).format('0,0') || '[ - ]'} VNĐ</strong>
                                </div>
                            </div>
                            <form onSubmit={dataTable[0]?.state == "DEPOSITED" ? handleSubmit(handleConfirmApprove) : handleSubmit(handleConfirm)}>
                                <div className="d-flex align-items-center">
                                    <div className="label">
                                        <p>    {t("Mã giao dịch ngân hàng")}</p>
                                    </div>
                                    <div className="content ml-3">
                                        <div className='form-group ' >

                                            <input
                                                className={`form-control ${errors?.depositTransaction?.message ? 'input-error' : ''}base-input`}
                                                {...register("depositTransaction", { required: "Mã giao dịch ngân hàng không được để trống" })}
                                                placeholder={t("Nhập mã giao dịch ngân hàng")}
                                            />
                                            {errors?.depositTransaction?.type === 'required' && (

                                                <p className='mt-10 mb-0 txt-valid'>
                                                    <i className='i-valid' />
                                                    {errors?.depositTransaction?.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex-confirm">
                                    <div className="label mr-3">
                                    </div>
                                    <div className="content">{
                                        dataTable[0]?.state == "DEPOSITED" ?
                                            <button className='btn  btn-primary' onClick={() => handleConfirmApprove}>
                                                <i className="fa fa-check"></i>
                                                {/* <i className="fa fa-square-check"></i> */}
                                                {t("Xác nhận chuyển tiền")}
                                            </button> : <button className='btn  btn-primary' onClick={() => handleConfirm}>
                                                <i className="fa fa-check"></i>
                                                {/* <i className="fa fa-square-check"></i> */}
                                                {t("Xác nhận chuyển tiền")}
                                            </button>
                                    }

                                    </div>
                                </div>
                            </form>
                            <button className='btn  btn-danger btn-reject' onClick={() => handleReject()}>
                                <i className="fa fa-trash"></i>
                                {t("Từ chối xác nhận")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default ConfirmDeposit