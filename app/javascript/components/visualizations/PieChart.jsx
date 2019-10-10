import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import colors from '../../constants/colors';
import { maxTextToMargin, drawLegend } from '../../utils/charts';

const primaryColors = Array.from(colors.CHART.PRIMARY.values());
const extendedColors = Array.from(colors.CHART.EXTENDED.values());

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


class PieChart extends React.Component {

  constructor(props) {
    super(props);

    this.renderChart = this.renderChart.bind(this);

    this.pie = d3.pie()
                .sort((a,b) => a.value > b.value)
                .value(d => d.value);
  }


  renderChart() {
    const keys = [...(new Set(this.props.data.map(slice => slice.label)))];
    const keyValue = this.props.data.reduce((map, d) => Object.assign(map, { [d.label]: d.value }), {});
    const sum = this.props.data.reduce((acc, slice) => slice.value + acc, 0);
    const formatter = (key) => `${key} ${(keyValue[key] * 100 / sum).toFixed(1)}%`;

    const bonusSideMargin = maxTextToMargin(keys.reduce((acc, k) => Math.max(acc, k.length), 0), 12);
    const margin = Object.assign({}, defaultMargin, {
      left: defaultMargin.left + bonusSideMargin,
      right: defaultMargin.right + bonusSideMargin,
    });
    const width = (container.width - margin.left) - margin.right;
    const height = (container.height - margin.top) - margin.bottom;
    this.chart.attr('viewBox', `0 0 ${container.width} ${height}`);

    const radius = Math.min(height, width) / 1.5;

    const innerArc = d3.arc()
      .outerRadius(radius * 0.9)
      .innerRadius(0);

    this.color = d3.scaleOrdinal(
        this.props.colors
        || (keys.length > primaryColors.length ? extendedColors : primaryColors)
      )
      .domain(keys);
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

    this.legend.selectAll('*').remove();
    drawLegend(this.legend, this.color, keys, formatter);
  }


  componentDidMount() {
    const { width, height } = container;

    this.chart = d3.select(this.svg)
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', width)
      .attr('height', height);

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
          <div ref={el => this.legendContainer = el} className="legend"></div>
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
