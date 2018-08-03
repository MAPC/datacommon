import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';


class StackedAreaChart extends React.Component {

  constructor(props) {
    super(props);

    this.renderChart = this.renderChart.bind(this);

    this.stack = d3.stack();
    this.color = d3.scaleOrdinal(props.colors);

    const container = {
      width: 500,
      height: 500,
    };

    const margin = {
      top: 20,
      left: 50,
      right: 20,
      bottom: 30,
    };

    this.size = {
      height: (container.width - margin.top) - margin.bottom,
      width: (container.height - margin.left) - margin.right,
      margin,
      container,
    };
  }


  renderChart() {
    const { width, height, margin } = this.size;
    const x = d3.scaleLinear().domain(d3.extent(this.props.data, d => d.x)).range([0,width-margin.left]);
    const y = d3.scaleLinear().range([height,0]);

    const area = d3.area()
      .x(d => x(d.data.x))
      .y0(d => y(d[0]))
      .y1(d => y(d[1]));

    const keys = [...(new Set(this.props.data.map(d => d.z)))];

    this.color.domain(keys);
    this.stack.keys(keys);

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

    this.gChart
      .append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickFormat(this.props.xAxisFormat));

    this.gChart
      .append('g')
      .attr('class', 'axis axis-y')
      .call(d3.axisLeft(y).ticks(10));

    const li = this.legend
      .selectAll('li')
      .data(keys)
      .enter()
      .append('li')
      .text(d => d);

    li.append('span')
      .style('background', d => this.color(d));
  }


  componentDidMount() {
    const { width, height } = this.size.container;

    this.chart = d3.select(this.svg)
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', `0 0 ${width} ${height}`);

    this.gChart = this.chart.append('g');
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
  xAxisFormat: PropTypes.func,
  yAxisFormat: PropTypes.func,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
};

StackedAreaChart.defaultProps = {
  xAxisFormat: d => d,
  yAxisFormat: d => d,
};

export default StackedAreaChart;
