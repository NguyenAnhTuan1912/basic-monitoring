/**
 * Rounds a number to the specified number of decimal places.
 *
 * @param n
 * @param digits
 * @returns
 */
export function roundTo(n: number, digits: number) {
  const factor = Math.pow(10, digits);
  return Math.round(n * factor) / factor;
}
