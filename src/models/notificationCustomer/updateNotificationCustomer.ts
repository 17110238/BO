export interface UpdateNotificationCustomer {
  type?: string;
  title?: string;
  content?: string;
  project?: string;
  customer?: string;
  url?: string;
  redirectSchema?: string;
  titleSchema?: string;
  notiType?: string;
  customerList?: [string];
  file?: any;
}
