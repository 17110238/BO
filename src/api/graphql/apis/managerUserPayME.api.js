

import { callGraphql } from '..'

export const postSearchAccountPayME= (args) => {
  const SQL_SEARCH_ACCOUNT_PayME = `
  query SearchAccMc($input: SearchAccMcInput) {
    AccountMerchant {
      SearchAccMc(input: $input) {
        message
        succeeded
        totalRow
        data {
          accountId
          username
          phone
          fullname
          birthday
          gender
          identifyNumber
          address
          issueDate
          issuePlace
          email
          isActive
          state
          scope
          lastedLoginAt
          lastedLogoutAt
          accountType
          countLoginFail
          avatar
          merchantId
          merchantName
          group
          createdAt
          updatedAt
        }
      }
    }
  }`
    console.log('postLogin')
  return callGraphql(SQL_SEARCH_ACCOUNT_PayME, { input: { ...args} })
}
