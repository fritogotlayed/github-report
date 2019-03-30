
const COMMON_TIMES = {
  second: 1000,
  minute: 60 * 1000,
  hour: 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000
}

const convertMsToHumanReadable = function (value) {
  let x = value
  let seconds, minutes, hours, days
  x = Math.floor(x / 1000)
  seconds = x % 60
  x = Math.floor(x / 60)
  minutes = x % 60
  x = Math.floor(x / 60)
  hours = x % 24
  x = Math.floor(x / 24)
  days = x

  let parts = []
  if (days > 0) { parts.push(days + 'd') }
  if (hours > 0) { parts.push(hours + 'h') }
  if (minutes > 0) { parts.push(minutes + 'm') }
  if (seconds > 0) { parts.push(seconds + 's') }

  return parts.join(' ')
}

export { convertMsToHumanReadable, COMMON_TIMES }