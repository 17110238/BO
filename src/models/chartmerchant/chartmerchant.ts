
import { GenderEnum, StateEnum, AccountTypeEnum } from "../index";
export interface Account {
  id: string;
  googleAccountId: string;
  username: string;
  password: string;
  fullname: string;
  phone: string;
  gender: GenderEnum;
  birthday: Date;
  address: string;
  identifyNumber: string;
  issueDate: Date;
  issuePlace: string;
  email: string;
  isActive: boolean;
  state: StateEnum;
  scope: string[];
  lastedLoginAt: Date;
  lastedLogoutAt: Date;
  accountType: AccountTypeEnum;
  countLoginFail: number;
  avatar: string;
  group: string[];
}

export interface GetMerchantsReport {
    month: number,
    total: number,
    newMerchants: number,
    activeMerchants: number
}
export interface LocationAmount{
    location?: string;
    count?: number;
    amount?: number;
    total?: number;
}

interface GetPaymentMethodMerchant{
    method: string,
    name: string,
    result:string[]
    
}
export interface paymentMethodTypes{
    method: string,
    name: string,
    amount: number,
    count: number,
    month: number,
    total:number,
}
export interface dataPaymentMethod{
    month: number,
    result:paymentMethodTypes[]
}
export interface merchantType{
  
    amount: number,
    count: number,
    month: number,
   
}
export interface merchantTopIncomeType{
    merchantId: number,
    merchantTitle:string,
    amount: number,
    count: number,
    total: number,
    month?: number,
    year?:number
   
}
// merchantId(pin):22
// merchantTitle(pin):"Nguyễn Văn Napas"
// count(pin):41
// amount(pin):362157904
// total(pin):358351201
export interface dataMerchantType{
    merchantType: string,
    result:merchantType[]

}

export interface dataTopIncomeMerchantType{
    month: number,
    year:number,
    result:merchantTopIncomeType[]

}

export interface ChartMerchant {
    loading?: boolean;
    dataColumnMerchant: GetMerchantsReport[];
    linePaymentMethod?: string[];
    dataLocationMerchant: LocationAmount[];
    dataPaymentMethod: dataPaymentMethod[];
    dataMerchantType: dataMerchantType[];
    dataTopIncomeMerchant: dataMerchantType[];
}
