export interface SearchConnectedUserInput {
  filter?: {
    accountId?: number;
    appId?: number;
    phone?: string;
  };
  paging?: {
    start?: number;
    limit?: number;
  };
  sort?: {
    createdAt?: number;
  };
}

export interface UnlinkConnectedUserInput {
  id: number;
}

export interface ConnectedUserType {
  id: number;
  userId: string;
  phone: string;
  appId: number;
  createdAt: number;
  accountId: number;
  appName: string;
  merchantName: string;
}