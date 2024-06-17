export default function averageAbsoluteDeviation(data: number[]): number {
    const mean = data.reduce((acc, curr) => acc + curr, 0) / data.length;
    const deviations = data.map((value) => Math.abs(value - mean));
    return deviations.reduce((acc, curr) => acc + curr, 0) / data.length;
}