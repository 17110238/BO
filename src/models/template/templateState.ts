export interface TemplateState {
  loading: boolean;
  templateList: EmailTemplateResponse[];
  templateListWallet : EmailTemplateResponse[]
}

export interface GetEmailTemplateInputResponsed {
  message: string;
  succeeded: boolean;
  data: EmailTemplateResponse[];
  totalRow: number;
}

export interface EmailTemplateResponse {
  title?: string;
  content?: string;
  description?: string;
  shortName?: string;
  type?: string;
  id?: number;
}

export interface GetEmailTemplateInput {
  filter?: {
    type?: string;
  }
  paging?: {
    start?: number;
    limit?: number;
  }
  sort?: {
    createdAt?: number;
  }
}

export interface CreateEmailTemplateInput {
  id?: number;
  title?: string;
  content?: string;
  description?: string;
  shortName?: string;
  type?: string;
  projectName?: string;
}

export interface UpdateEmailTemplateInput {
  id: number;
  title?: string;
  content?: string;
  description?: string;
  shortName?: string;
  type?: string;
}

export interface MutationEmailTemplateResponse {
  message?: string;
  succeeded?: boolean;
}


// Template manager E-Wallet

interface PagingInput {
  start?: number,
  limit?: number
}

export interface GetEwalletTemplateFilter {
  id?: number,
  type?: string
}

export interface GetEwalletTemplateInput {
  filter?: GetEwalletTemplateFilter
  paging?: PagingInput
}

export interface GetEwalletTemplateResponsed {
  message?: String
  succeeded?: Boolean
  data?: EwalletTemplateBoType[]
}

export interface EwalletTemplateBoType {
  id?: number
  title?: string
  content?: string
  description?: string
  project?: string
  shortName?: string
  type?: string
  createdAt?: Date
  updatedAt?: Date
}

// Create template E-wallet

export interface CreateEwalletTemplateInput {
  title?: string
  content?: string
  description?: string
  shortName?: string
  type?: string
  createdAt?: Date
  updatedAt?: Date
}

// export interface MessageResponsed {
//   message: string,
//   succeeded: boolean
// }


// Update template E-Wallet

export interface UpdateEwalletTemplateInput {
  id?: number
  title?: string
  content?: string
  description?: string
  shortName?: string
  type?: string
  createdAt?: Date
  updatedAt?: Date
}

// Send Email template E-wallet
export interface SendMailEwalletTemplateInput {
  id?: number
  email?: string
}