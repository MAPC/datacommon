import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';


class PieChart extends React.Component {

  constructor(props) {
    super(props);

    this.renderChart = this.renderChart.bind(this);

    this.state = {
      width: 500,
      height: 500,
    };

    this.pie = d3.pie()
                .sort(null)
                .value(d => d.value);

    this.color = d3.scaleOrdinal(props.colors);
  }


  renderChart() {
    const { width, height } = this.state;
    const radius = Math.min(height, width) / 2;

    const path = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

    const label = d3.arc()
      .outerRadius(radius - 40)
      .innerRadius(radius - 40);

    const arc = this.gChart
      .attr('transform', `translate(${width/2},${height/2})`)
      .selectAll('.arc')
      .data(this.pie(this.props.data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arc.append('path')
      .attr('d', path)
      .attr('fill', d => this.color(d.value));

    const li = this.legend
      .selectAll('li')
      .data(this.props.data)
      .enter()
      .append('li')
      .text(d => d.label);

    li.append('span')
      .style('background', d => this.color(d.value));
  }


  componentDidMount() {
    this.chart = d3.select(`#${this.props.table}-pie`);
    this.gChart = this.chart.append('g');
    this.legend = d3.select(`#${this.props.table}-pie-legend`).append('ul');
    this.renderChart();
  }


  componentDidUpdate() {
    this.renderChart();
  }


  render() {
    return (
      <div className="component chart PieChart">
        <svg id={`${this.props.table}-pie`}></svg>
        <div id={`${this.props.table}-pie-legend`} className="legend"></div>
      </div>
    );
  }

}

PieChart.propTypes = {
  table: PropTypes.string.isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
};

export default PieChart;
