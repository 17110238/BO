export interface SettingSystemType {
  id?: number;
  key?: string;
  value?: string;
  description?: string;
  type?: string;
}

export interface PayloadGetSettingSystem {
  filter?: {
    key?: string;
  };
  paging?: {
    start: number;
    limit: number;
  };
  sort?: {
    createdAt: number;
  };
}
