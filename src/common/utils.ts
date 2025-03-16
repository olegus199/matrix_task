export const calcPercentage = (num: number, total: number): number =>
  Math.round((num * 100) / total);

export function formatNumber(number: number): string {
  return number.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).replace(/,/g, " ");
}