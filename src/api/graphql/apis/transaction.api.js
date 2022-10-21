import { callGraphql } from '..'

export const getListTransactionAPI = (args) => {
	const SQL_GET_LIST_TRANSACTION = `
  query GetAllTransaction {
    Transaction {
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
  `
	return callGraphql(SQL_GET_LIST_TRANSACTION)
}
