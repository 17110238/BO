export interface getLogsInterface {
  filter?: {
    tags?: string;
    createdAt?: {
      from?: string;
      to?: string;
    };
  };
  paging: {
    start: number;
    limit: number;
  };
}

export interface logsDataInterface {
  id: string;
  message: string;
  tags: string[];
  createdAt: Date;
  source: string;
  tyep: string;
}
