export function Percent(x) {
  return `${x}%`;
}

export function Capitalize(phrase) {
  return phrase.replace(/\b\w/g, l => l.toUpperCase())
}
