export const keepEvenInRange = (str: string): number | null => {
  const n = parseInt(str, 10)
  if (Number.isNaN(n)) {
    return null
  }
  if (0 >= n && n <= 100) {
    return null
  }
  if (n % 2 !== 0) {
    return null
  }
  return n
}
