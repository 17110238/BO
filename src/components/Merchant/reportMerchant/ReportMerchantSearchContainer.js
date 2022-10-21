
import React, { useState ,useEffect} from 'react'
// import HeaderPaymentLink from './HeaderPayMELink';
import BoxSearchMerchant from './BoxSearchMerchant'
import ModalAccountList from './ModalCustomerList'
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

export default function ReportMerchantSearch() {
  const { t } = useTranslation('common');
  const [listCustomer, setListCustomer] = useState([]);
  const router = useRouter();
  const [valueSearch, setValueSearch] = useState({
    keyword: '',
    state: 'EMAIL',
    kycState:''
  });
  const [dateValue, setDateValue] = useState({
    from: '',
    to: '',
  });
  const handleFromChange = (from) => {
    setDateValue({ ...dateValue, from });
  };

  const handleToChange = (to) => {
    setDateValue({ ...dateValue, to });
  };
  useEffect(()=>{
    getListPayouts()
  },[])
  
  const getListPayouts = () => {
    const dataDemo=[{
      mcId:'mc001',
      accountId:'acc001',
      accountType:'PERSONAL',
      fullname:'datht',
      identifyType:'CCCD',
      identifyNumber:'0123456789',
      address:'15C Nguyễn Cơ Thạch',
      placeOfIssue:'hcm',
      issuedAt:'01/01/2000',
      email:'datht@payme.vn',
      brandName:'',
      state:'OPEN',
      imgkyc:'',
      isActive:'Active',
      mcc:'demo',
      businessType:'',
      websize:'',
      online:'ONLINE',
      levelPayment:'Dưới 100 triệu',
      maxPayment:'100,000,000 đ',
      minPayment:'10,000 đ'
    },
    {
      mcId:'mc002',
      accountId:'acc002',
      accountType:'PERSONAL',
      fullname:'trieunv',
      identifyType:'CCCD',
      identifyNumber:'0123456789',
      address:'15C Nguyễn Cơ Thạch',
      placeOfIssue:'hcm',
      issuedAt:'01/01/2000',
      email:'trieunv@payme.vn',
      brandName:'',
      state:'OPEN',
      imgkyc:'',
      isActive:'Active',
      mcc:'demo',
      businessType:'',
      websize:'',
      online:'ONLINE',
      levelPayment:'Dưới 100 triệu',
      maxPayment:'100,000,000 đ',
      minPayment:'10,000 đ'

    },
  ]
   
   
    setListCustomer(dataDemo)
    // let createdAt = { from: '', to: '' };
    // if (dateValue?.from && dateValue.to) {
    //   createdAt = { from: '', to: '' };
    //   if (dateValue.from) createdAt.from = dayjs(dayjs(dateValue.from).format('YYYY/MM/DD'));
    //   if (dateValue.to)
    //     createdAt.to = dayjs(dayjs(dateValue.to).format('YYYY/MM/DD'))
    //       .add(1, 'day')
    //       .subtract(1, 'second');
    // }
    // const payload = {
    //   filter: {
    //     ...valueSearch,
    //     state: valueSearch.state
    //       ? [valueSearch.state]
    //       : ['SUCCEEDED', 'APPROVED', 'CANCELED', 'PENDING', 'FAILED'],
    //     createdAt,
    //   },
    //   paging: {
    //     start,
    //     limit,
    //   },
    //   clientId,
    // };
    //TODO
    // dispatch(
    //   getListPayoutAction(payload, (status, data) => {
    //     if (status) {
    //       setDataPayout(data?.data?.items);
    //       setTotalRow(data?.data?.itemTotal);
    //     } else {
    //     }
    //   })
    // );
  };

  const handleChange = (e) => {
    setValueSearch({ ...valueSearch, [e.target.name]: e.target.value });
  };
  const renderSearchList=()=>{
  
    return(
      <>
      <div style={{borderBottom:' 1px solid grey',width:'100%'}} >
        <BoxSearchMerchant
            valueSearch={valueSearch}
            handleChange={handleChange}
            getListPayouts={getListPayouts}
            handleFromChange={handleFromChange}
            handleToChange={handleToChange}
          />
        </div>
        <div>
            <ModalAccountList 
              show={true}
              // toggleModalCustomerList={toggleModalCustomerList}
              listCustomer={listCustomer}
              // numberCustomer={numberCustomer}
              // numberInvalidCustomer={numberInvalidCustomer}
              t={t}
            />
          </div>  
      </>
      )
  }
   
  

  return (
    <div >
       <div className='box-payment' style={{ position:'relative', padding:'10px',minHeight:'80vh'}}>
        {renderSearchList()}
       </div>
        
    </div>
  )
}
