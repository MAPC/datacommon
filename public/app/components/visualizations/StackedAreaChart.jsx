import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';


class StackedAreaChart extends React.Component {

  constructor(props) {
    super(props);

    this.renderChart = this.renderChart.bind(this);

    this.state = {
      width: 530,
      height: 500,
      margin: {
        left: 50,
        bottom: 20,
      },
    };

    this.stack = d3.stack();
    this.color = d3.scaleOrdinal(props.colors);
  }


  renderChart() {
    const { width, height, margin } = this.state;
    const x = d3.scaleLinear().domain(d3.extent(this.props.data, d => d.x)).range([0,width-margin.left]);
    const y = d3.scaleLinear().range([height,0]);

    const area = d3.area()
      .x(d => x(d.data.x))
      .y0(d => y(d[0]))
      .y1(d => y(d[1]));

    const keys = [...(new Set(this.props.data.map(d => d.z)))];

    this.color.domain(keys);
    this.stack.keys(keys);

    this.gChart.attr('transform', `translate(${margin.left},0)`);

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
  }


  componentDidMount() {
    this.chart = d3.select(`#${this.props.table}-stacked-area`);
    this.gChart = this.chart.append('g');
    this.legend = d3.select(`#${this.props.table}-stacked-area-legend`).append('ul');
    this.renderChart();
  }


  componentDidUpdate() {
    this.renderChart();
  }


  render() {
    const { width, height, margin } = this.state;

    return (
      <div className="component StackedAreaChart">
        <svg id={`${this.props.table}-stacked-area`} width={width + margin.left} height={height + margin.bottom}></svg>
        <div id={`${this.props.table}-stacked-area-legend`} className="legend"></div>
      </div>
    );
  }

}

StackedAreaChart.propTypes = {
  table: PropTypes.string.isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    z: PropTypes.string.isRequired,
  })).isRequired,
  xAxisFormat: PropTypes.func,
  yAxisFormat: PropTypes.func
};

StackedAreaChart.defaultProps = {
  xAxisFormat: d => d,
  yAxisFormat: d => d,
};

export default StackedAreaChart;
