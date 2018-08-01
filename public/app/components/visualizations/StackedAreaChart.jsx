import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';


class StackedAreaChart extends React.Component {

  constructor(props) {
    super(props);

    this.renderChart = this.renderChart.bind(this);

    this.state = {
      width: 500,
      height: 500,
    };

    this.stack = d3.stack();
    this.color = d3.scaleOrdinal(props.colors);
  }


  renderChart() {
    const { width, height } = this.state;
    const x = d3.scaleLinear().domain(d3.extent(this.props.data, d => d.x)).range([0,width]);
    const y = d3.scaleLinear().domain(d3.extent(this.props.data, d => d.y)).range([height,0]);

    const area = d3.area()
      .x(d => x(d.data.x))
      .y0(d => y(d[0]))
      .y1(d => y(d[1]));


    const keys = [...(new Set(this.props.data.map(d => d.z)))];

    x.domain(d3.extent(this.props.data, d => d.x));
    this.color.domain(keys);
    this.stack.keys(keys);

    let data = this.props.data.reduce((acc, row) => {
        acc[row.x] = { ...(acc[row.x] || {}), ...{[row.z]: row.y} };
        return acc;
      }, {});

    data = Object.keys(data).map(xVal => ({ x: xVal, ...data[xVal] }));

    const layer = this.gChart
      .selectAll('.layer')
      .data(this.stack(data))
      .enter()
      .append('g')
      .attr('class', 'layer');

    console.log(this.stack(data));

    layer.append('path')
      .attr('class', 'area')
      .style('fill', d => this.color(d.key))
      .attr('d', area);

    this.gChart
      .append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x));

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
    return (
      <div className="component chart StackedAreaChart">
        <svg id={`${this.props.table}-stacked-area`} width={this.state.width} height={this.state.height}></svg>
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
};

export default StackedAreaChart;
