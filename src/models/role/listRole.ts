export interface scopeRole {
  id: string;
  service: string;
  scope: string;
  description: string;
  isCheck?: boolean;
}

export interface Role {
  key: string;
  name: string;
  description: string;
  scope: Array<scopeRole>;
}

export interface roleReducer {
  loading: boolean;
  listScope: Array<scopeRole>;
  listRole: Array<Role>;
  error: boolean;
}

export interface roleAction {
  type: string;
  payload: any;
}

export interface dataCheckBox {
  scopes?: Array<Scopes>;
  roleKey: string;
}

export interface Scopes {
  scopeId: number;
  value: boolean;
}

export interface payloadUpdateScopeRole {
  scopes: Array<Scopes>;
  roleKey: string;
}
