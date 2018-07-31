import React from 'react';
import PropTypes from 'prop-types';

class LineChart extends React.Component {

  constructor(props) {
    super(props);

    this.getBounds = this.getBounds.bind(this);
    this.renderChart = this.renderChart.bind(this);

    this.state = {
      width: 500,
      height: 500,
    };
  }

  getBounds() {
    const bounds = this.props.data.reduce((lBounds, line) =>
      line.values.reduce((pBounds, point) => ({
        xMin: Math.min(pBounds.xMin, point[0]),
        xMax: Math.max(pBounds.xMax, point[0]),
        yMin: Math.min(pBounds.yMin, point[1]),
        yMax: Math.max(pBounds.yMax, point[1]),
      }), lBounds
    ), { xMin: null, xMax: null, yMin: null, yMax: null });
    return {
      xMin: this.props.xAxis.min || bounds.xMin,
      xMax: this.props.xAxis.max || bounds.xMax,
      yMin: this.props.yAxis.min || bounds.yMin,
      yMax: this.props.yAxis.max || bounds.yMax,
    };
  }

  renderChart() {
    const { width, height } = this.state;
    const { xMin, xMax, yMin, yMax } = this.getBounds();
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };

    const xScale = d3.scaleLinear()
      .domain([xMin, xMax])
      .range([0, width - margin.right - margin.left]);

    const yScale = d3.scaleLinear()
      .domain([yMin, yMax])
      .range([height - margin.bottom - margin.top, 0]);

    const line = d3.line()
      .x((d) => xScale(d[0]))
      .y((d) => yScale(d[1]))
      .curve(d3.curveMonotoneX);

    const svg = d3.select(this.svg)
      .attr('width', width)
      .attr('height', height);

    svg.append('g')
      .attr('class', 'xAxis')
      .attr('transform', `translate(${margin.left}, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    svg.append('g')
      .attr('class', 'yAxis')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .call(d3.axisLeft(yScale));

    svg.append("path")
      .datum(this.props.data[0].values)
      .attr("class", "line")
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .attr("d", line);
  }


  componentDidMount() {
    this.renderChart();
  }


  componentDidUpdate() {
    this.renderChart();
  }


  render() {
    return (
      <div className="component chart LineChart">
        <svg ref={el => this.svg = el}></svg>
        <div className="legend">
          <ul>
            {this.props.data.map(d => (
              <li>
                {d.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

}

LineChart.propTypes = {
  xAxis: PropTypes.shape({
    label: PropTypes.string.isRequired,
    min: PropTypes.number,
    max: PropTypes.number,
  }).isRequired,
  yAxis: PropTypes.shape({
    label: PropTypes.string.isRequired,
    min: PropTypes.number,
    max: PropTypes.number,
  }).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    values: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  })).isRequired,
};

export default LineChart;
