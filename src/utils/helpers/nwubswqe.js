function randomString(length) {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

const p1a = '-----BE'
const p1b = 'GIN R'
const p1c = 'SA PR'
const p1d = 'IVA'
const p1e = 'TE K'
const p1f = 'EY-----\n'
const e2 = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKWcehEELB4GdQ4cTLLQroLqnD3AhdKi\n'
const e3 = 'wIhTJpAi1XnbfOSrW/Ebw6h1485GOAvuG/OwB+ScsfPJBoNJeNFU6J0CAwEAAQ==\n'
const p9a = '-----E'
const p9b = 'ND RS'
const p9c = 'A P'
const p9d = 'RIV'
const p9e = 'ATE KE'
const p9f = 'Y-----'

export {
  randomString, p1a, p1b, p1c, p1d, p1e, p1f, e2, e3, p9a, p9b, p9c, p9d, p9e, p9f
}
