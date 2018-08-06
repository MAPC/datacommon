import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import colors from '~/app/constants/colors';
import { maxToMargin } from '~/app/utils/charts';

const defaultColors = Array.from(colors.CHART.values());

const container = {
  width: 500,
  height: 500,
};

const defaultMargin = {
  top: 20,
  left: 40,
  right: 20,
  bottom: 50,
};

class StackedAreaChart extends React.Component {

  constructor(props) {
    super(props);

    this.renderChart = this.renderChart.bind(this);

    this.stack = d3.stack();
    this.color = d3.scaleOrdinal(props.colors || defaultColors);
  }


  renderChart() {
    const bonusLeftMargin = maxToMargin(d3.max(this.props.data, d => d.y));
    const margin = Object.assign({}, defaultMargin, {
      left: defaultMargin.left + bonusLeftMargin,
    });
    const width = (container.width - margin.left) - margin.right;
    const height = (container.height - margin.top) - margin.bottom;

    const x = d3.scaleLinear().domain(d3.extent(this.props.data, d => d.x)).range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    const area = d3.area()
      .x(d => x(d.data.x))
      .y0(d => y(d[0]))
      .y1(d => y(d[1]));

    const keys = [...(new Set(this.props.data.map(d => d.z)))];

    this.color.domain(keys);
    this.stack.keys(keys);

    this.chart.selectAll('*').remove(); // Clear chart before drawing lines

    this.gChart = this.chart.append('g');
    this.gChart.attr('transform', `translate(${margin.left},${margin.top})`);

    let data = this.props.data.reduce((acc, row) => {
        acc[row.x] = { ...(acc[row.x] || {}), ...{[row.z]: row.y} };
        return acc;
      }, {});
    data = Object.keys(data).map(xVal => ({ x: xVal, ...data[xVal] }));

    const stackedData = this.stack(data);
    y.domain(d3.extent(stackedData.reduce((a,b) => a.concat(b.map(t => t[1])), []), d => d));

    const layer = this.gChart
      .selectAll('.layer')
      .data(stackedData)
      .enter()
      .append('g')
      .attr('class', 'layer');

    layer.append('path')
      .attr('class', 'area')
      .style('fill', d => this.color(d.key))
      .attr('d', area);

    const xAxis = d3.axisBottom(x)
      .tickSize(0)
      .tickPadding(10)
      .tickFormat(this.props.xAxisFormat);
    const yAxis = d3.axisLeft(y)
      .tickSize(0)
      .tickPadding(10)
      .ticks(10);

    this.gChart
      .append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);

    this.gChart
      .append('g')
      .attr('class', 'axis axis-y')
      .call(yAxis);

    this.chart.append('text')
      .attr('class', 'axis-label')
      .attr('x', (height / -2) - margin.top)
      .attr('y', 2)
      .attr('transform', 'rotate(-90)')
      .attr("dy", "12")
      .style('text-anchor', 'middle')
      .text(this.props.yAxis.label);

    this.chart.append('text')
      .attr('class', 'axis-label')
      .attr('x', width / 2 + margin.left)
      .attr('y', height + margin.top + margin.bottom - 22)
      .attr("dy", "12")
      .style('text-anchor', 'middle')
      .text(this.props.xAxis.label);

    const li = this.legend
      .selectAll('li')
      .data(keys)
      .enter()
      .append('li')
    li.append('span')
      .attr('class', 'color-patch')
      .style('background', d => this.color(d));
    li.append('span')
      .text(d => d);
  }


  componentDidMount() {
    const { width, height } = container;

    this.chart = d3.select(this.svg)
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', `0 0 ${width} ${height}`);

    this.legend = d3.select(this.legendContainer).append('ul');

    this.renderChart();
  }


  componentDidUpdate() {
    this.renderChart();
  }


  render() {
    return (
      <div className="component chart StackedAreaChart">
        <svg ref={el => this.svg = el}></svg>
        <div ref={el => this.legendContainer = el} className="legend"></div>
      </div>
    );
  }

}

StackedAreaChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    z: PropTypes.string.isRequired,
  })).isRequired,
  xAxis: PropTypes.shape({
    label: PropTypes.string.isRequired,
    format: PropTypes.func,
  }).isRequired,
  yAxis: PropTypes.shape({
    label: PropTypes.string.isRequired,
    format: PropTypes.func,
  }).isRequired,
  colors: PropTypes.arrayOf(PropTypes.string),
};

StackedAreaChart.defaultProps = {
  xAxisFormat: d => d,
  yAxisFormat: d => d,
};

export default StackedAreaChart;