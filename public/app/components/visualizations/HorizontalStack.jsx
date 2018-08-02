import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';


class HorizontalStack extends React.Component {

  constructor(props) {
    super(props);

    this.renderChart = this.renderChart.bind(this);

    this.state = {
      width: 500,
      height: 500,
      margin: {
        top: 50,
        right: 50,
        bottom: 20,
        left: 50
      }
    };

    this.stack = d3.stack();
    this.color = d3.scaleOrdinal(props.colors);
  }

  renderChart() {
    const { width, height, margin } = this.state;

    const x = d3.scaleLinear()
      .domain(d3.extent(this.props.data, d => d.x))
      .range([margin.left ,width - margin.right - margin.left]);
    const y = d3.scaleBand()
      .domain(d3.extent(this.props.data, d => d.y))
      .range([height, 0])
      .paddingInner(0.1);

    this.gChart.attr('transform', `translate(${margin.left},${margin.top})`);

    const keys = [...(new Set(this.props.data.map(d => d.z)))];

    y.domain(d3.extent(this.props.data, d => d.y));
    this.color.domain(keys);
    this.stack.keys(keys);

    let data = this.props.data.reduce((acc, row) => {
        acc[row.y] = { ...(acc[row.y] || {}), ...{[row.z]: row.x} };
        return acc;
      }, {});

    data = Object.keys(data).map(yVal => ({ y: yVal, ...data[yVal] }));

    const stackedData = this.stack(data);
    x.domain(d3.extent(stackedData.reduce((a,b) => a.concat(b.map(t => t[1])), [0.01]), d => d));


    const layer = this.gChart
      .selectAll('layer')
      .data(stackedData)
      .enter().append('g')
      .attr('class', 'layer')
      .attr('fill', d => this.color(d.key));

    layer.selectAll("rect")
  	  .data(d => d)
  		.enter().append("rect")
  		  .attr("y", d => y(d.data.y))
  		  .attr("x", d => x(d[0]))
        .attr("width", d => x(d[1]) - x(d[0]))
        .attr("height", y.bandwidth());

    this.gChart.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x).ticks(10));

    this.gChart.append('g')
      .attr('class', 'axis axis-y')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y).tickFormat(this.props.yAxisFormat));

    this.gChart.append('text')
      .attr('class', 'axis label')
      .attr('x', height / -2)
      .attr('y', 2)
      .attr('transform', 'rotate(-90)')
      .attr("dy", "20")
      .attr('font-size', '12px')
      .style('text-anchor', 'middle')
      .text(this.props.yAxis.label);

    this.gChart.append('text')
      .attr('class', 'axis label')
      .attr('x', width / 2)
      .attr('y', height + 15)
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
      <div className="component chart HorizontalStack">
        <div className="svg-wrapper">
          <svg id={`${this.props.table}-stacked-area`} width={width + margin.left} height={height + margin.bottom}></svg>
        </div>
        <div id={`${this.props.table}-stacked-area-legend`} className="legend"></div>
      </div>
    );
  }

}

HorizontalStack.propTypes = {
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

export default HorizontalStack;
