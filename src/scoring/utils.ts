export function round(n: number, precision: number) {
  const factor = Math.pow(10, precision);
  return Math.round(n * factor) / factor;
}
