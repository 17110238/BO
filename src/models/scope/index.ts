export interface scopeReducerType {
  loading: boolean;
  scopes: [];
  mcScopeArray: Array<Scope>
}

export interface scopeFilterInterface {
  filter?: {
    scope?: string;
    description?: string;
  };
  paging?: {
    start?: number;
    limit?: number;
  };
}

export interface Scope {
  id: string;
  scope: string;
  service: string;
  description: string;
  group: string[];
}

export interface PostScope {
  scope: string;
  description: string;
  group: string[];
}

export interface DeleteScopeBoInput {
  id: number
}

export interface CreateScopeMCInput {
  scope: string
  service: string
  group?: string[]
  description?: string
}

export interface UpdateScopeMCInput {
  id: number
  service?: string
  group?: string[]
  description?: string
}