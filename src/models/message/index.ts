import { ReactNode } from 'react';

export interface EmailTemplateType {
  id: number;
  content: string;
  description: string;
  shortName: string;
  title: string;
  type: string;
  value: string;
  label: string;
}

export interface requestMessageType {
  title: string;
  target?: string;
  templateTitle: string;
  description: string;
  custom?: string;
  customeList: EmailTemplateType[];
  file?: any;
}

export interface SendMailDetailType {
  content: string;
  title: string;
  accountList?: string[];
  customer: string;
}

export interface SendMailInput {
  content: string;
  email: string;
  title: string;
  merchantName?: string;
}

export interface SendTestMailInput {
  email: string[];
  title: string;
  templateTitle: string;
  description: string;
}
