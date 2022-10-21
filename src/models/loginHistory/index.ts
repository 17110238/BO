export interface ClientInfoTypes {
  platform?: string;
  deviceId?: string;
  channel?: string;
  version?: string;
  isEmulator?: number;
  isRoot?: number;
  userAgent?: string;
  getBrand?: string;
  buildNumber?: string;
  bundleId?: string;
  deviceType?: string;
  model?: string;
  readableVersion?: string;
  systemName?: string;
  systemVersion?: string;
}

export interface LoginHistoryTypes {
  id?: number;
  appId?: string;
  accountId?: string;
  lastLoginTime?: string;
  lastLogoutTime?: string;
  ip?: string;
  state?: boolean;
  createdAt?: string;
  updatedAt?: string;
  clientInfo?: ClientInfoTypes;
  username?: string;
}

export interface FilterLoginHistory {
  txtSearch?: string;
  createdAt?: {
    from?: string;
    to?: string;
  };
}

export interface InputLoginHistory {
  filter?: FilterLoginHistory;
  sort?: {
    createdAt?: number;
  };
  paging?: {
    start?: number;
    limit?: number;
  };
}

export interface ReducerLoginHistory {
  loading: boolean;
  dataLoginHistory: Array<LoginHistoryTypes>;
}
