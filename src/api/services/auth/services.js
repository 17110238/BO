import makeRequest, { HTTP_METHOD } from '../../axios'
import { API_URL, API_ENDPOINT } from './constants'

export default {
  loginUser: async (data) => {
    const result = await makeRequest(
      API_URL.LOGIN_USER,
      API_ENDPOINT,
      HTTP_METHOD.POST,
      data
    )
    return result
  },

  getUserInfo: async (data) => {
    const result = await makeRequest(
      API_URL.GET_USER_INFO,
      API_ENDPOINT,
      HTTP_METHOD.POST,
      data
    )
    return result
  },

  logoutUser: async (data) => {
    const result = await makeRequest(
      API_URL.LOGOUT_USER,
      API_ENDPOINT,
      HTTP_METHOD.POST,
      data
    )
    return result
  },

  registerClient: async (data) => {
    const result = await makeRequest(
      API_URL.REGISTER_CLIENT_ID,
      API_ENDPOINT,
      HTTP_METHOD.POST,
      data
    )
    return result
  },

  activeTrustDevice: async (data) => {
    const result = await makeRequest(
      API_URL.TRUST_DEVICE_ACTIVE_CODE,
      API_ENDPOINT,
      HTTP_METHOD.POST,
      data
    )
    return result
  },
}
