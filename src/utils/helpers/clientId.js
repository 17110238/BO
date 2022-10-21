import Fingerprint2 from 'fingerprintjs2'

const fingerprintPromise = new Promise((resolve, reject) => {
  Fingerprint2.get((components) => {
    const deviceId = Fingerprint2.x64hash128(
      components
        .map(function (pair) {
          return pair.value
        })
        .join(),
      31
    )
    resolve({ deviceId })
  })
})

export { fingerprintPromise }
