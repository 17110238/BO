import LoadingInline from 'components/common/Loading/LoadingInline'
import { EWalletWordFillter } from 'models'
import { ReportPoboOrderReponsed } from 'models/report-bill'
import React, { memo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getListWordFillter } from 'redux/actions/eWalletWordFillter'
import DatatableWordFillter from './DatatableWordFillter'
import HeaderWordFillter from './HeaderWordFillter'
import ModalImport from './ModalImport'

const ContainerWordFillter = () => {
    const { t } = useTranslation("common");
    const dispatch = useDispatch();
    const ListWordFillter = useSelector<any, EWalletWordFillter[]>(state => state.ReportBillReducer?.listReportWordFilter)

    const loading = useSelector<any, boolean>(state => state.ReportBillReducer?.loadingWordFilter)

    const [showModalImport, setShowModalImport] = useState<boolean>(false);
    const [submitForm, setSubmitForm] = useState<boolean>(false);
    const [data, setData] = useState<EWalletWordFillter[]>([]);

    const [start, setStart] = useState(0);
    const [limit, setLimit] = useState(20);
    const [totalRow, setTotalRow] = useState<number>(0);
    useEffect(() => {

        setSubmitForm(true);

    }, [])

    const handleGetListWordFillter = () => {
        const payload: any = {
            paging: {
                start: start!,
                limit: limit!,
            },
            sort: {}
        };
        function handleGetListWordFillter(payload: any) {

            dispatch(
                getListWordFillter(payload, (status, res) => {
                    setSubmitForm(false);
                    if (status) {

                    } else {

                    }
                })
            );
        }
        return {
            payload,
            submitForm,
            getList: handleGetListWordFillter,
        };
    };
    return (
        <>
            {loading && <LoadingInline loading={loading} />}
            <div className='box-payment'>
                <HeaderWordFillter />
                <DatatableWordFillter
                    totalFilter={totalRow}
                    data={ListWordFillter}
                    t={t}
                    getDataList={handleGetListWordFillter}
                />

            </div>
        </>

    )
}

export default memo(ContainerWordFillter)