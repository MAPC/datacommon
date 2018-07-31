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

    this.pie = d3.pie()
                .sort(null)
                .value(d => d.value);

    this.color = d3.scaleOrdinal(props.colors);
  }


  renderChart() {
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
        <svg id={`${this.props.table}-stacked-area`}></svg>
        <div id={`${this.props.table}-stacked-area-legend`} className="legend"></div>
      </div>
    );
  }

}

StackedAreaChart.propTypes = {
  table: PropTypes.string.isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
};

export default StackedAreaChart;
