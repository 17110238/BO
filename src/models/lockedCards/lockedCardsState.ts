import { typeEnumCard, typeEnumListCard } from "models";

export interface LockedCardState {
  loading: boolean;
  loadingUpdate: boolean;
  lockedCards: LockedCard[];
}

export interface GetLockedCardsInput {
  filter?: {
    serialNumber?: string;
  };
  paging?: {
    start: number;
    limit: number;
  };
  sort?: {
    createdAt: number;
  };
}

export interface LockedCardsResponse {
  data: LockedCard[];
}

export interface LockedCard {
  id: number;
  number: string;
  type: string;
  name: string;
  lockTime: string;
  swiftCode: string;
  state: string;
  stateAt: StateAtData[];
  createdAt: string;
  updatedAt: string;
}

export interface StateAtData {
  state: string;
  date: Date;
  accountId: number;
  fullName: string;
}

export interface LockCardInput {
  serialNumber: string;
  type: string;
}

export interface LockCardResponse {
  message: string;
  succeeded: boolean;
}

export interface CreateCardInput {
  cardNumber: string
  cardName: string
  type: typeEnumListCard
  swiftCode?: string
  state?: typeEnumCard
  numberFirst6?: number
  numberEnd4?: number

}
