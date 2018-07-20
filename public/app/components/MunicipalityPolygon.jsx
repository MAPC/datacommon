import React from 'react';

class MunicipalityPolygon extends React.Component {

  componentDidMount() {
    const boundingBox = this.svg.getBoundingClientRect();
    const projection = d3.geoMercator()
      .fitSize([boundingBox.width, boundingBox.height], this.props.feature);
    d3.select(this.svg)
      .append("path")
      .datum(this.props.feature)
      .attr('d', d3.geoPath(projection))
      .style('stroke', '#47B593')
      .style('stroke-width', '2')
      .style('fill', 'none');
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
