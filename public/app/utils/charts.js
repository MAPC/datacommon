export function maxToMargin(maxValue) {
  const zeros = Math.floor(Math.log10(maxValue)) + 1;
  const fromZeros = zeros * 6;
  const fromCommas = Math.floor(Math.max(0, zeros - 1) / 3) * 5;
  console.log(maxValue, zeros, fromZeros, fromCommas)
  return fromZeros + fromCommas;
}
