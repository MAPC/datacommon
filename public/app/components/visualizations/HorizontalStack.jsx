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

    this.stack = d3.stack();
    this.color = d3.scaleOrdinal(props.colors);
  }

  renderChart() {
    const { width, height } = this.state;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };

    const x = d3.scaleLinear()
      .domain(d3.extent(this.props.data, d => d.x))
      .range([0,width - margin.right - margin.left]);
    const y = d3.scaleBand()
      .domain(d3.extent(this.props.data, d => d.y))
      .range([height - margin.bottom - margin.top, 0])
      .paddingInner(0.1)
      .align(0.1);

    const svg = d3.select(this.svg)
      .attr('width', width)
      .attr('height', height);

    const keys = [...(new Set(this.props.data.map(d => d.z)))];

    y.domain(d3.extent(this.props.data, d => d.x));
    this.color.domain(keys);
    this.stack.keys(keys);

    let data = this.props.data.reduce((acc, row) => {
        acc[row.y] = { ...(acc[row.y] || {}), ...{[row.z]: row.x} };
        return acc;
      }, {});

    data = Object.keys(data).map(yVal => ({ y: yVal, ...data[yVal] }));

    const stackedData = this.stack(data);
    x.domain(d3.extent(stackedData.reduce((a,b) => a.concat(b.map(t => t[1])), [0.01]), d => d));

    console.log(stackedData);

    svg.append('g')
      .selectAll('g')
      .data(stackedData)
      .enter().append('g')
      .attr('class', 'bars')
      .attr('fill', d => this.color(d.key))
      .selectAll('rect')
      .data(d => stackedData)
      .enter().append('rect')
        .attr('y', d => y(this.props.data.year))
        .attr('x', d => x(stackedData[0]))
        .attr('width', d => x(stackedData[1]) - x(stackedData[0]))
        .attr('height', y.bandwidth());

    svg.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x).ticks(10));

    svg.append('g')
      .attr('class', 'axis axis-y')
      .call(d3.axisLeft(y).tickFormat(this.props.yAxisFormat));


      // svg.append("g")
      //     .attr("class", "axis")
    	//   .attr("transform", "translate(0,"+height+")")
      //     .call(d3.axisBottom(x).ticks(null, "s"))
      //   .append("text")
      //     .attr("y", 2)
      //     .attr("x", x(x.ticks().pop()) + 0.5)
      //     .attr("dy", "0.32em")
      //     .attr("fill", "#000")
      //     .attr("font-weight", "bold")
      //     .attr("text-anchor", "start")
      //     .text("Population")
    	//   .attr("transform", "translate("+ (-width) +",-10)");

      const legend = svg.append("g")
        .attr('class', 'legend')
        .selectAll("g")
        .data(keys.slice())
        .enter().append("g")
        //.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
    	 .attr("transform", function(d, i) { return "translate(-50," + (300 + i * 20) + ")"; });

      legend.append("rect")
          .attr("x", width - 50)
          .attr("width", 15)
          .attr("height", 15)
          .attr("fill", this.color);

      legend.append("text")
          .attr("x", width - 35)
          .attr("y", 9.5)
          .attr("dy", "0.24em")
          .text(function(d) { return d; });
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
  data: PropTypes.arrayOf(PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.string.isRequired,
    z: PropTypes.string.isRequired,
  })).isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default HorizontalStack;
