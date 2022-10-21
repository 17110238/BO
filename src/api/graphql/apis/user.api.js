import { callGraphql } from '..'

export const postLogin = (args) => {
  const SQL_LOGIN = `
    mutation Login($input: LoginInput!) {
      Account {
        Login(input: $input) {
          accessToken
          message
          succeeded
          state
        }
      }
    }`
    console.log('postLogin')
  return callGraphql(SQL_LOGIN, { input: { ...args} })
}


export const createAccountAPI = (args) => {
  const SQL_CREATE_ACCOUNT = `
    mutation CreateAccount($input: CreateInput!) {
      Account {
        Create(input: $input) {
          message
          succeeded
        }
      }
    }
    `
  return callGraphql(SQL_CREATE_ACCOUNT, { input: { ...args} })
}


export const getListRoleOfAppUserAPI = (args) => {
  const SQL_GET_LIST_ROLE = `
    query GetListRole {
      Account {
        GetListRole {
          key
          name
          description
          scope {
            id
            service
            scope
            description
          }
        }
      }
    }
    `
  return callGraphql(SQL_GET_LIST_ROLE)
}

export const getListScopeOfAppUserAPI = (args) => {
  const SQL_GET_LIST_SCOPE = `
    query GetLisScope {
      Account {
        GetListScope {
          id
          service
          scope
          description
        }
      }
    }
    `
  return callGraphql(SQL_GET_LIST_SCOPE)
}

