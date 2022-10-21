import makeRequest, { HTTP_METHOD } from '../../axios'
import { API_URL, API_ENDPOINT } from './constants'

export default {
  getHistories: async (data) => {
    const result = await makeRequest(
      API_URL.GET_HISTORIES,
      API_ENDPOINT,
      HTTP_METHOD.POST,
      data
    )
    return result
  },

  getWalletBalance: async () => {
    const result = await makeRequest(
      API_URL.GET_WALLET_BALANCE,
      API_ENDPOINT,
      HTTP_METHOD.POST
    )
    return result
  },

  getBankname: async () => {
    const result = await makeRequest(
      API_URL.GET_BANK_NAME,
      API_ENDPOINT,
      HTTP_METHOD.POST
    );
    return result;
  },
};
