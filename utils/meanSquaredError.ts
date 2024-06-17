export default function meanSquaredError( actual: number[], predicted: number[]): number {
    const sum = actual.reduce((acc, curr, index) => acc + Math.pow(curr - predicted[index], 2), 0);
    return sum / actual.length;
}