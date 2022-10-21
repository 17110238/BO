export interface ProcessingFlowState {
  loading: boolean;
  loadingModal: boolean;
  processingFlowArray: ProcessingFlowResponse[];
  createProcessingFlowInfo: MutationProcessingFlowResponse;
  updateProcessingFlowInfo: MutationProcessingFlowResponse;
}

export interface ProcessingFlowResponse {
  eventId: string;
  eventName: string;
  processList?: ProcessListType[];
}

export interface ProcessListType {
  order?: number;
  group?: string;
  telegram?: string;
  email: string;
  username?: string;
  state?: string;
  user?: UserApproveType[];
}

export interface UserApproveType {
  accountId: string;
  username: string;
  fullname: string;
  phone: string;
}

export interface GetProcessingFlowsInput {
  filter?: {
    eventId?: string;
    eventName?: string;
  };
  paging?: {
    start?: number;
    limit?: number;
  };
}

export interface CreateProcessingFlowInput {
  eventId: string,
  eventName: string,
  processList: ProcessListType
}

export interface UpdateProcessingFlowInput {
  eventId: string,
  eventName: string,
  processList: ProcessListType
}

export interface MutationProcessingFlowResponse {
  succeeded?: boolean,
  message?: string,
}