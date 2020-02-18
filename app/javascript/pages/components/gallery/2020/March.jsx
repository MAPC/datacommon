/* eslint-disable max-len */
import * as d3 from 'd3';
import React, { useState, useEffect } from 'react';

const drawMap = (massachusetts, mapc) => {
  const projection = d3.geoAlbers()
    .scale(36000)
    .rotate([71.057, 0])
    .center([0.33, 42.37])
    .translate([960 / 2, 500 / 2]);

  const marchMap = d3.select('.calendar-viz');
  const path = d3.geoPath().projection(projection);
  marchMap.append('g')
    .attr('class', 'heatmap')
    .selectAll('path')
    .data(massachusetts.features)
    .enter()
    .append('path')
    .attr('fill', '#f0efe7')
    .attr('stroke', '#5a5a5a')
    .attr('stroke-width', '1')
    .attr('stroke-opacity', 0.6)
    .attr('d', path);

  marchMap.append('g')
    .attr('class', 'heatmap')
    .selectAll('path')
    .data(mapc.features)
    .enter()
    .append('path')
    .attr('fill', 'purple')
    .attr('stroke', '#ffffff')
    .attr('stroke-width', '1')
    .attr('stroke-opacity', 0.6)
    .attr('d', path);
};

const March = () => {
  useEffect(() => {
    Promise.all([
      d3.json('/assets/Massachusetts.geojson'),
      d3.json('/assets/MAPC.geojson'),
    ]).then((maps) => {
      drawMap(maps[0], maps[1]);
    });
  }, []);
  return (
    <>
      <h1 className="calendar-viz__title">A Region Under Construction</h1>
      <svg className="calendar-viz" width="600" height="500" style={{border: "1px solid red"}} />
      <p>We all know that the number of new housing units in Greater Boston hasn’t kept up with our growth. But the problem is not just sheer quantity. Whether it’s a growing family that can’t find a big-enough place in the city, roommates who can’t afford to move out on their own, or empty nesters who can’t find a place to downsize in the suburbs, the housing we have in our region is a mismatch for the housing we need, where we need it.</p>
      <p>This map shows, from area to area, what portion of all the housing units are large – that is, having three or more bedrooms. That’s regardless of whether they’re owner-occupied or rental, single family, condo, or apartment. In the areas that are darkest on the map, more than three quarters of all homes have three or more bedrooms. Carlisle has the highest proportion of large homes at 95%. Meanwhile, the lighter areas on the map, which are mostly in more urban communities, have a lower share of units with three bedrooms.</p>
      <p>Especially in suburban communities with mostly large units, the lack of smaller places means that seniors looking to downsize in their own community have few options. They instead stay in places with empty bedrooms.</p>
      <p>Meanwhile, in the mostly urban neighborhoods with a small share of family-sized units, families with children face stiff competition for what little is available: roommate groups with multiple incomes often outbid families. And prices for smaller places are such that members of those roommate groups can’t afford to live on their own.</p>
      <p>MAPC’s new study, <em><a href="https://metrocommon.mapc.org/reports/10">Crowded In and Priced Out: Why it’s so Hard to Find a Family-Sized Unit in Greater Boston</a></em> found that in Boston and a dozen surrounding cities and towns, households with children only occupy 39 percent of larger units. Instead, families squeeze into smaller places, two or more to a bedroom.</p>
      <p>Construction of new family-sized units is necessary, but not sufficient. We also need more smaller, senior-friendly units into which older residents can downsize. We need more one-bedroom apartments in which roommates can live affordably on their own. With a greater number and variety of units on the market, more of our region’s residents will be able to find the homes they need and can afford.</p>
      <p>Read the full report at <a href="https://metrocommon.mapc.org/reports/10">mapc.ma/largeunits.</a></p>
    </>
  );
};

export default March;
