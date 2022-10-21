import { callGraphql } from '..'

export const searchMCAPI = (args) => {
  const SQL_SEARCH_MERCHANT = `query SearchMC($input: SearchMcInput) {
      Merchant {
        SearchMc(input: $input) {
          message
          succeeded
          data {
            merchantId
            contactInfo {
              name
              email
              phone
            }
            accountInfo {
              id
            }
            isActive
            createdAt
            approvedAt
            updatedAt
            state
            stores {
              merchantName
              storeName
            }
            businessDetails {
              identifyImages
              merchantContract {
                fileName
                contractCode
              }
            }
            businessOverview {
              brandName
            }
            businessOverview{
              type
            }
          }
          totalRow
        }
      }
    }
  `

  return callGraphql(SQL_SEARCH_MERCHANT, { input: { ...args} })
}
