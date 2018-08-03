import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';


class HorizontalStackedBarChart extends React.Component {

  constructor(props) {
    super(props);

    this.renderChart = this.renderChart.bind(this);

    const container = {
      width: 500,
      height: 500,
    };

    const margin = {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50
    };

    this.size = {
      width: (container.width - margin.left) - margin.right,
      height: (container.height - margin.top) - margin.bottom,
      margin,
      container,
    };

    this.stack = d3.stack();
    this.color = d3.scaleOrdinal(props.colors);
  }

  renderChart() {
    const { width, height, margin, container } = this.size;

    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleBand()
      .domain(d3.extent(this.props.data, d => d.y))
      .range([height, margin.bottom])
      .paddingInner(0.2);

    this.gChart.attr('transform', `translate(${margin.left},-${margin.bottom})`);

    const keys = [...(new Set(this.props.data.map(d => d.z)))];

    this.color.domain(keys);
    this.stack.keys(keys);

    let data = this.props.data.reduce((acc, row) => {
        acc[row.y] = { ...(acc[row.y] || {}), ...{[row.z]: row.x} };
        return acc;
      }, {});

    data = Object.keys(data).map(yVal => ({ y: yVal, ...data[yVal] }));

    const stackedData = this.stack(data);
    x.domain(d3.extent(stackedData.reduce((a,b) => a.concat(b.map(t => t[1])), []), d => d));

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
      .attr("y", d => y(d.data.y))
      .attr("x", d => x(d[0]) + margin.left)
      .attr("width", d => x(d[1]) - x(d[0]))
      .attr("height", y.bandwidth());

    this.gChart.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x).ticks(10));

    this.gChart.append('g')
      .attr('class', 'axis axis-y')
      .call(d3.axisLeft(y).tickFormat(this.props.yAxisFormat));

    this.gChart.append('text')
      .attr('class', 'axis label')
      .attr('x', container.height / -2)
      .attr('y', 2)
      .attr('transform', 'rotate(-90)')
      .attr("dy", "20")
      .attr('font-size', '12px')
      .style('text-anchor', 'middle')
      .text(this.props.yAxis.label);

    this.gChart.append('text')
      .attr('class', 'axis label')
      .attr('x', container.width / 2)
      .attr('y', container.height)
      .attr("dy", "20")
      .attr('font-size', '12px')
      .style('text-anchor', 'middle')
      .text(this.props.xAxis.label);

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
      <div className="component chart HorizontalStackedBarChart">
        <div className="svg-wrapper">
          <svg ref={el => this.svg = el}></svg>
        </div>
        <div ref={el => this.legendContainer = el} className="legend"></div>
      </div>
    );
  }

}

HorizontalStackedBarChart.propTypes = {
  table: PropTypes.string.isRequired,
  xAxis: PropTypes.shape({
    label: PropTypes.string.isRequired,
  }).isRequired,
  yAxis: PropTypes.shape({
    label: PropTypes.string.isRequired,
  }).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.string.isRequired,
    z: PropTypes.string.isRequired,
  })).isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default HorizontalStackedBarChart;
