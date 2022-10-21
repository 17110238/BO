export interface VersionReducerType {
  versions: VersionType[];
}

export interface VersionType {
  id: number;
  clientInfo?: ClientInfo;
  updateTitle?: string;
  updateURL?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClientInfo {
  platform?: string;
  versionNotSupported?: string;
  versionNewest?: string;
}
