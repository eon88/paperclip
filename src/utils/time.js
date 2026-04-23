export function getTodayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

export function formatDate(date = new Date()) {
  return date
    .toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    .toUpperCase()
}

export function getDayOfYear(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0)
  return Math.floor((date - start) / (1000 * 60 * 60 * 24))
}

export function getExactAge(birthYear) {
  const now = new Date()
  const msPerYear = 365.25 * 24 * 60 * 60 * 1000
  return (now - new Date(birthYear, 0, 1)) / msPerYear
}

export function getLifeStats(birthYear, lifeExpectancy = 80) {
  const exactAge = getExactAge(birthYear)
  const age = Math.floor(exactAge)
  const lifePercent = Math.min((exactAge / lifeExpectancy) * 100, 100)
  const existencePercent = Math.min(exactAge, 100)
  return { age, exactAge, lifePercent, existencePercent, lifeExpectancy }
}
