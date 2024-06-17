export default function meanAbsolutePercentageError( predictions: number[], actuals: number[] ): number {
  const n = predictions.length;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += 100*Math.abs((predictions[i] - actuals[i]))/actuals[i];
  }
  return sum / n;
}