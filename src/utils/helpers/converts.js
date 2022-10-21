export function convertSecondstoTime(given_seconds) {
  let hours = Math.floor(given_seconds / 3600)
  let minutes = Math.floor((given_seconds - hours * 3600) / 60)
  let seconds = given_seconds - hours * 3600 - minutes * 60

  let timeString =
    minutes.toString().padStart(2, '0') +
    ':' +
    seconds.toString().padStart(2, '0')

  return timeString
}
