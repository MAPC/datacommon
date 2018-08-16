export function maxToMargin(maxValue) {
  if (!maxValue) { return 0; }
  const zeros = Math.floor(Math.log10(maxValue)) + 1;
  const fromZeros = zeros * 6;
  const fromCommas = Math.floor(Math.max(0, zeros - 1) / 3) * 5;
  return fromZeros + fromCommas;
}

export function maxTextToMargin(maxLength, fontSize) {
  if (!maxLength) { return 0; }
  return maxLength * fontSize * 0.56;
}

const addLegendColumn = (legend, color, keysInColumn) => {
  const li = legend.append('ul')
    .selectAll('li')
    .data(keysInColumn)
    .enter()
    .append('li');
  li.append('span')
    .attr('class', 'color-patch')
    .style('background', d => color(d));
  li.append('span')
    .attr('class', 'label')
    .text(d => d);
};

export function drawLegend(legend, color, keys) {
  const sortedKeys = keys.sort();
  if (keys.length > 6) {
    legend.attr('class', 'legend two-column');
    addLegendColumn(legend, color, sortedKeys.slice(0, Math.round(sortedKeys.length / 2)));
    addLegendColumn(legend, color, sortedKeys.slice(Math.round(sortedKeys.length / 2)));
  } else {
    addLegendColumn(legend, color, sortedKeys);
  }
}
