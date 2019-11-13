import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import colors from '../../constants/colors';
import { maxToMargin, drawLegend, maxTextToMargin, sortKeys, splitPhrase } from '../../utils/charts';

const primaryColors = Array.from(colors.CHART.PRIMARY.values());
const extendedColors = Array.from(colors.CHART.EXTENDED.values());

const LEFT_LABEL_MAX = 20;

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

class StackedBarChart extends React.Component {

  constructor(props) {
    super(props);

    this.renderChart = this.renderChart.bind(this);

    this.stack = d3.stack();


    const container = {
      width: 500,
      height: 500,
    };

    const margin = {
      top: 20,
      right: 20,
      bottom: 50,
      left: 60
    };

    this.size = {
      width: (container.width - margin.left) - margin.right,
      height: (container.height - margin.top) - margin.bottom,
      margin,
      container,
    };
  }

  renderChart() {
    // Measure data and calculate size and margins
    const maxLeftLabel = this.props.horizontal
        ? this.props.data.reduce((acc, d) =>
          Math.max(acc, this.props.xAxis.format
            ? this.props.xAxis.format(d.x).length
            : String(d.x).length), 0)
        : this.props.data.reduce((acc, d) =>
          Math.max(acc, this.props.yAxis.format
            ? this.props.yAxis.format(d.y).length
            : String(d.y).length), 0);
    const clippedMaxLeftLabel = ((this.props.horizontal
      && maxLeftLabel > LEFT_LABEL_MAX)
        ? LEFT_LABEL_MAX
        : maxLeftLabel)
    const bonusLeftMargin = maxTextToMargin(clippedMaxLeftLabel, 12);

    const margin = Object.assign({}, defaultMargin, {
      left: defaultMargin.left + bonusLeftMargin,
    });
    const width = (container.width - margin.left) - margin.right;
    const height = (container.height - margin.top) - margin.bottom;

    // Prepare data and adjust scales
    const keys = sortKeys(this.props.data);
    const colors = this.props.data.reduce((obj, d) =>
        (d.color ? Object.assign(obj, {[d.z]: d.color}) : obj), {});

    this.color = d3.scaleOrdinal(
        Object.keys(colors).length
            ? keys.map((key) => colors[key])
            : (keys.length > primaryColors.length ? extendedColors : primaryColors)
      )
      .domain(keys);

    this.stack.keys(keys);

    const data = this.props.data.reduce((acc, row) => {
      acc[row.x] = { ...(acc[row.x] || {}), ...{[row.z]: row.y} };
      return acc;
    }, {});
    const groups = Object.keys(data).sort();

    const stackedData = this.stack(groups.map(yVal => ({ y: yVal, ...data[yVal] })));

    // Setup scales and axes
    const valScale = d3.scaleLinear()
      .range(this.props.horizontal ? [0, width] : [height, 0])
      .domain(d3.extent(stackedData.reduce((a,b) => a.concat(b.map(t => t[1])), [0]), d => d));

    const catScale = d3.scaleBand()
      .domain(groups)
      .range(this.props.horizontal ? [0, height] : [0, width])
      .paddingInner(0.2);

    // const [xScale, yScale] = this.props.horizontal ? [valScale, catScale] : [catScale, valScale];

    const valAxis = (this.props.horizontal ? d3.axisBottom(valScale) : d3.axisLeft(valScale))
      .ticks(10)
      .tickSize(0)
      .tickPadding(10)
      .tickFormat(this.props.yAxis.format);

    const catAxis = (this.props.horizontal ? d3.axisLeft(catScale) : d3.axisBottom(catScale))
      .tickSize(0)
      .tickPadding(10)
      .ticks(10)
      .tickFormat(this.props.xAxis.format);

    const [xAxis, yAxis] = this.props.horizontal ? [valAxis, catAxis] : [catAxis, valAxis];

    this.chart.selectAll('*').remove(); // Clear chart before drawing
    this.gChart = this.chart.append('g');
    this.gChart.attr('transform', `translate(${margin.left},${margin.top})`);

    const layer = this.gChart
      .selectAll('.layer')
      .data(stackedData)
      .enter()
      .append('g')
      .attr('class', 'layer')
      .attr('fill', d => this.color(d.key));

    // For charts with less than 3 bars, limit the width to one third of the
    // chart's width
    const [ catMin, catMax ] = catScale.range();
    const columnWidth = catScale.domain().length < 3
        ? (((catMax - catMin) / 3) + catMin)
        : catScale.bandwidth();
    const realignment = catScale.domain().length < 3
        ? (catScale.bandwidth() - ((catMax - catMin) / 3)) / 2
        : 0;

    const replaceNaN = x => String(x) === 'NaN' ? null : x;

    layer.selectAll("rect")
  	  .data(d => d)
      .enter()
      .append("rect")
      .attr((this.props.horizontal ? 'y' : 'x'), d => replaceNaN(catScale(d.data.y) + realignment))
      .attr((this.props.horizontal ? 'x' : 'y'), d => replaceNaN(this.props.horizontal ? valScale(d[0]) : valScale(d[1])))
      .attr((this.props.horizontal ? 'width' : 'height'), d => replaceNaN(this.props.horizontal
          ? (valScale(d[1]) - valScale(d[0]))
          : (valScale(d[0]) - valScale(d[1]))))
      .attr((this.props.horizontal ? 'height' : 'width'), columnWidth);

    const xAxisG = this.gChart.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);
    if (this.props.horizontal || groups.length > 4) {
      xAxisG.selectAll("text")
        .attr('transform', `translate(7, 0) rotate(45)`)
        .style('text-anchor', 'start');
    }

