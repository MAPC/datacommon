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
    };

    this.color = d3.scaleOrdinal(props.colors);
  }

  renderChart() {
    const { width, height } = this.state;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };

    const dataValues = this.props.data.reduce((values, d) => values.concat(d.values), [])

    console.log(dataValues)

    let xMax = this.props.data.reduce((max, bar) => {
      let sum = bar.values.reduce((acc, value) => acc + value, 0);
      return Math.max(sum, max)
    }, 0);

    const xScale = d3.scaleLinear()
      .domain(xMax)
      .range([0, width - margin.right - margin.left]);

    const yScale = d3.scaleBand()
      .domain(this.props.data.map(d => d.year))
      .range([0, height - margin.bottom - margin.top])
      .paddingInner(0.1)
      .align(0.1);

    const svg = d3.select(this.svg)
      .attr('width', width)
      .attr('height', height);

    const keys = this.props.categories;

    svg.append('g')
      .selectAll('g')
      .data(d3.stack().keys(keys)(this.props.data))
      .enter().append('g')
      .attr('class', 'bars')
      .attr('fill', d => this.color(d.value))
      .selectAll('rect')
      .data(d => this.props.data)
      .enter().append('rect')
        .attr('y', d => yScale(this.props.data.year))
        .attr('x', d => xScale(dataValues[0]))
        .attr('width', d => xScale(dataValues[1]) - xScale(dataValues[0]))
        .attr('height', yScale.bandwidth());

      svg.append("g")
          .attr("class", "axis")
          .attr("transform", "translate(0,0)")
          .call(d3.axisLeft(yScale));

      svg.append("g")
          .attr("class", "axis")
    	  .attr("transform", "translate(0,"+height+")")
          .call(d3.axisBottom(xScale).ticks(null, "s"))
        .append("text")
          .attr("y", 2)
          .attr("x", xScale(xScale.ticks().pop()) + 0.5)
          .attr("dy", "0.32em")
          .attr("fill", "#000")
          .attr("font-weight", "bold")
          .attr("text-anchor", "start")
          .text("Population")
    	  .attr("transform", "translate("+ (-width) +",-10)");

      const legend = svg.append("g")
        .attr('class', 'legend')
        .selectAll("g")
        .data(keys.slice().reverse())
        .enter().append("g")
        //.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
    	 .attr("transform", function(d, i) { return "translate(-50," + (300 + i * 20) + ")"; });

      legend.append("rect")
          .attr("x", width - 19)
          .attr("width", 19)
          .attr("height", 19)
          .attr("fill", this.color);

      legend.append("text")
          .attr("x", width - 24)
          .attr("y", 9.5)
          .attr("dy", "0.32em")
          .text(function(d) { return d; });

    // const line = d3.line()
    //   .x((d) => xScale(d[0]))
    //   .y((d) => yScale(d[1]))
    //   .curve(d3.curveMonotoneX);
    //
    // svg.append('g')
    //   .attr('class', 'xAxis')
    //   .attr('transform', `translate(${margin.left}, ${height - margin.bottom})`)
    //   .call(d3.axisBottom(xScale));
    // svg.append('g')
    //   .attr('class', 'yAxis')
    //   .attr('transform', `translate(${margin.left}, ${margin.top})`)
    //   .call(d3.axisLeft(yScale));
    // svg.append("path")
    //   .datum(this.props.data[0].values)
    //   .attr("class", "line")
    //   .attr('transform', `translate(${margin.left}, ${margin.top})`)
    //   .attr("d", line);
  }


  componentDidMount() {
    this.renderChart();
  }


  componentDidUpdate() {
    this.renderChart();
  }


  render() {
    return (
      <div className="component chart HorizontalStack">
         <svg ref={el => this.svg = el}></svg>
         <div className="legend">
          <ul>
              <li>
                {this.props.categories}
              </li>
          </ul>
        </div>
      </div>
    );
  }

}

HorizontalStack.propTypes = {
  xAxis: PropTypes.shape({
    label: PropTypes.string.isRequired,
  }).isRequired,
  yAxis: PropTypes.shape({
    label: PropTypes.string.isRequired,
  }).isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    year: PropTypes.string.isRequired,
    values: PropTypes.arrayOf(PropTypes.number).isRequired,
  })).isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default HorizontalStack;
