import { EmailSmsProductReponse, GetEmailSmsProductInput } from 'models/emailSms/emailSms';
import React, { useState, useEffect} from 'react';
import DataTableEmailSmsConfig from './DataTableEmailSmsConfig';
import HeaderEmailSmsConfig from './HeaderEmailSmsConfig';
import { useDispatch, useSelector } from 'react-redux';
import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
import { getEmailSmsProduct } from 'redux/actions/emailSmsAction';
import useElementSize from 'hook/useElementSize';
import ModalCreateEmailSms from './ModalCreateEmailSms';

interface Props {
  isShow: boolean | undefined;
  onHide: (type?: string) => void;
}

const EmailSmsConfigContainer: React.FC<Props> = ({ isShow, onHide }) => {
  const loading = useSelector<any, boolean>((state) => state?.EmailSmsReducer?.loading);
  const [start, setStart] = useState<number>(0);
  const [limit, setLimit] = useState<number>(20);
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [ filter, setFilter] = useState<any>({})

  const [totalRow, setTotalRow] = useState<number>(0);
  const [squareRef, { width, height }] = useElementSize();

  const [emailSmsProduct, setEmailSmsProduct] = useState<EmailSmsProductReponse[]>([])

  const dispatch = useDispatch()

  useEffect(() => {
    const payload = {
      paging : {
        start,
        limit
      },
      sort : {
        createdAt : 1
      }
    }
    dispatch(getEmailSmsProduct(payload, (status, res) => {
      if(status){
        setEmailSmsProduct(res?.data)
        // setTotalRow(res?.totalRow)
        setTotalRow(res?.data.length)
      }else{
        setEmailSmsProduct([])
      }
    }))
  },[])

  const getListEmailSmsProduct = (start?: number, limit?: number, sort?: {}) => {
    const payload: GetEmailSmsProductInput = {
      // filter,
      paging: {
        start: start!,
        limit: limit!,
      },
      sort: {
        createdAt: 1,
      },
    };
    function getListMerchant(payload: GetEmailSmsProductInput) {
      dispatch(
        getEmailSmsProduct(payload, (status, res) => {
          setSubmitForm(false);
          if (status) {
            setEmailSmsProduct(res?.data);
            // setTotalRow(res?.totalRow);
            setTotalRow(res?.data.length);
          } else {
            setEmailSmsProduct([]);
          }
        })
      );
    }
    return {
      payload,
      getList: getListMerchant,
      submitForm
    };
  };

  // const GetListEmailSmsProduct = () => {
  //   const payload = {
  //     paging : {
  //       start,
  //       limit
  //     },
  //     sort : {
  //       createdAt : 1
  //     }
  //   }
  //   dispatch(getEmailSmsProduct(payload, (status, res) => {
  //     if(status){
  //       setEmailSmsProduct(res?.data)
  //       setTotalRow(res?.totalRow);
  //     }else{
  //       setEmailSmsProduct([])
  //     }
  //   }))
  // }


  return (
    <div className='merchant-container'>
      <DataTableEmailSmsConfig 
        dataEmailSmsProduct={emailSmsProduct} 
        getDataList={getListEmailSmsProduct}
        totalFilter={totalRow}
        heightBoxSearch={height + 1}
        setEmailSmsProduct={setEmailSmsProduct}
      />
      {loading && <LoadingFullScreen />}
      <ModalCreateEmailSms setSubmitForm={setSubmitForm} show={isShow} onHide={onHide} />
    </div>
  );
};

export default EmailSmsConfigContainer;
