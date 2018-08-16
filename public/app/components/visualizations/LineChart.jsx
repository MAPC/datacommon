import React from 'react';
import PropTypes from 'prop-types';

class LineChart extends React.Component {

  constructor(props) {
    super(props);

    this.getBounds = this.getBounds.bind(this);
    this.renderChart = this.renderChart.bind(this);
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
    // Measure and scale
    const { xMin, xMax, yMin, yMax } = this.getBounds();
    const width = 500;
    const height = 500;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };

    const xScale = d3.scaleLinear()
      .domain([xMin, xMax])
      .range([0, width - margin.right - margin.left]);

    const yScale = d3.scaleLinear()
      .domain([yMin, yMax])
      .range([height - margin.bottom - margin.top, 0]);

    const lineGenerator = d3.line()
      .x(d => xScale(d[0]))
      .y(d => yScale(d[1]));

    // Draw chart
    const svg = d3.select(this.svg)
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 500 500");
    svg.selectAll('*').remove(); // Clear chart before drawing lines

    svg.append('g')
      .attr('class', 'xAxis')
      .attr('transform', `translate(${margin.left}, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    svg.append('g')
      .attr('class', 'yAxis')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .call(d3.axisLeft(yScale));

    this.props.data.forEach((line, i) => {
      svg.append("path")
        .datum(line.values)
        .attr("class", "line")
        .attr('stroke', line.color)
        .attr('stroke-width', 3)
        .attr('fill', 'none')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .attr("d", lineGenerator);

      svg.selectAll(`.dots-for-line-${i}`)
        .data(line.values)
        .enter().append("circle")
        .attr("class", `dot dots-for-line-${i}`)
        .attr("cx", d => xScale(d[0]))
        .attr("cy", d => yScale(d[1]))
        .attr('fill', line.color)
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .attr("r", 5)
    });

    svg.append('text')
      .attr('x', height / -2)
      .attr('y', 2)
      .attr('transform', 'rotate(-90)')
      .attr("dy", "20")
      .style('text-anchor', 'middle')
      .text(this.props.yAxis.label);

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 22)
      .attr("dy", "20")
      .style('text-anchor', 'middle')
      .text(this.props.yAxis.label);

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
        <div className="svg-wrapper">
          <svg ref={el => this.svg = el}></svg>
        </div>
        <div className="legend">
          <ul>
            {this.props.data.map(d => (
              <li key={`${d.label}-${d.color}`}>
                <span className="color-patch" style={{backgroundColor: d.color}}></span>
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
