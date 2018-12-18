import React from 'react';
import PropTypes from 'prop-types';

import colors from '~/app/constants/colors';
import { maxToMargin, maxTextToMargin, drawLegend } from '~/app/utils/charts';

const primaryColors = Array.from(colors.CHART.PRIMARY.values());
const extendedColors = Array.from(colors.CHART.EXTENDED.values());

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

class LineChart extends React.Component {

  constructor(props) {
    super(props);

    this.getBounds = this.getBounds.bind(this);
    this.renderChart = this.renderChart.bind(this);

  }

  getBounds() {
    const bounds = this.props.data.reduce((lBounds, line) =>
      line.values.reduce((pBounds, point) => ({
        xMin: (pBounds.xMin ? Math.min(pBounds.xMin, point[0]) : point[0]),
        xMax: (pBounds.xMax ? Math.max(pBounds.xMax, point[0]) : point[0]),
        yMin: (pBounds.yMin ? Math.min(pBounds.yMin, point[1]) : point[1]),
        yMax: (pBounds.yMax ? Math.max(pBounds.yMax, point[1]) : point[1]),
      }), lBounds
    ), { xMin: null, xMax: null, yMin: null, yMax: null });
    return {
      xMin: (this.props.xAxis.min != null || this.props.xAxis.min != undefined
          ? this.props.xAxis.min
          : bounds.xMin),
      xMax: (this.props.xAxis.max != null || this.props.xAxis.max != undefined
          ? this.props.xAxis.max
          : bounds.xMax),
      yMin: (this.props.yAxis.min != null || this.props.yAxis.min != undefined
          ? this.props.yAxis.min
          : bounds.yMin),
      yMax: (this.props.yAxis.max != null || this.props.yAxis.max != undefined
          ? this.props.yAxis.max
          : bounds.yMax),
    };
  }

  renderChart() {
    // Measure and scale
    const { xMin, xMax, yMin, yMax } = this.getBounds();
    const yFormattedMax = this.props.data.reduce((max, line) =>
      Math.max(max, line.values.reduce((lineMax, point) =>
        Math.max(lineMax, this.props.yAxis.format
          ? this.props.yAxis.format(point[1]).length
          : String(point[1]).length), 0)), 0);
    const bonusLeftMargin = maxTextToMargin(yFormattedMax, 12);
    const margin = Object.assign({}, defaultMargin, {
      left: defaultMargin.left + bonusLeftMargin,
    });
    const width = (container.height - margin.left) - margin.right;
    const height = (container.width - margin.top) - margin.bottom;

    const keys = this.props.data.map((d) => d.label);
    const colors = this.props.data.reduce((acc, d) => (d.color ? acc.concat([d.color]) : acc), []);

    this.color = d3.scaleOrdinal(
        colors.length
            ? colors
            : (keys.length > primaryColors.length ? extendedColors : primaryColors)
      )
      .domain(keys);

    const xScale = d3.scaleLinear()
      .domain([xMin, xMax])
      .range([0, width]);
    const xAxis = d3.axisBottom(xScale)
      .ticks(this.props.xAxis.ticks)
      .tickSize(0)
      .tickPadding(10)
      .tickFormat(this.props.xAxis.format);
    const yScale = d3.scaleLinear()
      .domain([yMin, yMax])
      .range([height, 0]);
    const yAxis = d3.axisLeft(yScale)
      .ticks(this.props.yAxis.ticks)
      .tickSize(0)
      .tickPadding(10)
      .tickFormat(this.props.yAxis.format);
    const lineGenerator = d3.line()
      .x(d => xScale(d[0]))
      .y(d => yScale(d[1]));

    // Draw chart
    this.chart.selectAll('*').remove(); // Clear chart before drawing lines

    this.gChart = this.chart.append('g');
    this.gChart.attr('transform', `translate(${margin.left},${margin.top})`);

    this.gChart.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);

    this.gChart.append('g')
      .attr('class', 'axis axis-y')
      .call(yAxis);

    this.props.data.forEach((line, i) => {
      this.gChart.append("path")
        .datum(line.values)
        .attr("class", "line")
        .attr('stroke', this.color(line.label))
        .attr('stroke-width', 1.5)
        .attr('fill', 'none')
        .attr("d", lineGenerator);

      this.gChart.selectAll(`.dots-for-line-${i}`)
        .data(line.values)
        .enter().append("circle")
        .attr("class", `dot dots-for-line-${i}`)
        .attr("cx", d => xScale(d[0]))
        .attr("cy", d => yScale(d[1]))
        .attr('fill', this.color(line.label))
        .attr("r", 3)
    });

    this.chart.append('text')
      .attr('class', 'axis-label')
      .attr('x', (height / -2) - margin.top)
      .attr('y', 2)
      .attr('transform', 'rotate(-90)')
      .attr("dy", "12")
      .style('text-anchor', 'middle')
      .text(this.props.yAxis.label);

    this.chart.append('text')
      .attr('class', 'axis-label')
      .attr('x', width / 2 + margin.left)
      .attr('y', height + margin.top + margin.bottom - 22)
      .attr("dy", "12")
      .style('text-anchor', 'middle')
      .text(this.props.xAxis.label);

    this.legend.selectAll('*').remove();
    drawLegend(this.legend, this.color, keys);
  }


  componentDidMount() {
    const { width, height } = container;

    this.chart = d3.select(this.svg)
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', width)
      .attr('height', height);

    this.legend = d3.select(this.legendContainer);
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
        <div ref={el => this.legendContainer = el} className="legend"></div>
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
    color: PropTypes.string,
    values: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  })).isRequired,
};

export default LineChart;
