import React from 'react';
import * as d3 from 'd3';

class MunicipalityPolygon extends React.Component {

  componentDidMount() {
    const measurementPadding = 18;
    const sidePadding = 2;
    const boundingBox = this.svg.getBoundingClientRect();
    if (boundingBox.width == 0) { return; }
    const projection = d3.geoMercator()
      .fitExtent([[
        sidePadding,
        sidePadding
      ], [
        boundingBox.width - sidePadding,
        boundingBox.height - measurementPadding * 2
      ]], this.props.feature);
    const path = d3.geoPath(projection);

    const cityWidth = ((feature) => {
      const [leftBottom, rightTop] = d3.geoBounds(feature);
      const radians = d3.geoDistance(leftBottom, [rightTop[0], leftBottom[1]]);
      return 3959 * radians; // 3959 is the radius of the Earth in miles
    })(this.props.feature);
    const [leftBottom, rightTop] = path.bounds(this.props.feature);
    const svg = d3.select(this.svg);
    svg.append("path")
      .datum(this.props.feature)
      .attr('d', path)
      .style('stroke', '#47B593')
      .style('stroke-width', '1')
      .style('fill', 'none');
    svg.append("line")
      .attr("x1", leftBottom[0])
      .attr("y1", rightTop[1] + measurementPadding)
      .attr("x2", rightTop[0])
      .attr("y2", rightTop[1] + measurementPadding)
      .style("stroke", "#47B593");
    svg.append("line")
      .attr("x1", leftBottom[0])
      .attr("y1", rightTop[1] + measurementPadding * 0.7)
      .attr("x2", leftBottom[0])
      .attr("y2", rightTop[1] + measurementPadding * 1.3)
      .style("stroke", "#47B593");
    svg.append("line")
      .attr("x1", rightTop[0])
      .attr("y1", rightTop[1] + measurementPadding * 0.7)
      .attr("x2", rightTop[0])
      .attr("y2", rightTop[1] + measurementPadding * 1.3)
      .style("stroke", "#47B593");
    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("x", (leftBottom[0] + rightTop[0]) / 2)
      .attr("y", rightTop[1] + measurementPadding * 2)
      .style("font-size", ".8em")
      .style("fill", "#47B593")
      .text(cityWidth.toFixed(1) + " miles");
  }

  render() {

    return (
      <svg
        className="component MunicipalityPolygon"
        ref={el => this.svg = el}
      >
      </svg>
    );
  }

}

export default MunicipalityPolygon;
