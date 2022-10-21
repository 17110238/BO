export const exportQuery = `subscription exportTransactionBank {
  SubExport{
      SubExportExcel{
          message
          succeeded
          type
          accountId
          url
          data
      }
  }
  }`;
