export interface DataReportPartner {
  date: string;
  newPartner: string;
  totalNewPartners: number;
}

export interface ReportPartnerInput {
  filter?: {
    createdAt?: {
      from: string;
      to: string;
    };
  };
}
