import { callGraphql } from '..'

export const searchAccountMerchantAPI = (args) => {
  const SQL_SEARCH_ACCOUNT_MERCHANT = `query AccountMerchant($input: SearchAccMcInput) {
  AccountMerchant {
    SearchAccMc(input: $input) {
      message
      succeeded
      data {
        accountId
        username
        fullname
        phone
        issueDate
        email
        isActive
        state
        merchantName
        createdAt
        updatedAt
      }
    }
  }
}
  `

  return callGraphql(SQL_SEARCH_ACCOUNT_MERCHANT, { input: { ...args} })
}
