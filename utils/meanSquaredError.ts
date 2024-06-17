export default function meanSquaredError( actual: number[], predicted: number[]): number {
    const n = actual.length;
    let sum = 0;
    for (let i = 0; i < n; i++) {
        sum += Math.pow(predicted[i] - actual[i], 2);
    }
    return sum / n;
}