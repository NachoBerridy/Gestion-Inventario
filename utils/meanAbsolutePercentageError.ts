export default function meanAbsolutePercentageError(predictions: number[], actuals: number[]): number {
  const n = predictions.length;
  let sum = 0;
  let validEntries = 0;

  for (let i = 0; i < n; i++) {
    if (actuals[i] !== 0) {
      sum += Math.abs((predictions[i] - actuals[i]) / actuals[i]);
      validEntries++;
    }
  }

  // Si no hay entradas válidas, devolvemos NaN para indicar que el cálculo no es posible.
  return validEntries === 0 ? NaN : (sum / validEntries) * 100;
}