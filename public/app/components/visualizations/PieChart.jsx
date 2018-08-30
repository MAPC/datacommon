import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import colors from '~/app/constants/colors';
import { maxTextToMargin, drawLegend } from '~/app/utils/charts';

const defaultColors = Array.from(colors.CHART.values());

const container = {
  width: 500,
  height: 500,
};

const defaultMargin = {
  top: 80,
  left: 10,
  right: 10,
  bottom: 80,
};

class PieLabelBin {
  constructor(columnHeight, fontHeight) {
    this.columnHeight = columnHeight;
    this.fontHeight = fontHeight;
    this.slots = Array(Math.floor(columnHeight / fontHeight)).map(_ => false);
    this.keyToBinMap = {};
  }

  // Convert from bin coordinate system to graph coordinate system
  linearToCoords(y) {
    return y - (this.columnHeight / 2);
  }

  // Convert from graph coordinate system to bin coordinate system
  coordsToLinear(y) {
    return y + (this.columnHeight / 2);
  }

  getAvailableTop(top, key) {
    let bin = Math.floor(this.coordsToLinear(top) / this.fontHeight);
    if (bin >= this.slots.length) {
      return this.linearToCoords(this.slots.length * this.fontHeight);
    }
    while (bin < this.slots.length && this.slots[bin]) {
      bin += 1;
    }
    this.keyToBinMap[key] = this.linearToCoords((bin + 1) * this.fontHeight);
    this.slots[bin] = true;
    return this.keyToBinMap[key];
  }

  getTopByKey(key) {
    return this.keyToBinMap[key] || this.linearToCoords(this.slots.length * this.fontHeight);
  }
}

class PieChart extends React.Component {

  constructor(props) {
    super(props);

    this.renderChart = this.renderChart.bind(this);

    this.pie = d3.pie()
                .sort((a,b) => a.value > b.value)
                .value(d => d.value);

    this.color = d3.scaleOrdinal(props.colors || defaultColors);
  }


  renderChart() {
    const keys = [...(new Set(this.props.data.map(slice => slice.label)))];
    const sum = this.props.data.reduce((acc, slice) => slice.value + acc, 0);

    const bonusSideMargin = maxTextToMargin(keys.reduce((acc, k) => Math.max(acc, k.length), 0), 12);
    const margin = Object.assign({}, defaultMargin, {
      left: defaultMargin.left + bonusSideMargin,
      right: defaultMargin.right + bonusSideMargin,
    });
    const width = (container.width - margin.left) - margin.right;
    const height = (container.height - margin.top) - margin.bottom;
    this.chart.attr('viewBox', `0 0 ${container.width} ${height}`);

    const radius = Math.min(height, width) / 2;

    const innerArc = d3.arc()
      .outerRadius(radius * 0.9)
      .innerRadius(0);

    const outerArc = d3.arc()
      .outerRadius(radius)
      .innerRadius(radius);

    const pointerArc = d3.arc()
      .outerRadius(radius * 0.9)
      .innerRadius(radius * 0.7);

    this.color.domain(keys);
    this.chart.selectAll('*').remove(); // Clear chart before drawing

    this.gChart = this.chart.append('g');
    this.gChart.attr('transform', `translate(${(width / 2) + margin.left},${(height / 2)})`);
    const pieData = this.pie(this.props.data.sort((a, b) => a.value - b.value));

    // Pie chart
    const arc = this.gChart
      .selectAll('.arc')
      .data(pieData)
      .enter()
      .append('g')
      .attr('class', 'arc');

    arc.append('path')
      .attr('d', innerArc)
      .attr('fill', d => this.color(d.data.label))
      .attr('stroke', 'white')
      .attr('stroke-width', '1');

    // Labels
    this.gChart.append('g')
      .attr('class', 'labels');
    const text = this.gChart
      .select('.labels')
      .selectAll('text')
      .data(pieData, d => d.data.label);

    const midAngle = (d) => d.startAngle + (d.endAngle - d.startAngle) / 2;
    const rightLabelBin = new PieLabelBin(height, 18);
    const leftLabelBin = new PieLabelBin(height, 18);

    text.enter()
      .append('text')
      .attr('dy', '.35em')
      .attr('transform', (d) => {
        const [_, top] = outerArc.centroid(d);
        const pos = midAngle(d) < Math.PI
            ? [radius, rightLabelBin.getAvailableTop(top, d.data.label)]
            : [-radius, leftLabelBin.getAvailableTop(top, d.data.label)];
        return "translate("+ pos +")";
      })
      .attr('text-anchor', d => midAngle(d) < Math.PI ? 'start' : 'end')
      .text(d => `${d.data.label} ${(d.data.value * 100 / sum).toFixed(1)}%`);

    // Lines
    this.gChart.append('g')
      .attr('class', 'lines');

    const polyline = this.gChart
      .select('.lines')
      .selectAll('polyline')
      .data(pieData, d => d.data.label)
      .enter()
      .append("polyline")
      .attr('points', (d) => {
        const top = midAngle(d) < Math.PI
            ? rightLabelBin.getTopByKey(d.data.label)
            : leftLabelBin.getTopByKey(d.data.label);
        const labelPos = [radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1), top];
        const elbow = [];
        return [pointerArc.centroid(d), labelPos];
      });
  }


  componentDidMount() {
    const { width, height } = container;

    this.chart = d3.select(this.svg)
      .attr('preserveAspectRatio', 'xMinYMin meet');

    this.legend = d3.select(this.legendContainer);
    this.renderChart();
  }


  componentDidUpdate() {
    this.renderChart();
  }


  render() {
    return (
      <div className="component chart PieChart">
        <div className="svg-wrapper">
          <svg ref={el => this.svg = el}></svg>
        </div>
      </div>
    );
  }

}

PieChart.propTypes = {
  colors: PropTypes.arrayOf(PropTypes.string),
  data: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
};

export default PieChart;
