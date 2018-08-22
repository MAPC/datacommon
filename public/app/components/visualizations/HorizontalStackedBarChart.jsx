import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import colors from '~/app/constants/colors';
import { maxToMargin, drawLegend, maxTextToMargin } from '~/app/utils/charts';

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

class HorizontalStackedBarChart extends React.Component {

  constructor(props) {
    super(props);

    this.renderChart = this.renderChart.bind(this);

    this.stack = d3.stack();


    const container = {
      width: 500,
      height: 500,
    };

    const margin = {
      top: 20,
      right: 20,
      bottom: 50,
      left: 60
    };

    this.size = {
      width: (container.width - margin.left) - margin.right,
      height: (container.height - margin.top) - margin.bottom,
      margin,
      container,
    };
  }

  renderChart() {
    // Measure data and calculate size and margins
    const bonusLeftMargin = maxTextToMargin(this.props.data.reduce((acc, d) => Math.max(acc, d.y.length), 0), 12);
    const margin = Object.assign({}, defaultMargin, {
      left: defaultMargin.left + bonusLeftMargin,
    });
    const width = (container.width - margin.left) - margin.right;
    const height = (container.height - margin.top) - margin.bottom;

    // Prepare data and adjust scales
    const keys = [...(new Set(this.props.data.map(d => d.z)))];
    const colors = this.props.data.reduce((acc, d) =>
        (d.color ? acc.concat([d.color]) : acc), []);
    this.color = d3.scaleOrdinal(colors.length ? colors : defaultColors);
    this.color.domain(keys);
    this.stack.keys(keys);

    const data = this.props.data.reduce((acc, row) => {
      acc[row.y] = { ...(acc[row.y] || {}), ...{[row.z]: row.x} };
      return acc;
    }, {});
    const groups = Object.keys(data);

    const stackedData = this.stack(groups.map(yVal => ({ y: yVal, ...data[yVal] })));

    // Setup scales and axes
    const xScale = d3.scaleLinear()
      .range([0, width])
      .domain(d3.extent(stackedData.reduce((a,b) => a.concat(b.map(t => t[1])), [0]), d => d));
    const yScale = d3.scaleBand()
      .domain(groups)
      .range([height, 0])
      .paddingInner(0.2);

    const xAxis = d3.axisBottom(xScale)
      .tickSize(0)
      .tickPadding(10)
      .tickFormat(this.props.xAxis.format);

    const yAxis = d3.axisLeft(yScale)
      .tickSize(0)
      .tickPadding(10)
      .ticks(10)
      .tickFormat(this.props.yAxis.format);

    this.chart.selectAll('*').remove(); // Clear chart before drawing
    this.gChart = this.chart.append('g');
    this.gChart.attr('transform', `translate(${margin.left},${margin.top})`);

    const layer = this.gChart
      .selectAll('.layer')
      .data(stackedData)
      .enter()
      .append('g')
      .attr('class', 'layer')
      .attr('fill', d => this.color(d.key));

    layer.selectAll("rect")
  	  .data(d => d)
      .enter()
      .append("rect")
      .attr("y", d => yScale(d.data.y))
      .attr("x", d => xScale(d[0]))
      .attr("width", d => xScale(d[1]) - xScale(d[0]))
      .attr("height", yScale.bandwidth());

    this.gChart.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);

    this.gChart.append('g')
      .attr('class', 'axis axis-y')
      .call(yAxis);

    this.chart.append('text')
      .attr('class', 'axis label')
      .attr('x', height / -2)
      .attr('y', 0)
      .attr('transform', 'rotate(-90)')
      .attr("dy", "20")
      .attr('font-size', '12px')
      .style('text-anchor', 'middle')
      .text(this.props.yAxis.label);

    this.chart.append('text')
      .attr('class', 'axis label')
      .attr('x', (container.width / 2) + 15)
      .attr('y', height + (margin.top * 2))
      .attr("dy", "20")
      .attr('font-size', '12px')
      .style('text-anchor', 'middle')
      .text(this.props.xAxis.label);

    this.legend.selectAll('*').remove();
    drawLegend(this.legend, this.color, keys);
  }


  componentDidMount() {
    const { width, height } = container;

    this.chart = d3.select(this.svg)
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', `0 0 ${width} ${height}`);

    this.legend = d3.select(this.legendContainer);

    this.renderChart();
  }


  componentDidUpdate() {
    this.renderChart();
  }


  render() {
    return (
      <div className="component chart HorizontalStackedBarChart">
        <svg ref={el => this.svg = el}></svg>
        <div ref={el => this.legendContainer = el} className="legend"></div>
      </div>
    );
  }

}

HorizontalStackedBarChart.propTypes = {
  xAxis: PropTypes.shape({
    label: PropTypes.string.isRequired,
    format: PropTypes.func,
  }).isRequired,
  yAxis: PropTypes.shape({
    label: PropTypes.string.isRequired,
    format: PropTypes.func,
  }).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.string.isRequired,
    z: PropTypes.string.isRequired,
    color: PropTypes.string,
  })).isRequired,
};

export default HorizontalStackedBarChart;
