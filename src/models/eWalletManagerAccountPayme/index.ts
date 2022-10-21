export interface DataSearchEmployee {
  id?: number
  phone?: string
  fullname?: string
  company?: string
  accountStatus?: string
  ewalletAccount?: string
  createdAt?: string
}

export interface SearchEmployeeResponsed {
  data?: DataSearchEmployee[]
}

export interface FilterSearchEmployeeInput {
  txtSearch?: string
  accountGroupId?: number
}
export interface PagingSearchEmployeeInput {
  start?: number
  limit?: number
}

export interface SearchEmployeeInput {
  filter?: FilterSearchEmployeeInput
  paging?: PagingSearchEmployeeInput
}

export interface AddEmployeeInput {
  phone?: string,
  accountGroupId?: number
}

export interface AddEmployeeResponsed {
  message?: string,
  succeeded?: boolean
}

export interface UpdateEmployeeInput {
  id?: number,
  accountGroupId?: number
}

export interface UpdateEmployeeResponsed {
  message?: string,
  succeeded?: boolean
}

export interface DeleteEmployeeInput  {
  id?: number
}

export interface DeleteEmployeeResponsed  {
  message?: string,
  succeeded?: boolean
}

export interface DataGetListCompany {
  id?: number,
  name?: string
}

export interface GetListCompanyResponsed {
  data?: DataGetListCompany[]
}