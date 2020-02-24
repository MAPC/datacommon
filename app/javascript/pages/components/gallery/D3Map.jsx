import * as d3 from 'd3';
import React, { useEffect } from 'react';

const drawMap = (newEngland, massachusetts, mapc, props) => {
  const projection = d3.geoAlbers()
    .scale(37000)
    .rotate([71.057, 0])
    .center([0.4, 42.37])
    .translate([960 / 2, 500 / 2]);

  const d3Map = d3.select('.d3-map');
  const path = d3.geoPath().projection(projection);

  d3Map.style('background', props.oceanFill);

  d3Map.append('g')
    .attr('class', 'd3-map__new-england')
    .selectAll('path')
    .data(newEngland.features)
    .enter()
    .append('path')
    .attr('fill', props.newEngFill)
    .attr('stroke', props.newEngLine)
    .attr('stroke-width', '1')
    .attr('stroke-opacity', 0.6)
    .attr('d', path);

  d3Map.append('g')
    .attr('class', 'd3-map__massachusetts')
    .selectAll('path')
    .data(massachusetts.features)
    .enter()
    .append('path')
    .attr('fill', props.maFill)
    .attr('stroke', props.maLine)
    .attr('stroke-width', '1')
    .attr('stroke-opacity', 0.6)
    .attr('d', path);

  if (props.displayMapc) {
    d3Map.append('g')
      .attr('class', 'd3-map__mapc')
      .selectAll('path')
      .data(mapc.features)
      .enter()
      .append('path')
      .attr('fill', props.mapcFill)
      .attr('stroke', props.mapcLine)
      .attr('stroke-width', '1')
      .attr('stroke-opacity', 0.6)
      .attr('d', path);
  }
};

const D3Map = (props) => {
  useEffect(() => {
    Promise.all([
      d3.json('/assets/NewEngland.geojson'),
      d3.json('/assets/Massachusetts.geojson'),
      d3.json('/assets/MAPC.geojson'),
    ]).then((maps) => {
      drawMap(maps[0], maps[1], maps[2], props);
    });
  }, []);
  return (
    <svg className="d3-map" width="700" height="500" viewBox="0 0 700 500" />
  );
};

D3Map.defaultProps = {
  oceanFill: '#F4F6FB',
  newEngFill: '#F0EFE7',
  newEngLine: '#5a5a5a',
  maFill: '#CDE6F6',
  maLine: '#5a5a5a',
  mapcFill: '#1d6a9d',
  mapcLine: '#ffffff',
  displayMapc: true,
};

export default D3Map;