    const yAxisG = this.gChart.append('g')
      .attr('class', 'axis axis-y')
      .call(yAxis);
    if (this.props.wrapLeftLabel
        && this.props.horizontal
        && clippedMaxLeftLabel == LEFT_LABEL_MAX) {
      yAxisG.selectAll("text")
        .each(function (x) {
          const text = d3.select(this);
          const rows = splitPhrase(text.text(), LEFT_LABEL_MAX);
          text.text(null);
          rows.forEach((row, i) => {
            const tspan = text.append('tspan');
            tspan.text(row).attr("x", -10).attr("y", (i - (rows.length / 2)) * 15).attr("dy", "1em");
          });
        });
    }

    this.chart.append('text')
      .attr('class', 'axis-label')
      .attr('x', height / -2)
      .attr('y', 0)
      .attr('transform', 'rotate(-90)')
      .attr("dy", "20")
      .attr('font-size', '12px')
      .style('text-anchor', 'middle')
      .text(this.props.horizontal ? this.props.xAxis.label : this.props.yAxis.label);

    this.chart.append('text')
      .attr('class', 'axis-label')
      .attr('x', (container.width / 2) + 15)
      .attr('y', height + (margin.top + margin.bottom) - 20)
      .attr("dy", "20")
      .attr('font-size', '12px')
      .style('text-anchor', 'middle')
      .text(this.props.horizontal ? this.props.yAxis.label : this.props.xAxis.label);

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
      <div className="component chart StackedBarChart">
        <div className="svg-wrapper">
          <svg ref={el => this.svg = el}></svg>
        </div>
        <div ref={el => this.legendContainer = el} className="legend"></div>
      </div>
    );
  }

}

StackedBarChart.propTypes = {
  xAxis: PropTypes.shape({
    label: PropTypes.string.isRequired,
    format: PropTypes.func,
  }).isRequired,
  yAxis: PropTypes.shape({
    label: PropTypes.string.isRequired,
    format: PropTypes.func,
  }).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    x: PropTypes.string.isRequired,
    y: PropTypes.number.isRequired,
    z: PropTypes.string.isRequired,
    color: PropTypes.string,
    order: PropTypes.number,
  })).isRequired,
  horizontal: PropTypes.bool,
};

export default StackedBarChart;
