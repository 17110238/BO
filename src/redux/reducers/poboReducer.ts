import * as types from 'redux/types';
import { ActionReducer } from 'models';

const initialState: any = {
    loading: false,
    loadingChange: false,
    poboInfoArray: [],
    changepoboInfo: {}
};

export default function poboReducer(state = initialState, action: ActionReducer) {
    switch (action.type) {
        case types.GET_LIST_POBO.REQUEST:
            return {
                ...state,
                loading: true,
            };
        case types.GET_LIST_POBO.SUCCESS:
            return {
                ...state,
                loading: false,
                poboInfoArray: action.payload,
            };
        case types.GET_LIST_POBO.FAILURE:
            return {
                ...state,
                loading: false,
                poboInfoArray: action.payload,
            };

        default:
            return state;
    }
}
