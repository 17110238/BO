import { PagingInput } from 'models/utitlity/utilityState';

export interface GetLogFilter {
  createdAt?: {
    from: string;
    to: string;
  };
  state?: string;
  search?: string;
}

export interface GetLogInput {
  filter?: GetLogFilter;
  paging?: PagingInput;
}

export interface NotifyState {
  loading: boolean;
  loadingSendSMS: boolean;
  history: GetLogType[];
  message: string;
}

export interface GetLogType {
  createdAt: string;
  phone?: string;
  email?: string;
  campaign: string;
  description: string;
  state: string;
  content: string;
}

export interface SendSmsInput {
  file?: any,
  phoneList?: string[],
  content?: string,
  campaign: string
}

export interface MessageResponsed {
  message: string,
  succeeded: boolean
}