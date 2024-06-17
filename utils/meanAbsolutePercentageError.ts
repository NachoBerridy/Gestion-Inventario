export default function meanAbsolutePercentageError(
  actual: number,
  predicted: number
): number {
  return (Math.abs(actual - predicted) / actual) * 100;
}