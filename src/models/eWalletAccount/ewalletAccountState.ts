export interface EwalletSearchSessionsResponse {
  id?: number;

  userId?: String;
  appName?: String;
  clientId?: String;
  userAgent?: String;
  clientVersion?: String;
  loginTime?: String | any;
  logoutTime?: String | any;
  ip?: String;
  os?: String;
  clientChannel?: String;
  createdAt?: string;
  updatedAt?: string;
}
