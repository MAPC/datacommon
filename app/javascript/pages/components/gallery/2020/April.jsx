import React from 'react';
import * as d3 from 'd3';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiaWhpbGwiLCJhIjoiY2plZzUwMTRzMW45NjJxb2R2Z2thOWF1YiJ9.szIAeMS4c9YTgNsJeG36gg';

const April = () => {
  d3.csv('/assets/MA-tract-return-rate.csv')
    .then((response) => {
      const map = new mapboxgl.Map({
        container: 'map',
        zoom: 8.6,
        minZoom: 6,
        maxZoom: 13,
        center: [-71.074, 42.362],
        maxBounds: [
          [-74.728, 38.167], // Southwest bound
          [-66.541, 46.032], // Northeast bound
        ],
        style: 'mapbox://styles/ihill/ck5sc5wql2ezb1imqyu8a1miu/draft',
        accessToken: mapboxgl.accessToken,
        hash: true,
      });
      const colorPalette = ['#e9cc2f', '#ab7b07', '#7c5014', '#46520c'];
      const percentageObj = {};
      map.on('load', () => {
        const values = response.map(row => +row.MailReturnRateCen2010);
        const colorPolygon = d3.scaleQuantize()
          .domain([d3.min(values), 100])
          .range(colorPalette);
        const colorExpression = ['match', ['get', 'ct10_id']];
        response.forEach((row) => {
          percentageObj[row.tract] = row.MailReturnRateCen2010;
          colorExpression.push(row.tract, +row.MailReturnRateCen2010 !== 99999 ? colorPolygon(+row.MailReturnRateCen2010) : 'white');
        });
        colorExpression.push('black');
        map.addLayer({
          id: 'tracts-choropleth',
          type: 'fill',
          source: 'composite',
          'source-layer': 'Tracts-2jsl06',
          paint: {
            'fill-color': colorExpression,
          },
        });
        map.moveLayer('tracts-choropleth', 'MAPC municipal borders');
        map.on('click', 'MAPC tracts', (e) => {
          const clickedData = map.queryRenderedFeatures(
            [e.point.x, e.point.y],
            { layers: ['MAPC tracts', 'MAPC municipalities', 'tracts-choropleth'] },
          );
          const tractId = clickedData[0].properties.ct10_id;
          const percentageUnits = percentageObj[tractId] <= 100 ? `${percentageObj[tractId]}%` : 'Data unavailable';
          const tooltipText = `<p class='tooltip__title'>Tract ${tractId} (${clickedData[2].properties.municipal})</p>
          ${percentageUnits}`;
          new mapboxgl.Popup({
            className: 'mapboxgl__tooltip',
          })
            .setLngLat(e.lngLat)
            .setHTML(tooltipText)
            .addTo(map);
        });
      });
    });
  return (
    <>
      <h1 className="calendar-viz__title">Census 2020</h1>
      <div id="map" className="map__container calendar-viz__mapbox" />
      <p>We all know that the number of new housing units in Greater Boston hasn’t kept up with our growth. But the problem is not just sheer quantity. Whether it’s a growing family that can’t find a big-enough place in the city, roommates who can’t afford to move out on their own, or empty nesters who can’t find a place to downsize in the suburbs, the housing we have in our region is a mismatch for the housing we need, where we need it.</p>
      <p>This map shows, from area to area, what portion of all the housing units are large – that is, having three or more bedrooms. That’s regardless of whether they’re owner-occupied or rental, single family, condo, or apartment. In the areas that are darkest on the map, more than three quarters of all homes have three or more bedrooms. Carlisle has the highest proportion of large homes at 95%. Meanwhile, the lighter areas on the map, which are mostly in more urban communities, have a lower share of units with three bedrooms.</p>
      <p>Especially in suburban communities with mostly large units, the lack of smaller places means that seniors looking to downsize in their own community have few options. They instead stay in places with empty bedrooms.</p>
      <p>Meanwhile, in the mostly urban neighborhoods with a small share of family-sized units, families with children face stiff competition for what little is available: roommate groups with multiple incomes often outbid families. And prices for smaller places are such that members of those roommate groups can’t afford to live on their own.</p>
      <p>
MAPC’s new study,
        <em><a href="https://metrocommon.mapc.org/reports/10">Crowded In and Priced Out: Why it’s so Hard to Find a Family-Sized Unit in Greater Boston</a></em>
        {' '}
found that in Boston and a dozen surrounding cities and towns, households with children only occupy 39 percent of larger units. Instead, families squeeze into smaller places, two or more to a bedroom.
      </p>
      <p>Construction of new family-sized units is necessary, but not sufficient. We also need more smaller, senior-friendly units into which older residents can downsize. We need more one-bedroom apartments in which roommates can live affordably on their own. With a greater number and variety of units on the market, more of our region’s residents will be able to find the homes they need and can afford.</p>
    </>
  );
};

export default April;
