/**
 * Formats a number by adding spaces as thousands separators.
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns The formatted string with spaces as separators
 */
export function formatNumberWithSpaces(
  value: number,
  decimals: number = 2,
): string {
  return value.toFixed(decimals).replaceAll(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
